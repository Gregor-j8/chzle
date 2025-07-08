'use client'
import { v4 as uuidv4 } from 'uuid'
import { useEffect, useState, useCallback } from 'react'
import { Chess } from 'chess.js'
import { supabase } from '@/utils/supabaseClient'
import { useUser } from '@clerk/clerk-react'
import { useRouter } from 'next/navigation'
import { Chessboard } from 'react-chessboard'
import toast from 'react-hot-toast'

export default function ChessGame({ roomId }: { roomId: string }) {
  const router = useRouter()
  const { user } = useUser()
  const [game, setGame] = useState(new Chess())
  const [playerColor, setPlayerColor] = useState<'white' | 'black' | null>(null)
  const [gameReady, setGameReady] = useState(false)
  const [playerNames, setPlayerNames] = useState<{ white: string, black: string }>({ white: '', black: '' })
  const [Ids, setIds] = useState({ white: '', black: '' })
  const [width, setWidth] = useState(600)
  const [hasRefreshed, setHasRefreshed] = useState(false)

  
  useEffect(() => {
    const handleResize = () => {setWidth(Math.min(window.innerWidth - 40, 560))}
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

    const loadGame = useCallback(async () => {
    if (!user) return

    const { data: gameData } = await supabase
      .from('games')
      .select('*')
      .eq('id', roomId)
      .single()

    if (!gameData) return

    const { white_player, black_player, fen, completed } = gameData

    if (completed === true) {
      router.push(`/postgame/${roomId}`)
      return
    }

    if (!white_player || !black_player) return

    setIds({ white: white_player, black: black_player })

    const { data: whiteUser } = await supabase
      .from('users')
      .select('username')
      .eq('id', white_player)
      .single()

    const { data: blackUser } = await supabase
      .from('users')
      .select('username')
      .eq('id', black_player)
      .single()

    setPlayerNames({
      white: whiteUser?.username ?? 'White',
      black: blackUser?.username ?? 'Black',
    })

    if (user.id === white_player && !hasRefreshed) {
      setPlayerColor('white')
      setGameReady(true)
      setHasRefreshed(true)
      router.refresh()
    } else if (user.id === black_player && !hasRefreshed) {
      setPlayerColor('black')
      setGameReady(true)
      setHasRefreshed(true)
      router.refresh()
    }

    if (fen) {
      setGame(new Chess(fen))
    }
  }, [user, roomId, router, hasRefreshed])

  useEffect(() => {
    loadGame()
  }, [loadGame])

  useEffect(() => {
    const channel = supabase
      .channel(`watch_game_completed_${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          const updated = payload.new
          if (updated.completed === true) {
            router.push(`/postgame/${roomId}`)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId, router])

  useEffect(() => {
    if (!gameReady) return

    const channel = supabase
      .channel(`room_moves_${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'moves',
          filter: `gameId=eq.${roomId}`,
        },
        (payload) => {
          const move = payload.new
          if (move.player_id !== user?.id) {
            setGame((prevGame) => {
              const updatedGame = new Chess(prevGame.fen())
              updatedGame.move({ from: move.from, to: move.to, promotion: 'q' })
              return updatedGame
            })
          }
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId, gameReady, user?.id])

  const handleGameComplete = async (completedGame: Chess) => {
    let resultValue: string = 'undecided'

    if (completedGame.isCheckmate()) {
      resultValue = completedGame.turn() === 'w' ? playerNames.black : playerNames.white
    } else if (completedGame.isDraw()) {
      resultValue = 'tie'
    }

    await supabase.from('completedGame').insert([
      {
        id: uuidv4(),
        gameId: roomId,
        created_at: new Date().toISOString(),
        result: resultValue,
        fen: completedGame.fen(),
      },
    ])

    await supabase.from('games').update({ completed: true }).eq('id', roomId)

    await supabase.functions.invoke('adding-chess-moves', {
      body: {
        completedGame: {
          gameId: roomId,
          white_player: Ids.white,
          black_player: Ids.black,
        },
      },
    })
    setHasRefreshed(false)
  }

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (!playerColor || !gameReady || !user) return false

    const turn = game.turn()
    if ((turn === 'w' && playerColor !== 'white') || (turn === 'b' && playerColor !== 'black')) {
      return false
    }

    const move = { from: sourceSquare, to: targetSquare, promotion: 'q' }
    const gameCopy = new Chess(game.fen())
    const result = gameCopy.move(move)
    if (result) {
      setGame(gameCopy);
      (async () => {
        await supabase.from('moves').insert([
          {
            id: uuidv4(),
            gameId: roomId,
            from: result.from,
            to: result.to,
            fen: result.after,
            createdAt: new Date().toISOString(),
            player_id: user.id,
          },
        ])

        await supabase.from('moves').update({ fen: gameCopy.fen() }).eq('gameId', roomId)

        if (gameCopy.isGameOver()) {
          await handleGameComplete(gameCopy)
        }
      })()
      return true
    }
    return false
  }

  if (!gameReady)
    return (
      <div>
        <p className="text-white mt-4">Share this game code: {roomId}</p>
        <button className="ml-2 text-blue-400 hover:underline" onClick={() => {
            navigator.clipboard.writeText(roomId)
            toast.success('Link copied!')}} >
          Click to copy Game Code
        </button>
      </div>
    )

  return (
    <div className="flex flex-col my-[-150px] items-center gap-4 bg-gray-900 p-6 rounded-xl shadow-lg max-w-md mx-auto text-white">
      <div className="text-center space-y-1 text-sm sm:text-base">
        <p>You are playing as {playerColor}</p>
        <p>Turn: {game.turn() === 'w' ? 'White' : 'Black'}</p>
      </div>
      <Chessboard position={game.fen()} onPieceDrop={onDrop} arePiecesDraggable={true}
        arePremovesAllowed={true} boardWidth={width} boardOrientation={playerColor === 'black' ? 'black' : 'white'}/>
    </div>
  )
}
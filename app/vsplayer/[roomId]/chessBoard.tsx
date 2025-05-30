'use client'
import { v4 as uuidv4 } from 'uuid'
import { useEffect, useState, useCallback } from 'react'
import { Chess } from 'chess.js'
import { supabase } from '@/utils/supabaseClient'
import { useUser } from '@clerk/clerk-react'
import { useRouter } from 'next/navigation'
import { Chessboard } from 'react-chessboard'

const ChessGame = ({ roomId }: { roomId: string }) => {
  const router = useRouter()
  const { user } = useUser()
  const [game, setGame] = useState(new Chess())
  const [playerColor, setPlayerColor] = useState<'white' | 'black' | null>(null)
  const [gameReady, setGameReady] = useState(false)
  const [playerNames, setPlayerNames] = useState<{ white: string, black: string }>({ white: '', black: '' })
  const [Ids, setIds] = useState({white: '', black: ''})

  useEffect(() => {}, [gameReady])

const loadGame = useCallback(async () => {
  if (!user) return;

  const { data: gameData } = await supabase
    .from('games')
    .select('*')
    .eq('id', roomId)
    .single();

  const { white_player, black_player, fen } = gameData

  if (!white_player || !black_player) return
    setIds({
    white: white_player,
    black: black_player,
  });

  const { data: whiteUser } = await supabase
    .from('users')
    .select('username')
    .eq('id', white_player)
    .single();

  const { data: blackUser } = await supabase
    .from('users')
    .select('username')
    .eq('id', black_player)
    .single();

  setPlayerNames({
    white: whiteUser?.username ?? 'White',
    black: blackUser?.username ?? 'Black',
  });

  if (user.id === white_player) {
    setPlayerColor('white');
    setGameReady(true);
  } else if (user.id === black_player) {
    setPlayerColor('black');
    setGameReady(true);
  }

  if (fen) {
    setGame(new Chess(fen))
  }
}, [user, roomId])

  useEffect(() => {
    loadGame()
  }, [loadGame])

  useEffect(() => {
  const channel = supabase
    .channel(`watch_players_${roomId}`)
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
        if (updated.white_player && updated.black_player) {
          loadGame()
        }
      }
    ).subscribe()
  return () => {
    supabase.removeChannel(channel)
  }
}, [roomId, loadGame])

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
            player_id: user.id 
          }
        ])
        await supabase
          .from('moves')
          .update({ fen: gameCopy.fen() })
          .eq('gameId', roomId)
      if (gameCopy.isGameOver()) {
        handleGameComplete(gameCopy)
      }
      })()
      return true
    }
    return false
  }

const handleGameComplete = async (completedGame: Chess) => {
    let resultValue: string = "undecided"

    if (completedGame.isCheckmate()) {
      resultValue = completedGame.turn() === 'w' ? playerNames.black : playerNames.white;
    } else if (completedGame.isDraw()) {
      resultValue = "tie"
    }

    await supabase.from('completedGame').insert([{
      id: uuidv4(),
      gameId: roomId,
      created_at: new Date().toISOString(),
      result: resultValue,
      fen: completedGame.fen(),
    }])

    await supabase.functions.invoke('adding-chess-moves', {
      body: {
        completedGame: {
          gameId: roomId,
          white_player: Ids.white,
          black_player: Ids.black
        }
      }
    })
  setTimeout(() => {
    router.push("/vsplayer")
  }, 2000)
}

  if (!gameReady) return <div>Game not ready...</div>
  return (
    <div className="flex flex-col items-center gap-4 bg-gray-900 p-6 rounded-xl shadow-lg max-w-md mx-auto text-white">
      <div className="text-center space-y-1 text-sm sm:text-base">
        <p> You are playing as {playerColor}</p>
        <p>Turn: {game.turn() === 'w' ? 'White' : 'Black'}</p>
      </div>
      <Chessboard position={game.fen()} onPieceDrop={onDrop}
       boardWidth={Math.min(637, typeof window !== "undefined" ? window.innerWidth - 40 : 637)} 
       boardOrientation={playerColor === 'black' ? 'black' : 'white'} />
    </div>
  )
}

export default ChessGame

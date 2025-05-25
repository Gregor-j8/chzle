'use client'
import { v4 as uuidv4 } from 'uuid'
import { useEffect, useState, useCallback } from 'react'
import { Chess } from 'chess.js'
import { supabase } from '@/utils/supabaseClient'
import { useUser } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Chessboard } from 'react-chessboard'

const ChessGame = ({ roomId }: { roomId: string }) => {
  const router = useRouter()
  const { user } = useUser()
  const [game, setGame] = useState(new Chess())
  const [playerColor, setPlayerColor] = useState<'white' | 'black' | null>(null)
  const [gameReady, setGameReady] = useState(false)
  const [playerNames, setPlayerNames] = useState<{ white: string, black: string }>({ white: '', black: '' })

const loadGame = useCallback(async () => {
  if (!user) return;

  const { data: gameData } = await supabase
    .from('games')
    .select('*')
    .eq('id', roomId)
    .single();

  const { white_player, black_player, fen } = gameData;

  if (!white_player || !black_player) return;

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
              console.log("New move received:", move)
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

    if (game.isGameOver()) {
      handleGameComplete()
    }

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
      })()
      return true
    }
    return false
  }

  const handleGameComplete = async() => {
      if (playerColor === 'white') {
      toast.custom(`${playerNames.black} has lost the game congrats ${playerNames.white}`)
        await supabase.from('completedGame').insert([{id: uuidv4(), gameId: roomId,createdAt: new Date().toISOString(), result: playerNames.white,fen: game.fen()}])
    } else if (playerColor === 'black') {
      toast.custom(`${playerNames.white} has lost the game congrats ${playerNames.black}`)
      await supabase.from('completedGame').insert([{id: uuidv4(), gameId: roomId,createdAt: new Date().toISOString(), result: playerNames.black,fen: game.fen()}])
    } else {
      toast.custom(`this game is a draw`)
      await supabase.from('completedGame').insert([{id: uuidv4(),gameId: roomId,createdAt: new Date().toISOString(),result: "tie", fen: game.fen()}])
    }
const { error } = await supabase.functions.invoke('adding-chess-moves', {
  body: { name: 'Functions' },
})
if (error) return console.error(error)
   
setTimeout(() => {
        router.push("/vsplayer")
    }, 2000)
  }

  if (!gameReady) return <div>Game not ready...</div>

  return (
    <div className="flex flex-col items-center gap-2">
      <div>You are playing as <strong>{playerColor}</strong></div>
      <div>Turn: <strong>{game.turn() === 'w' ? 'White' : 'Black'}</strong></div>
      <Chessboard  position={game.fen()} onPieceDrop={onDrop} boardWidth={350} 
      boardOrientation={playerColor === 'black' ? 'black' : 'white'}/>
      {game.isGameOver() && (
        <div className="text-lg font-bold">
          Game Over! {game.isCheckmate() ? 'Checkmate!' : game.isDraw() ? 'Draw!' : ''}
        </div>
      )}
    </div>
  )
}

export default ChessGame

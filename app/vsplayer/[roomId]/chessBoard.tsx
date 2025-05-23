'use client'
import { v4 as uuidv4 } from 'uuid'
import { useEffect, useState, useCallback } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { supabase } from '@/utils/supabaseClient'
import { useUser } from '@clerk/clerk-react'

const ChessGame = ({ roomId }: { roomId: string }) => {
  const { user } = useUser()
  const [game, setGame] = useState(new Chess())
  const [playerColor, setPlayerColor] = useState<'white' | 'black' | null>(null)
  const [gameReady, setGameReady] = useState(false)

  const loadGame = useCallback(async () => {
    if (!user) return
      const { data: gameData } = await supabase
        .from('games')
        .select('*')
        .eq('id', roomId)
        .single()

      const { white_player, black_player, fen } = gameData

      if (!white_player || !black_player) {
        return
      }

      if (user.id === white_player) {
        setPlayerColor('white')
        setGameReady(true)
      } else if (user.id === black_player) {
        setPlayerColor('black')
        setGameReady(true)
      } else {
        return
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
              const newGame = new Chess(prevGame.fen())
              console.log("New move received:", move)
              newGame.move({ from: move.from, to: move.to, promotion: 'q' })
              return newGame
            })
          }
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId, gameReady, user?.id])

  const onDrop = (sourceSquare: string, targetSquare: string, piece: string) => {
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
      })()
      return true
    }
    return false
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

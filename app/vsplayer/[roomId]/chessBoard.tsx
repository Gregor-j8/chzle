'use client'
import { v4 as uuidv4 } from 'uuid'
import { useEffect, useState } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { supabase } from '@/utils/supabaseClient'
import { useUser } from '@clerk/clerk-react'

const ChessGame = ({ roomId }: { roomId: string }) => {
  const { user } = useUser()
  const [game, setGame] = useState(new Chess())
  const [playerColor, setPlayerColor] = useState<'white' | 'black' | null>(null)
  const [gameReady, setGameReady] = useState(false)

  useEffect(() => {
    if (!user) return

    const loadGame = async () => {
      const { data: gameData, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', roomId)
        .single()

      if (error || !gameData) return

      const { white_player, black_player } = gameData

      if (!white_player || !black_player) return <div>waiting for opponent.</div>
      if (user.id === white_player) {
        setPlayerColor('white')
        setGameReady(true)
      } else if (user.id === black_player) {
        setPlayerColor('black')
        setGameReady(true)
      } else {
        return <div>game not available</div>
      }
    }

    loadGame()
  }, [user, roomId])

  useEffect(() => {
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
          setGame((prevGame) => {
            const newGame = new Chess(prevGame.fen())
            console.log("newmove", move)
            newGame.move({ from: move.from, to: move.to, promotion: 'q' })
            return newGame
          })
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId])

  const onDrop = async(sourceSquare: string, targetSquare: string) => {
    if (!playerColor || !gameReady) return false

    const turn = game.turn()
    if ((turn === 'w' && playerColor !== 'white') || (turn === 'b' && playerColor !== 'black')) {
      return false
    }

    const move = { from: sourceSquare, to: targetSquare, promotion: 'q' }
    const gameCopy = new Chess(game.fen())
    const result = gameCopy.move(move)
    if (result) {
      setGame(gameCopy)
      const { } = await supabase.from('moves').insert([
        { id: uuidv4(), gameId: roomId, from: result.from, to: result.to, createdAt: new Date(), player_id: user?.id }
      ])
      return true
    }
    return false
  }

  if (!gameReady) return <div>Loading game...</div>

  return (
    <div className="flex flex-col items-center gap-2">
      <div>You are playing as <strong>{playerColor}</strong></div>
      <Chessboard position={game.fen()} onPieceDrop={onDrop} boardWidth={350} />
    </div>
  )
}

export default ChessGame

'use client'
import { useEffect, useState } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { supabase } from '@/utils/supabaseClient'
import { useUser } from '@clerk/clerk-react'

type Move = {
  id: number
  game_id: string
  move_notation: string
  created_at: string
}

const ChessGame = ({ roomId }: { roomId: string }) => {
  const { user } = useUser()
  const [game, setGame] = useState(new Chess())
  const [playerColor, setPlayerColor] = useState<'white' | 'black' | null>(null)
  const [bothPlayersJoined, setBothPlayersJoined] = useState(false)

  useEffect(() => {
    if (!user) return
    const joinGame = async () => {
      const { data: existingGame, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', roomId)
        .single()

      if (error || !existingGame) {
        const { error: insertError } = await supabase
          .from('games')
          .insert({ id: roomId, white_player: user.id })

        if (!insertError) setPlayerColor('white')
        return
      }

      const { white_player, black_player } = existingGame

      if (white_player === null) {
        await supabase.from('games').update({ white_player: user.id }).eq('id', roomId)
        setPlayerColor('white')
      } else if (black_player === null) {
        await supabase.from('games').update({ black_player: user.id }).eq('id', roomId)
        setPlayerColor('black')
      } else if (white_player === user.id || black_player === user.id) {
        setPlayerColor(white_player === user.id ? 'white' : 'black')
      } else {
        alert('Game is full.')
        return
      }

      if (white_player && black_player) {
        setBothPlayersJoined(true)
      }
    }
    joinGame()
  }, [user, roomId])

  useEffect(() => {
    const channel = supabase
      .channel(`room_moves_${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'moves',
        filter: `game_id=eq.${roomId}`
      }, (payload) => {
        const move = payload.new as Move
        setGame((prevGame) => {
          const newGame = new Chess(prevGame.fen())
          newGame.move(move.move_notation)
          return newGame
        })
      })
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId])

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (!playerColor || !bothPlayersJoined) return false

    const turn = game.turn()
    if ((turn === 'w' && playerColor !== 'white') || (turn === 'b' && playerColor !== 'black')) {
      return false
    }

    const move = { from: sourceSquare, to: targetSquare, promotion: 'q' }
    const gameCopy = new Chess(game.fen())
    const result = gameCopy.move(move)

    if (result) {
      setGame(gameCopy)
      supabase.from('moves').insert([
        { game_id: roomId, move_notation: result.san }
      ])
      return true
    }
    return false
  }

  if (!playerColor) return <div>Joining game...</div>
  if (!bothPlayersJoined) return <div>Waiting for opponent...</div>

  return (
    <div className="flex flex-col items-center gap-2">
      <div>You are playing as <strong>{playerColor}</strong></div>
      <Chessboard position={game.fen()} onPieceDrop={onDrop} boardWidth={350} />
    </div>
  )
}

export default ChessGame

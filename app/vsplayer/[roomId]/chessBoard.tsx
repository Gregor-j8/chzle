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
  const {user} = useUser()
  const [game, setGame] = useState(new Chess())
  const [playerColor, setPlayerColor] = useState<'white' | 'black' | null>(null)

  useEffect(() => {
    if (!user) return;

    const joinGame = async () => {
      const { data: existingGame, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', roomId)
        .single()

      if (error) {
        // If game doesn't exist, create new game with current user as white
        const { data: newGame, error: createError } = await supabase
          .from('games')
          .insert([{ id: roomId, player_white: user.id }])
          .select()
          .single()

        if (!createError) {
          setPlayerColor('white')
        }
        return
      }

      // Assign player to empty slot if available
      if (existingGame.player_white === null) {
        await supabase.from('games').update({ player_white: user.id }).eq('id', roomId)
        setPlayerColor('white')
      } else if (existingGame.player_black === null) {
        await supabase.from('games').update({ player_black: user.id }).eq('id', roomId)
        setPlayerColor('black')
      } else if (
        existingGame.player_white === user.id ||
        existingGame.player_black === user.id
      ) {
        setPlayerColor(existingGame.player_white === user.id ? 'white' : 'black')
      } else {
        alert('Game is full!')
      }
    }

    joinGame()
  }, [user, roomId])
  // 3. Subscribe to moves
  useEffect(() => {
    const channel = supabase
      .channel(`room_moves_${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'moves',
      }, (payload) => {
        const move = payload.new as Move
        if (move.game_id !== roomId) return

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

  // 4. Handle piece drop (only allow moves if it's your turn)
  const onDrop = (sourceSquare: string, targetSquare: string, piece: string) => {
    if (!playerColor) return false

    const turn = game.turn()
    if ((turn === 'w' && playerColor !== 'white') || (turn === 'b' && playerColor !== 'black')) {
      return false
    }

    const move = { from: sourceSquare, to: targetSquare, promotion: 'q' }
    const gameCopy = new Chess(game.fen())
    const result = gameCopy.move(move)

    if (result) {
      setGame(gameCopy)
      supabase.from('moves').insert([{
        game_id: roomId,
        move_notation: result.san
      }])
      return true
    }

    return false
  }

  if (!playerColor) return <div>Joining game...</div>

  return (
    <div>
      <div>You are playing as <strong>{playerColor}</strong></div>
      <Chessboard position={game.fen()} onPieceDrop={onDrop} boardWidth={300} />
    </div>
  )
}

export default ChessGame

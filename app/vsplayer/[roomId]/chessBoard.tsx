'use client';
import { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { supabase } from '@/utils/supabaseClient';

type Move = {
  id: number;
  gameId: string;
  moveNotation: string;
  createdAt: string;
};

const ChessGame = ({ roomId }: { roomId: string }) => {
  const [game, setGame] = useState(new Chess());

  useEffect(() => {
    const channel = supabase
      .channel(`room_moves_${roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'moves', filter: `game_id=eq.${roomId}` },
        (payload) => {
          const newMove = (payload.new as Move).moveNotation;
          setGame((prevGame) => {
            const newGame = new Chess(prevGame.fen());
            newGame.move(newMove);
            return newGame;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const onDrop = (sourceSquare: string, targetSquare: string, piece: string) => {
    const move = { from: sourceSquare, to: targetSquare, promotion: 'q' };
    const gameCopy = new Chess(game.fen());
    const result = gameCopy.move(move);

    if (result) {
      setGame(gameCopy);

      const moveNotation = result.san;
      supabase.from('moves').insert([{ gameId: roomId, moveNotation: moveNotation }])
        .then(({ error }) => {
          if (error) {
            console.error('Error inserting move:', error);
          }
        });

      return true;
    }
    return false;
  }

  return <Chessboard position={game.fen()} onPieceDrop={onDrop} boardWidth={300} />
}

export default ChessGame;

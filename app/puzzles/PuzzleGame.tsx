'use client'
import { useEffect, useState, useCallback } from "react"
import { Chess, Square } from "chess.js"
import { Puzzle } from "@/types"
import { toast } from "react-hot-toast"
import { useUser } from "@clerk/nextjs"
import { trpc } from "@/utils/trpc"

export const usePuzzleGame = (puzzles: Puzzle[] | undefined, puzzleIndex: number) => {
    const user = useUser()
    const mutation = trpc.puzzle.completedPuzzles.useMutation()
    const [game, setGame] = useState(new Chess())
    const [moves, setMoves] = useState<string[]>([])
    const [oldMoves, setOldMoves] = useState<string[]>([])
    const [gameStatus, setGameStatus] = useState("")
    const [playerColor, setPlayerColor] = useState<"w" | "b">("b")

    const makeAIMove = useCallback((currentGame: Chess, movesArray: string[]) => {
        if (currentGame.isGameOver() || movesArray.length === 0) return null
        const moveStr = movesArray[0]
        const move = { from: moveStr.slice(0, 2), to: moveStr.slice(2, 4) }

        const gameCopy = new Chess(currentGame.fen())
        const result = gameCopy.move(move)
        
        if (result) {
        return {
            gameCopy,
            Moves: movesArray.slice(1),
            playedMove: moveStr
        }
        }
        return null
    }, [])

    useEffect(() => {
        if (!puzzles) return
        
        const puzzle = puzzles[puzzleIndex];
        const newGame = new Chess(puzzle.fen);
        const allMoves = puzzle.moves.trim().split(" ")

        const aiColor = newGame.turn()
        setPlayerColor(aiColor === "w" ? "b" : "w")
        
        const aiMoveResult = makeAIMove(newGame, allMoves)
        
        if (aiMoveResult) {
        setGame(aiMoveResult.gameCopy)
        setMoves(aiMoveResult.Moves)
        setOldMoves([aiMoveResult.playedMove])
        } else {
        setGame(newGame)
        setMoves(allMoves)
        setOldMoves([])
        }
    }, [puzzles, puzzleIndex, makeAIMove])

    useEffect(() => {
        setGameStatus(game.turn() === "w" ? "White's turn" : "Black's turn")
    }, [game])

    useEffect(() => {
        if (puzzles && moves.length === 0 && oldMoves.length !== 0) {
            if (!user.user) return     
            mutation.mutate({
                userId: user.user.id,
                puzzleid: puzzles[0].id,
                issolved: true
            });
        toast.success("congrats you solved this puzzle")
         setOldMoves([])
        }
    }, [moves, oldMoves, user])

    const onDrop = useCallback((source: string, target: string) => {
        if (game.turn() !== playerColor) {
        toast.error("it is not your turn", {duration: 3000, position: "top-center"})
        return false
        }
        
        const piece = game.get(source as Square);
        if (!piece || piece.color !== playerColor) {
        toast.error("you can only move your pieces", {duration: 3000, position: "top-center"})
        return false
        }
        
        const gameCopy = new Chess(game.fen())
        const move = gameCopy.move({ from: source, to: target })
        
        if (move) {
        if (move.lan !== moves[0]) {
            toast.error("Wrong move try again", {duration: 3000, position: "top-center"})
            return false;
        }
        
        const currentMove = moves[0]
        const updatedMoves = moves.slice(1)
        setOldMoves(prevOldMoves => [...prevOldMoves, currentMove])
        setMoves(updatedMoves)
        setGame(gameCopy)

        if (!gameCopy.isGameOver() && updatedMoves.length > 0) {
            setTimeout(() => {
            const nextAiMove = makeAIMove(gameCopy, updatedMoves)
            if (nextAiMove) {
                setGame(nextAiMove.gameCopy)
                setMoves(nextAiMove.Moves)
                setOldMoves(prev => [...prev, nextAiMove.playedMove])
            }
            }, 500)
        }
        }

        return move ?? undefined
    }, [game, moves, playerColor, makeAIMove])

    return { game, gameStatus, onDrop, playerColor }
    }
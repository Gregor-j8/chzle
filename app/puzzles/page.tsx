export default async function Puzzles() {
    const res = await fetch("https://lichess.org/api/puzzle/daily");
    const data = await res.json();
  
    console.log(data.puzzle.fen);       // board position
    console.log(data.puzzle.solution);  // array of best moves
  };
  

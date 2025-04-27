export default async function getPuzzles() {
    const data = await fetch('https://lichess.org/api/puzzle/daily').then(r => r.json())
    return data
}
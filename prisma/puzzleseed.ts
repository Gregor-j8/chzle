import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import csv from 'csv-parser';

const prisma = new PrismaClient();

 export default async function seed() {
    console.log("working")
  interface PuzzleRecord {
    id: string;
    fen: string;
    moves: string;
    puzzlerating: string;
    ratingdeviation: string;
    Population: string;
    numberplayed: string;
    theme: string;
    GameUrl: string;
    openingTags?: string;
  }

  const records: PuzzleRecord[] = [];

  await new Promise<void>((resolve, reject) => {
    console.log('Starting to read CSV file...');
    fs.createReadStream('C:\\Users\\grego\\workspace\\chess-site\\lichess_db_puzzle.csv')
      .pipe(csv())
      .on('data', (row) => {
        records.push(row);
      })
      .on('end', resolve)
      .on('error', reject);
  });

for (const row of records) {

    console.log("id", row.id)
    console.log("fen", row.fen)
    console.log("moves", row.moves)
    console.log("puzzlerating", row.puzzlerating)
    console.log("Population", row.Population)
    console.log("numberplayed", row.numberplayed)
    console.log("theme", row.theme)
    console.log("GameUrl", row.GameUrl)
    console.log("openingTags", row.openingTags)

    console.log(row)

  await prisma.puzzle.create({
    data: {
      id: JSON.stringify(row.id),
      fen:  JSON.stringify(row.fen),
      moves: row.moves.trim().split(/\s+/),
      puzzlerating: parseInt(row.puzzlerating),
      ratingdeviation: parseInt(row.ratingdeviation),
      Population: parseInt(row.Population),
      numberplayed: parseInt(row.numberplayed),
      theme: row.theme,
      GameUrl: row.GameUrl,
      openingTags: row.openingTags || null,
    },
  });


}
  console.log('Database seeded successfully');
}

seed()
  .finally(async () => {
    await prisma.$disconnect();
  });

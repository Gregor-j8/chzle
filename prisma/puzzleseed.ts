import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import csv from 'csv-parser';

const prisma = new PrismaClient();
 export default async function seed() {
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
    fs.createReadStream('/lichess_db_puzzle.csv')
      .pipe(csv())
      .on('data', (row) => {
        records.push(row);
      })
      .on('end', resolve)
      .on('error', reject);
  });

for (const row of records) {
  await prisma.puzzle.create({
    data: {
      id: row.id,
      fen: row.fen,
      moves: row.moves,
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
}

seed()
  .finally(async () => {
    await prisma.$disconnect();
  });

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { families, areas } from './schema';
import { DEFAULT_AREAS } from '../../types';

async function backfill() {
  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client);

  const allFamilies = await db.select().from(families);
  console.log(`Found ${allFamilies.length} families`);

  let inserted = 0;
  let skipped = 0;

  for (const family of allFamilies) {
    const existing = await db.select().from(areas).where(eq(areas.familyId, family.id));
    if (existing.length > 0) {
      console.log(`  skip: ${family.name} (${family.id}) — already has ${existing.length} areas`);
      skipped++;
      continue;
    }

    const values = DEFAULT_AREAS.map((area, i) => ({
      familyId: family.id,
      name: area.name,
      iconName: area.iconName,
      colorIndex: area.colorIndex,
      displayOrder: i,
    }));
    await db.insert(areas).values(values);
    console.log(`  inserted: ${family.name} (${family.id}) — ${values.length} areas`);
    inserted++;
  }

  console.log(`\nDone. inserted=${inserted}, skipped=${skipped}`);
  await client.end();
}

backfill().catch((e) => {
  console.error(e);
  process.exit(1);
});

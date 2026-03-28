'use server';

import { db } from '@/lib/db';
import { areas } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { DEFAULT_AREAS, AREA_COLORS } from '@/types';

export async function getAreas(familyId: string) {
  return db.query.areas.findMany({
    where: eq(areas.familyId, familyId),
    orderBy: [asc(areas.displayOrder)],
  });
}

export async function createArea(
  familyId: string,
  name: string,
  iconName: string,
) {
  if (!name.trim()) throw new Error('エリア名を入力してください');
  if (name.length > 50) throw new Error('エリア名は50文字以内で入力してください');

  const existing = await getAreas(familyId);
  const colorIndex = existing.length % AREA_COLORS.length;
  const displayOrder = existing.length;

  const [area] = await db
    .insert(areas)
    .values({
      familyId,
      name: name.trim(),
      iconName,
      colorIndex,
      displayOrder,
    })
    .returning();

  return area;
}

export async function deleteArea(areaId: string) {
  await db.delete(areas).where(eq(areas.id, areaId));
}

export async function initializeDefaultAreas(familyId: string) {
  const existing = await getAreas(familyId);
  if (existing.length > 0) return existing;

  const values = DEFAULT_AREAS.map((area, i) => ({
    familyId,
    name: area.name,
    iconName: area.iconName,
    colorIndex: area.colorIndex,
    displayOrder: i,
  }));

  return db.insert(areas).values(values).returning();
}

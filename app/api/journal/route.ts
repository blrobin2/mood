import { analyze } from '@/lib/ai'
import { getUserByClerkId } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST() {
  const user = await getUserByClerkId()
  const entry = await prisma.journalEntry.create({
    data: {
      userId: user.id,
      content: 'Write about your day!',
    },
  })

  const analysis = await analyze(entry.content)
  await prisma.analysis.create({
    data: {
      ...analysis,
      entryId: entry.id,
    },
  })

  revalidatePath('/journal')

  return NextResponse.json({ data: entry })
}

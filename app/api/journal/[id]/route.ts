import { getUserByClerkId } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

import { analyze } from '@/lib/ai'

type PatchParams = {
  params: {
    id: string
  }
}

export async function PATCH(request: Request, { params }: PatchParams) {
  const { content } = await request.json()
  const user = await getUserByClerkId()
  const updatedEntry = await prisma.journalEntry.update({
    where: {
      userId: user.id,
      id: params.id,
    },
    data: {
      content,
    },
  })

  const analysis = await analyze(updatedEntry.content)

  const updatedAnalysis = await prisma.analysis.upsert({
    where: {
      entryId: updatedEntry.id,
    },
    update: analysis,
    create: { ...analysis, entryId: updatedEntry.id },
  })

  return NextResponse.json({
    data: { ...updatedEntry, analysis: updatedAnalysis },
  })
}

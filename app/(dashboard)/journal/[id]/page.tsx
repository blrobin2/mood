import Editor from '@/components/Editor'
import { getUserByClerkId } from '@/lib/auth'
import prisma from '@/lib/prisma'

type EntryPageProps = {
  params: { id: string }
}

async function getEntry(id: string) {
  const user = await getUserByClerkId()
  const entry = await prisma.journalEntry.findUnique({
    where: {
      id,
      userId: user.id,
    },
    include: {
      analysis: true,
    },
  })

  return entry
}

export default async function EntryPage({ params }: EntryPageProps) {
  const entry = await getEntry(params.id)
  if (!entry) {
    throw new Error('Not found!')
  }

  return <Editor entry={entry} />
}

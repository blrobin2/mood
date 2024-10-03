import EntryCard from '@/components/EntryCard'
import NewEntryCard from '@/components/NewEntryCard'
import { analyze } from '@/lib/ai'
import { getUserByClerkId } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Analysis, JournalEntry, Prisma } from '@prisma/client'
import Link from 'next/link'

async function getEntries() {
  const user = await getUserByClerkId()

  type EntriesWithAnalysis = Prisma.PrismaPromise<
    ({
      analysis: Analysis | null
    } & JournalEntry)[]
  >

  const entries: EntriesWithAnalysis = prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    include: {
      analysis: true,
    },
  })

  return entries
}

export default async function JournalPage() {
  const entries = await getEntries()

  return (
    <div className="p-10 bg-zinc-400/10 h-full">
      <h2 className="text-3xl mb-8">Journal</h2>
      <div className="grid grid-cols-3 gap-4 ">
        <NewEntryCard />
        {entries.map((entry) => (
          <Link key={entry.id} href={`/journal/${entry.id}`}>
            <EntryCard entry={entry} />
          </Link>
        ))}
      </div>
    </div>
  )
}

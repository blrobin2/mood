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

  const analysis = entry.analysis

  const analysisData = [
    { name: 'Subject', value: analysis?.subject },
    { name: 'Summary', value: analysis?.summary },
    { name: 'Mood', value: analysis?.mood },
    { name: 'Negative', value: analysis?.negative?.toString() },
  ]

  return (
    <div className="w-full h-full grid grid-cols-3">
      <div className="col-span-2">
        <Editor entry={entry} />
      </div>
      <div className="border-l border-black/10">
        <div className={`bg-[${analysis?.color}] px-6 py-10`}>
          <h2 className="text-2xl">Analysis</h2>
        </div>
        <div>
          <ul>
            {analysisData.map((item) => (
              <li
                key={item.name}
                className="px-2 py-4 flex items-center justify-between border-b border-t border-black/10"
              >
                <span className="text-lg font-semibold">{item.name}</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

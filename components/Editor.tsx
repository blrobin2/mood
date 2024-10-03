'use client'

import { updateEntry } from '@/lib/api'
import { JournalEntry, Analysis } from '@prisma/client'
import { useState } from 'react'
import { useAutosave } from 'react-autosave'

export default function Editor({
  entry,
}: {
  entry: JournalEntry & { analysis: Analysis | null }
}) {
  const [value, setValue] = useState(entry.content)
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState(entry.analysis)

  const analysisData = [
    { name: 'Subject', value: analysis?.subject },
    { name: 'Summary', value: analysis?.summary },
    { name: 'Mood', value: analysis?.mood },
    { name: 'Negative', value: analysis?.negative?.toString() },
  ]

  useAutosave({
    data: value,
    onSave: async (newValue) => {
      setIsLoading(true)
      const updated = await updateEntry(entry.id, newValue)
      if (!!updated && updated.analysis) {
        setAnalysis(updated.analysis)
      }
      setIsLoading(false)
    },
  })

  return (
    <div className="w-full h-full grid grid-cols-3">
      <div className="col-span-2">
        <div className="w-full h-full">
          {isLoading && <div>&hellip;loading</div>}
          <textarea
            className="w-full h-full p-8 text-xl outline-none"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </div>
      <div className="border-l border-black/10">
        <div
          className="px-6 py-10"
          style={{ backgroundColor: analysis?.color }}
        >
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

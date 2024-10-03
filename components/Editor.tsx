'use client'

import { updateEntry } from '@/lib/api'
import { JournalEntry } from '@prisma/client'
import { useState } from 'react'
import { useAutosave } from 'react-autosave'

export default function Editor({ entry }: { entry: JournalEntry }) {
  const [value, setValue] = useState(entry.content)
  const [isLoading, setIsLoading] = useState(false)

  useAutosave({
    data: value,
    onSave: async (newValue) => {
      setIsLoading(true)
      const updated = await updateEntry(entry.id, newValue)
      setIsLoading(false)
    },
  })

  return (
    <div className="w-full h-full">
      {isLoading && <div>&hellip;loading</div>}
      <textarea
        className="w-full h-full p-8 text-xl outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}

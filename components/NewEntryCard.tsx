'use client'

import { createNewEntry } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function NewEntryCard() {
  const router = useRouter()

  async function onClick() {
    const data = await createNewEntry()
    if (!!data) {
      router.push(`/journal/${data.id}`)
    }
  }

  return (
    <div
      className="cursor-pointer overflow-hidden rounded-lg bg-white shadow"
      onClick={onClick}
    >
      <div className="px-4 py-5 sm:p-6">
        <span className="text-3xl">New Entry</span>
      </div>
    </div>
  )
}

import { JournalEntry } from '@prisma/client'

function getURL(path: string) {
  return window.location.origin + path
}

export async function createNewEntry() {
  const res = await fetch(
    new Request(getURL('/api/journal'), {
      method: 'POST',
    })
  )

  if (res.ok) {
    const data = await res.json()
    return data.data as JournalEntry
  }
}

export async function updateEntry(id: string, content: string) {
  const res = await fetch(
    new Request(getURL(`/api/journal/${id}`), {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    })
  )

  if (res.ok) {
    const data = await res.json()
    return data.data as JournalEntry
  }
}

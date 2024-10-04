'use client'

import { askQuestion } from '@/lib/api'
import { FormEventHandler, useState } from 'react'

export default function Question() {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState()

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setLoading(true)
    const data = new FormData(e.currentTarget)
    const question = data.get('question')
    if (!question) {
      throw new Error("Can't find question!")
    }
    const answer = await askQuestion(question.toString())
    setResponse(answer)
    setLoading(false)
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          disabled={loading}
          type="text"
          id="question"
          name="question"
          placeholder="Ask a question"
          className="border border-black/20 px-4 py-2 text-lg rounded-l-lg"
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-blue-400 px-4 py-2 rounded-r-lg text-lg"
        >
          Ask
        </button>
      </form>
      {loading && <div>&hellip;loading</div>}
      {response && <div>{response}</div>}
    </div>
  )
}

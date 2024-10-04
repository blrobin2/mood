import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'
import { StructuredOutputParser } from '@langchain/core/output_parsers'
import z from 'zod'
import { PromptTemplate } from '@langchain/core/prompts'
import { Document } from '@langchain/core/documents'
import { loadQARefineChain } from 'langchain/chains'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'

export type AnalysisData = {
  mood: string
  summary: string
  subject: string
  negative: boolean
  color: string
}

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z
      .string()
      .describe('the mood of the person who wrote the journal entry.'),
    summary: z.string().describe('quick summary of the entire journal entry.'),
    subject: z.string().describe('the subject of the journal entry.'),
    negative: z
      .boolean()
      .describe(
        'is the journal entry negative? (i.e. does it contain negative emotions?).'
      ),
    color: z
      .string()
      .describe(
        'a hexidecimal color code that represents the mood of the entry. Example #0101FE for blue representing happiness.'
      ),
  })
)

async function getPrompt(content: string) {
  const format_instructions = parser.getFormatInstructions()

  const prompt = new PromptTemplate({
    template:
      'Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { format_instructions },
  })

  const input = await prompt.format({
    entry: content,
  })

  return input
}

export async function analyze(content: string): Promise<AnalysisData> {
  const prompt = await getPrompt(content)

  const model = new ChatOpenAI({
    temperature: 0,
    modelName: 'gpt-3.5-turbo',
    apiKey: process.env['OPENAI_API_KEY'],
  })

  const result = await model.invoke(prompt)

  return parser.parse(result.content.toString())

  //   try {

  //   } catch (e) {
  //     console.error(e)
  //   }
}

type PartialJournalEntry = {
  id: string
  content: string
  createdAt: Date
}

export async function qa(question: string, entries: PartialJournalEntry[]) {
  const docs = entries.map((entry) => {
    return new Document({
      id: entry.id,
      pageContent: entry.content,
      metadata: {
        createdAt: entry.createdAt,
      },
    })
  })

  const model = new ChatOpenAI({
    temperature: 0,
    modelName: 'gpt-3.5-turbo',
    apiKey: process.env['OPENAI_API_KEY'],
  })
  const chain = loadQARefineChain(model)
  const embeddings = new OpenAIEmbeddings({
    model: 'text-embedding-3-small',
  })

  const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings)
  const relevantDocs = await vectorStore.similaritySearch(question)

  const res = await chain.invoke({
    input_documents: relevantDocs,
    question,
  })

  return res.output_text
}

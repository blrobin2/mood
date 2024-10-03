import { auth } from '@clerk/nextjs/server'
import prisma from './prisma'
import { User } from '@prisma/client'

export async function getUserByClerkId() {
  const { userId } = auth()
  if (!userId) {
    throw new Error('Invalid user')
  }

  const user: User = await prisma.user.findUniqueOrThrow({
    where: {
      clerkId: userId,
    },
  })

  return user
}

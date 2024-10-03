import prisma from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const createNewUser = async () => {
  const user = await currentUser()
  if (!user) {
    redirect('/')
  }
  const match = await prisma.user.findUnique({
    where: {
      clerkId: user.id,
    },
  })

  if (!match) {
    await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
      },
    })
  }

  redirect('/journal')
}

export default async function NewUserPage() {
  await createNewUser()

  return <div>...loading</div>
}

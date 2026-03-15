import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const userId = '97a4b906-0ad5-4fcc-bfd6-b2c6abaeb2ca'
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { team: true }
  })
  
  if (user) {
    console.log('User found:', JSON.stringify(user, null, 2))
  } else {
    console.log('User not found with ID:', userId)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

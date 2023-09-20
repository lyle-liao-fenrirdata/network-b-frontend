import { PrismaClient } from "@prisma/client";
import { Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const ipAddress = (process.env.BACKEND_URL || 'http://192.168.17.31').slice(7)
    const context: Prisma.hostCreateInput = {
        hostName: 'main host',
        ipAddress,
        comment: '',
        xApiKey: process.env.PORTAINER_X_API_KEY as string
    }

    await prisma.host.upsert({
        where: {
            ipAddress,
        },
        update: context,
        create: context
    })

}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const asset = await prisma.asset.create({
    data: {
      type: 'hardware',
      subtype: 'laptop',
      name: 'MacBook Pro 16"',
      serialNumber: 'MBP2025-XYZ123',
      purchaseDate: new Date('2024-01-15'),
      purchasePrice: 2999.99,
      currency: 'USD',
      warrantyExpires: new Date('2027-01-15'),
      status: 'active',
      assignedTo: null, // or a valid UUID if you want to assign
      customFields: { color: 'Space Gray', ram: '32GB', storage: '1TB SSD' },
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  })
  console.log({ asset })
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
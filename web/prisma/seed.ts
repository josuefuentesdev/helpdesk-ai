import { AssetType, AssetStatus, PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'


const prisma = new PrismaClient()
async function main() {
  const assets = [];
  for (let i = 0; i < 20; i++) {
    assets.push({
      type: faker.helpers.arrayElement<AssetType>(Object.values(AssetType)),
      subtype: faker.helpers.arrayElement(['laptop', 'desktop', 'monitor', 'printer']),
      name: faker.commerce.productName(),
      serialNumber: faker.string.alphanumeric(12).toUpperCase(),
      purchaseDate: faker.date.past({ years: 3 }),
      purchasePrice: Number(faker.commerce.price({ min: 500, max: 4000, dec: 2 })),
      currency: 'USD',
      warrantyExpires: faker.date.future({ years: 3 }),
      status: faker.helpers.arrayElement<AssetStatus>(Object.values(AssetStatus)),
      assignedTo: null,
      customFields: {
        color: faker.color.human(),
        ram: faker.helpers.arrayElement(['8GB', '16GB', '32GB', '64GB']),
        storage: faker.helpers.arrayElement(['256GB SSD', '512GB SSD', '1TB SSD', '2TB HDD'])
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  }
  const createdAssets = await prisma.asset.createMany({ data: assets });
  console.log({ createdAssets });
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
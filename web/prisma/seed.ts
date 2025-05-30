import { AssetType, AssetStatus, PrismaClient, UserType, type Prisma } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

type CreateAssetData = Prisma.AssetCreateManyInput

async function main() {
  const systemUser = await prisma.user.create({
    data: {
      name: 'System',
      email: 'system@localhost',
      image: 'system.svg',
      type: UserType.SYSTEM,
    },
  });

  // seed users
  const createdUsers = await prisma.user.createMany({
    data: Array.from({ length: 10 }, () => ({
      name: faker.person.firstName(),
      email: faker.internet.email(),
      image: faker.image.avatar(),
    })),
  });

  console.log({ createdUsers });

  const users = await prisma.user.findMany({
    where: {
      type: UserType.USER,
    },
  });

  // seed assets
  const assets: CreateAssetData[] = [];
  const vendors = ['Dell', 'HP', 'Lenovo', 'Apple', 'Microsoft', 'Samsung', 'Acer', 'Asus'];  

  for (let i = 0; i < 20; i++) {
    const type = faker.helpers.arrayElement<AssetType>(Object.values(AssetType));
    const model = `${faker.helpers.arrayElement(['Pro', 'Elite', 'Business', 'Essential'])} ${faker.number.int({ min: 1000, max: 9999 })}`;
    
    const toUpdate = faker.datatype.boolean({ probability: 0.5 });

    assets.push({
      type: type,
      subtype: type === AssetType.HARDWARE 
        ? faker.helpers.arrayElement(['laptop', 'desktop', 'monitor', 'printer']) 
        : type === AssetType.SOFTWARE 
          ? faker.helpers.arrayElement(['os', 'application', 'utility']) 
          : type === AssetType.SAAS 
            ? faker.helpers.arrayElement(['cloud', 'subscription', 'license']) 
            : 'other',
      name: `${faker.helpers.arrayElement(vendors)} ${model}`,
      vendor: faker.helpers.arrayElement(vendors),
      identifier: `AST-${faker.string.alphanumeric(8).toUpperCase()}`,
      model: model,
      serialNumber: faker.string.alphanumeric(12).toUpperCase(),
      purchaseAt: faker.date.past({ years: 3 }),
      warrantyExpiresAt: faker.date.future({ years: 3 }),
      status: faker.helpers.arrayElement<AssetStatus>([AssetStatus.ACTIVE, AssetStatus.ACTIVE, AssetStatus.INACTIVE, AssetStatus.DECOMMISSIONED]), // Weighted towards ACTIVE
      assignedToId: users?.[Math.floor(Math.random() * users.length)]?.id,
      customFields: {
        color: faker.color.human(),
        ram: faker.helpers.arrayElement(['8GB', '16GB', '32GB', '64GB']),
        storage: faker.helpers.arrayElement(['256GB SSD', '512GB SSD', '1TB SSD', '2TB HDD']),
        notes: faker.lorem.sentence()
      },
      createdAt: faker.date.past({ years: 1 }),
      createdById: systemUser.id,
      // ! when updatedAt is undefined prisma will assign current date, many issues in the prisma repository without solutions
      updatedAt: toUpdate ? faker.date.recent() : undefined,
      updatedById: toUpdate ? faker.helpers.arrayElement(users).id : undefined,
      deletedAt: Math.random() > 0.9 ? faker.date.recent() : undefined // 10% chance of being soft-deleted
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
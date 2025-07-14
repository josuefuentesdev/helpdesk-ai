import { AssetType, AssetStatus, PrismaClient, UserType, type Prisma } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

type CreateAssetData = Prisma.AssetCreateManyInput

async function main() {
  const systemUser = await prisma.user.create({
    data: {
      name: 'System',
      email: 'system@localhost',
      image: '/users/system.svg',
      type: UserType.SYSTEM,
    },
  });

  // seed departments
  const departments = [
    'IT',
    'HR',
    'Finance',
    'Marketing',
    'Sales',
    'Operations',
    'Customer Support'
  ];

  await prisma.department.createMany({
    data: departments.map(name => ({
      name
    })),
  });

  // fetch created departments to get their IDs
  const departmentRecords = await prisma.department.findMany();

  // seed users
  const createdUsers = await prisma.user.createMany({
    data: Array.from({ length: 20 }, () => {
      // Randomly assign a department to each user
      const randomDepartmentIndex = Math.floor(Math.random() * departmentRecords.length);
      const randomDepartment = departmentRecords[randomDepartmentIndex];
      
      return {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        image: faker.image.avatar(),
        departmentId: randomDepartment?.id,
        // Use string enum value instead of direct enum reference
        locale: 'en',
        type: UserType.SAMPLE,
        createdById: systemUser.id,
      };
    }),
  });

  console.log({ createdUsers });

  const users = await prisma.user.findMany({
    where: {
      NOT: {
        type: UserType.SYSTEM,
      }
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

  // seed teams
  const teams = [
    'Frontend',
    'Backend',
    'Fullstack',
    'DevOps',
    'QA',
  ];

  await prisma.team.createMany({
    data: teams.map(name => ({
      name
    })),
  });

  const teamRecords = await prisma.team.findMany();

  // seed tickets
  const tickets: Prisma.TicketCreateManyInput[] = [];
  for (let i = 0; i < 50; i++) {
    const toUpdate = faker.datatype.boolean({ probability: 0.5 });
    const assignToTeam = faker.datatype.boolean({ probability: 0.5 });

    tickets.push({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraphs(3),
      priority: faker.helpers.arrayElement(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
      status: faker.helpers.arrayElement(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: toUpdate ? faker.date.recent() : undefined,
      closedAt: Math.random() > 0.7 ? faker.date.recent() : undefined,
      dueAt: faker.date.future({ years: 1 }),
      agentId: assignToTeam ? undefined : users?.[Math.floor(Math.random() * users.length)]?.id,
      teamId: assignToTeam ? teamRecords?.[Math.floor(Math.random() * teamRecords.length)]?.id : undefined,
      createdById: users?.[Math.floor(Math.random() * users.length)]?.id ?? systemUser.id,
    });
  }

  const createdTickets = await prisma.ticket.createMany({ data: tickets });
  console.log({ createdTickets });

  const ticketRecords = await prisma.ticket.findMany();

  // seed comments
  const comments: Prisma.CommentCreateManyInput[] = [];
  for (let i = 0; i < 100; i++) {
    const ticketId = ticketRecords?.[Math.floor(Math.random() * ticketRecords.length)]?.id;
    if (!ticketId) {
      continue;
    }
    comments.push({
      content: faker.lorem.paragraph(),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent(),
      ticketId: ticketId,
      authorId: users?.[Math.floor(Math.random() * users.length)]?.id ?? systemUser.id,
      isInternal: faker.datatype.boolean({ probability: 0.2 }),
    });
  }

  const createdComments = await prisma.comment.createMany({ data: comments });
  console.log({ createdComments });

  // seed notes
  const notes: Prisma.NoteCreateManyInput[] = [];
  for (let i = 0; i < 50; i++) {
    const ticketId = ticketRecords?.[Math.floor(Math.random() * ticketRecords.length)]?.id;
    if (!ticketId) {
      continue;
    }
    notes.push({
      content: faker.lorem.paragraph(),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent(),
      ticketId: ticketId,
      authorId: users?.[Math.floor(Math.random() * users.length)]?.id ?? systemUser.id,
    });
  }

  const createdNotes = await prisma.note.createMany({ data: notes });
  console.log({ createdNotes });
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
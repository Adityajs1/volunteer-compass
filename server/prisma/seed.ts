import { PrismaClient, Role, EventStatus } from '@prisma/client';
// @ts-ignore
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database...');

  // 1. Clear existing data
  await prisma.match.deleteMany();
  await prisma.rsvp.deleteMany();
  await prisma.eventCategory.deleteMany();
  await prisma.eventSkill.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.event.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 2. Insert Core Skills
  const skillNames = ['Environment', 'Tech', 'Logistics', 'Design', 'Teaching', 'Care', 'Healthcare'];
  const skills = [];
  for (const name of skillNames) {
    const s = await prisma.skill.create({ data: { name, category: 'General' } });
    skills.push(s);
  }
  
  // 3. Insert Core Categories
  const categoryNames = ['Education', 'Environment', 'Health', 'Community', 'Technology'];
  const categories = [];
  for (const name of categoryNames) {
    const c = await prisma.category.create({ data: { name } });
    categories.push(c);
  }

  // 4. Create Demo Users
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const volunteer = await prisma.user.create({
    data: {
      name: 'Priya Sharma (Volunteer)',
      email: 'volunteer@example.com',
      passwordHash,
      role: Role.VOLUNTEER,
      city: 'New Delhi',
      latitude: 28.6139,
      longitude: 77.2090,
      skills: {
        create: [
          { skillId: skills.find(s => s.name === 'Teaching')!.id },
          { skillId: skills.find(s => s.name === 'Tech')!.id }
        ]
      }
    }
  });

  const organizer = await prisma.user.create({
    data: {
      name: 'Green Earth NGO (Organizer)',
      email: 'ngo@example.com',
      passwordHash,
      role: Role.ORGANIZER,
      city: 'New Delhi',
      latitude: 28.6139,
      longitude: 77.2090,
    }
  });

  console.log(`Created users: ${volunteer.id}, ${organizer.id}`);

  // 5. Create Events
  const eventsData = [
    {
      title: 'Park Cleanup Drive',
      description: 'Join us to clean the central park and plant new saplings.',
      status: EventStatus.PUBLISHED,
      organizerId: organizer.id,
      city: 'New Delhi',
      latitude: 28.6100,
      longitude: 77.2000,
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // +3 days
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60 * 3), // +3 hours
      maxVolunteers: 20
    },
    {
      title: 'Coding for Seniors',
      description: 'Teach basic computer skills and internet safety to elderly citizens.',
      status: EventStatus.PUBLISHED,
      organizerId: organizer.id,
      city: 'New Delhi',
      latitude: 28.6200,
      longitude: 77.2100,
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // +7 days
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 2), // +2 hours
      maxVolunteers: 5
    }
  ];

  for (const ed of eventsData) {
    const e = await prisma.event.create({ data: ed });
    
    // Add dummy skill requirements
    if (e.title === 'Park Cleanup Drive') {
      await prisma.eventSkill.create({
        data: { eventId: e.id, skillId: skills.find(s => s.name === 'Environment')!.id }
      });
      await prisma.eventCategory.create({
        data: { eventId: e.id, categoryId: categories.find(c => c.name === 'Environment')!.id }
      });
    } else {
      await prisma.eventSkill.create({
        data: { eventId: e.id, skillId: skills.find(s => s.name === 'Teaching')!.id }
      });
      await prisma.eventSkill.create({
        data: { eventId: e.id, skillId: skills.find(s => s.name === 'Tech')!.id }
      });
      await prisma.eventCategory.create({
        data: { eventId: e.id, categoryId: categories.find(c => c.name === 'Technology')!.id }
      });
    }
  }

  console.log('✅ Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

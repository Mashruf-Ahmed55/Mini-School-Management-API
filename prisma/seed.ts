import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      email: 'admin@school.com',
      name: 'Admin User',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  // Create teacher user
  const teacherPassword = await bcrypt.hash('teacher123', 10);
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@school.com' },
    update: {},
    create: {
      email: 'teacher@school.com',
      name: 'John Teacher',
      password: teacherPassword,
      role: Role.TEACHER,
    },
  });

  // Create classes
  const mathClass = await prisma.class.upsert({
    where: { name_section: { name: 'Mathematics', section: 'A' } },
    update: {},
    create: {
      name: 'Mathematics',
      section: 'A',
    },
  });

  const scienceClass = await prisma.class.upsert({
    where: { name_section: { name: 'Science', section: 'B' } },
    update: {},
    create: {
      name: 'Science',
      section: 'B',
    },
  });

  // Create student users and students
  const students = [
    { name: 'Alice Johnson', age: 16 },
    { name: 'Bob Smith', age: 17 },
    { name: 'Charlie Brown', age: 16 },
    { name: 'Diana Prince', age: 18 },
  ];

  for (const studentData of students) {
    const email = `${studentData.name.toLowerCase().replace(/\s+/g, '.')}@student.school.com`;
    const password = await bcrypt.hash('student123', 10);

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: studentData.name,
        password: password,
        role: Role.STUDENT,
      },
    });

    await prisma.student.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        name: studentData.name,
        age: studentData.age,
        userId: user.id,
        classId: Math.random() > 0.5 ? mathClass.id : scienceClass.id,
      },
    });
  }

  console.log('Database seeded successfully!');
  console.log('Login credentials:');
  console.log('Admin: admin@school.com / admin123');
  console.log('Teacher: teacher@school.com / teacher123');
  console.log('Students: *.student.school.com / student123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { QueryStudentsDto } from './dto/query-students.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto) {
    const { name, age, classId } = createStudentDto;

    // Check if class exists
    if (classId) {
      const classExists = await this.prisma.class.findUnique({
        where: { id: classId },
      });
      if (!classExists) {
        throw new BadRequestException('Class not found');
      }
    }

    // Create unique email
    const randomSuffix = Math.floor(Math.random() * 10000);
    const email = `${name.toLowerCase().replace(/\s+/g, '.')}.${randomSuffix}@student.school.com`;

    const password = 'student123';
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: passwordHash,
        role: Role.STUDENT,
      },
    });

    const student = await this.prisma.student.create({
      data: {
        name,
        age,
        classId,
        userId: user.id,
      },
      include: {
        class: true,
        user: {
          select: { id: true, email: true, name: true, role: true },
        },
      },
    });

    return student;
  }

  async findAll(queryDto: QueryStudentsDto) {
    const { page, limit, search } = queryDto;
    const skip = ((page as number) - 1) * limit!;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            {
              user: {
                email: { contains: search, mode: 'insensitive' as const },
              },
            },
          ],
        }
      : {};

    const [students, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        skip,
        take: limit,
        include: {
          class: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.student.count({ where }),
    ]);

    return {
      data: students,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit!),
      },
    };
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        class: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }
}

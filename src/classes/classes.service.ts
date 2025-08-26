import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { EnrollStudentDto } from './dto/enroll-student.dto';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async create(createClassDto: CreateClassDto) {
    const { name, section } = createClassDto;

    try {
      const newClass = await this.prisma.class.create({
        data: { name, section },
      });
      return newClass;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Class with this name and section already exists',
        );
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.class.findMany({
      include: {
        _count: {
          select: { students: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const classData = await this.prisma.class.findUnique({
      where: { id },
      include: {
        students: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!classData) {
      throw new NotFoundException('Class not found');
    }

    return classData;
  }

  async enrollStudent(classId: string, enrollStudentDto: EnrollStudentDto) {
    const { studentId } = enrollStudentDto;

    // Check if class exists
    const classExists = await this.prisma.class.findUnique({
      where: { id: classId },
    });
    if (!classExists) {
      throw new NotFoundException('Class not found');
    }

    // Check if student exists
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Check if student is already enrolled in this class
    if (student.classId === classId) {
      throw new BadRequestException(
        'Student is already enrolled in this class',
      );
    }

    // Enroll student
    const updatedStudent = await this.prisma.student.update({
      where: { id: studentId },
      data: { classId },
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

    return updatedStudent;
  }

  async getClassStudents(classId: string) {
    const classData = await this.prisma.class.findUnique({
      where: { id: classId },
      include: {
        students: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!classData) {
      throw new NotFoundException('Class not found');
    }

    return {
      class: {
        id: classData.id,
        name: classData.name,
        section: classData.section,
      },
      students: classData.students,
    };
  }
}

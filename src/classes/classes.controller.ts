import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { EnrollStudentDto } from './dto/enroll-student.dto';

@Controller('classes')
@UseGuards(JwtAuthGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get()
  findAll() {
    return this.classesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  @Post(':id/enroll')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  enrollStudent(
    @Param('id') id: string,
    @Body() enrollStudentDto: EnrollStudentDto,
  ) {
    return this.classesService.enrollStudent(id, enrollStudentDto);
  }

  @Get(':id/students')
  getClassStudents(@Param('id') id: string) {
    return this.classesService.getClassStudents(id);
  }
}

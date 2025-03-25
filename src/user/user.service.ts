import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async addUser(dto: UserDto) {
    try {
      const user = await this.prismaService.user.create({
        data: {
          first_name: dto.firstName,
          last_name: dto.lastName,
          email: dto.email,
          age: dto.age,
          contact_number: dto.contactNumber,
        },
      });
      return user;
    } catch (error) {
      // Error Handling in case the email is already taken
      if (error instanceof PrismaClientKnownRequestError) {
        if (error?.code === 'P2002') {
          // this code is for unique contraint violation
          throw new ForbiddenException('Credentials Taken');
        }
      }
    }
  }
  async getUsers() {
    const users = await this.prismaService.user.findMany({});
    return users;
  }

  async getUsersOver18() {
    return await this.prismaService.user.findMany({
      where: {
        age: {
          gt: 18,
        },
      },
      orderBy: {
        first_name: 'asc',
      },
    });
  }

  async getUserById(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      // Guard Condition
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
}

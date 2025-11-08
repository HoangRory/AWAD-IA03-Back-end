import { Injectable, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      // Clear, user-facing message for duplicate email
      throw new ConflictException('Email đã tồn tại');
    }

  try {
      // Hash password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const user = this.usersRepository.create({
        email,
        password: hashedPassword,
      });

      await this.usersRepository.save(user);

      // Return user without password
      const { password: _, ...result } = user;
      return result;
    } catch (error: any) {
      // Handle common Postgres / TypeORM errors with clear messages
      // Unique violation (duplicate key)
      if (error?.code === '23505') {
        // Try to extract which field caused the violation
        const detail: string = error.detail || '';
        if (detail.includes('email')) {
          throw new ConflictException('Email đã tồn tại');
        }
        throw new ConflictException('Dữ liệu đã tồn tại (duplicate key)');
      }

      // Query / DB connection errors
      if (error?.name === 'QueryFailedError') {
        // Provide a user-friendly message while avoiding leaking internal SQL
        throw new BadRequestException('Lỗi cơ sở dữ liệu khi tạo người dùng');
      }

      // Fallback: internal server error for unexpected cases
      throw new InternalServerErrorException('Không thể tạo người dùng do lỗi phía máy chủ');
    }
  }
}
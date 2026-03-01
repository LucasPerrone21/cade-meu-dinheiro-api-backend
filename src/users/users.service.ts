import { Injectable, UnauthorizedException } from '@nestjs/common';
import type SignUpDTO from '../auth/dtos/signUpDTO';
import UsersRepository from './users.repository';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(data: SignUpDTO) {
    const { email, name, password, birthDate } = data;

    const userExists = await this.usersRepository.findByEmail(email);

    if (userExists) {
      throw new UnauthorizedException('User already exists');
    }

    if (new Date(birthDate) > new Date()) {
      throw new UnauthorizedException('Birth date cannot be in the future');
    }

    if (new Date().getFullYear() - new Date(birthDate).getFullYear() < 18) {
      throw new UnauthorizedException('User must be at least 18 years old');
    }

    const hashPassword = await hash(password, 10);

    const formattedBirthDate = new Date(birthDate);

    return this.usersRepository.create({
      email,
      name,
      birthDate: formattedBirthDate,
      password: hashPassword,
    });
  }
}

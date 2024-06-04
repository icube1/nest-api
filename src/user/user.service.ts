import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { RoleService } from '../role/role.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
  ) {}

  async findAll() {
    const users = await this.userRepository.find({
        relations: ['role'],
    });

    return users;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
        where: {id: id}, 
        relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException(`There is no user under id ${id}`);
    }

    return user;
  }

  async findOneByEmail(email: string, _p0?: string[]) {
    const user = await this.userRepository.findOne({
      where: { email },
        relations: ['role'],
    })
    .catch(error => {console.log(error)})

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const role = await this.roleService.findOneByName(createUserDto.roleName);

    const user = this.userRepository.create({
        ...createUserDto,
        role,
    });

    return this.userRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const role =
      updateUserDto.roleName &&
      (await this.roleService.findOneByName(updateUserDto.roleName));

    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
      role,
    });

    if (!user) {
      throw new NotFoundException(`There is no user under id ${id}`);
    }

    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    return this.userRepository.remove(user);
  }

  async findById(userId: string) {
    const user = await this.userRepository.findOne({
    where: {
      id: userId,
    }
  });

    if (!user) {
      throw new NotFoundException(`There is no user with id ${userId}`);
    }

    return user;
  }
}

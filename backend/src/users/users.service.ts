import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hashPassword } from 'src/utils/bcrypt';
import { Role } from './entities/role.enum';
import { UserResponseDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({ relations: ['cart', 'orders'] });
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findOneByRecoveryCode(code: number): Promise<User> {
    return await this.usersRepository.findOne({
      where: { recoveryCode: code }
    });
  }

  async findOneWithPassword(email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { email },
      relations: ['cart']
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { password } = updateUserDto;

    if (password) {
      updateUserDto.password = await hashPassword(password);
    }

    try {
   
      const updatedData = await this.usersRepository
        .createQueryBuilder('user')
        .update<User>(User, { ...updateUserDto })
        .where({ id: id })
        .returning('*')
        .updateEntity(true)
        .execute();
      return updatedData.raw[0];
    } catch (error) {
      if (error.code == 23505) {
        throw new ConflictException(
          'Пользователь с таким email или username уже зарегистрирован'
        );
      }
    }
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const user = this.usersRepository.create({
        ...createUserDto,
        password: await hashPassword(createUserDto.password),
        role: createUserDto.email === process.env.ADMIN ? Role.ADMIN : Role.USER
      });

      const newUser = await this.usersRepository.save(user);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = newUser;

      return rest;
    } catch (error) {
      if (error.code == 23505) {
        throw new ConflictException(
          'Пользователь с таким email или email уже зарегистрирован'
        );
      }
    }
  }
}

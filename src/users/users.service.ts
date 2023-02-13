import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseService } from 'src/response/response.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersDocument)
    private usersRepository: Repository<UsersDocument>,
    private readonly responseService: ResponseService,
  ) {}

  //** CHECK EMAIL */
  async getEmail(email: string) {
    const emailCheck = await this.usersRepository.findOne({
      where: { email: email },
    });

    if (emailCheck) {
      return emailCheck;
    }
    throw new HttpException('Email not registered!.', HttpStatus.NOT_FOUND);
  }

  //** CREATE NEW USER */
  async createUsers(data: CreateUserDto) {
    const newUsers = await this.usersRepository.create(data);
    const saveUser = await this.usersRepository.save(newUsers);

    return this.responseService.success(
      true,
      'Created new user successfully!.',
      saveUser,
    );
  }

  //** SEARCH ID USER */
  async getById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    user.password = undefined;

    if (user) {
      return this.responseService.success(
        true,
        'Loaded user data successfully!.',
        user,
      );
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
}

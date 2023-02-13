import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import RegisterDto from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import PostgresErrorCode from 'src/common/database/postgresErrorCodes.enum';
import { ResponseService } from 'src/response/response.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersDocument, UserStatus } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import RequestWithUser from './requestWithUser.interface';
import CreateUserDto from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(UsersDocument)
    private readonly userRepository: Repository<UsersDocument>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly responseService: ResponseService,
  ) {}

  //** NEW REGISTER USER */
  async register(data: RegisterDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    try {
      const createdUser = await this.usersService.createUsers({
        ...data,
        password: hashedPassword,
      });
      // createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'Email or Phone number already exist.',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'User connot be registration!.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //** CHECK USER */
  async getAuthenticatedUser(email: string, hashedPassword: string) {
    try {
      const user = await this.usersService.getEmail(email);
      const isPasswordMatching = await bcrypt.compare(
        hashedPassword,
        user.password,
      );

      if (!isPasswordMatching) {
        throw new HttpException(
          'Password connot be not matching!.',
          HttpStatus.BAD_REQUEST,
        );
      }

      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        'Email or Password connot be found!.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //** VERIFY USER */
  async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //** TOKEN COOKIES */
  async getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = await this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  //** USERS UPDATED */
  async userUpdated(data: any, userId: any): Promise<any> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    try {
      const dateNow = new Date(Date.now());
      const dataParse = {
        email: data.email,
        fullname: data.fullname,
        phone: data.phone,
        password: hashedPassword,
        updated_at: dateNow,
      };
      const dataUpdated = await this.userRepository.update(userId, dataParse);
      return this.responseService.success(
        true,
        'Users successfully update!.',
        dataUpdated,
      );
    } catch {
      throw new HttpException(
        'Update user connot be completed!.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //** FIND USER ID */
  async findUserById(data: any) {
    const findUsers = await this.usersService.getById(data);
    return findUsers;
  }

  //** LOGOUT ACCOUNT */
  async getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}

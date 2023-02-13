import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseService } from 'src/response/response.service';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/register.dto';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import RequestWithUser from './requestWithUser.interface';

@Controller('api/v1/authentication/')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly responseService: ResponseService,
  ) {}

  //** PROFILE */
  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }

  //** REGISTER USER */
  @Post('register')
  async register(@Body() data: RegisterDto) {
    return await this.authenticationService.register(data);
  }

  //** LOGIN USER BY EMAIL*/
  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login-email')
  async logInByEmail(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const { user } = request;
      const cookies = await this.authenticationService.getCookieWithJwtToken(
        user.id,
      );
      response.setHeader('Set-Cookie', cookies);
      user.password = undefined;
      return this.responseService.success(
        true,
        'Login successfully!.',
        response.send(user),
      );
    } catch (error) {
      Logger.log(error);
    }
  }

  //** LOGIN USER BY PHONE*/
  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login-phone')
  async logInByPhone(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ): Promise<any> {
    try {
      const { user } = request;
      const cookies = await this.authenticationService.getCookieWithJwtToken(
        user.id,
      );
      response.setHeader('Set-Cookie', cookies);
      user.password = undefined;
      return this.responseService.success(
        true,
        'Login successfully!.',
        response.send(user),
      );
    } catch (error) {
      Logger.log(error);
    }
  }

  //** UPATED USER */
  @HttpCode(200)
  @Put('updated')
  @UseGuards(JwtAuthenticationGuard)
  async usersUpdated(@Body() data: any, @Req() req: any) {
    const userId = req.user.data.id;
    const checkUserId = await this.authenticationService.findUserById(userId);
    if (!checkUserId) {
      throw new HttpException('User not found!.', HttpStatus.BAD_REQUEST);
    }

    const updateData = await this.authenticationService.userUpdated(
      data,
      userId,
    );
    return updateData;
  }

  //** UPATED USER ADDRESS */
  @HttpCode(200)
  @Put('updated-address')
  @UseGuards(JwtAuthenticationGuard)
  async usersUpdateAddress(@Body() data: any, @Req() req: any) {
    const userId = req.user.data.id;
    const checkUserId = await this.authenticationService.findUserById(userId);

    return checkUserId.data;
  }

  //** LOGOUT USER */
  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader(
      'Set-Cookie',
      await this.authenticationService.getCookieForLogOut(),
    );
    return response.sendStatus(200);
  }
}

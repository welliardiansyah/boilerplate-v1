import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersDocument } from './entities/user.entity';
import { ResponseService } from 'src/response/response.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersDocument])],
  providers: [UsersService, ResponseService],
  exports: [UsersService],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { ResponseService } from 'src/response/response.service';
import { AddressDocument } from './entities/address.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersDocument } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { MessageService } from 'src/message/message.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AddressDocument, UsersDocument]),
    UsersModule,
  ],
  controllers: [AddressController],
  providers: [AddressService, ResponseService, MessageService],
})
export class AddressModule {}

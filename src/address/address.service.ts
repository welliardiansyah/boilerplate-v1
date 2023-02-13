import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RMessage } from 'src/response/response.interface';
import { ResponseService } from 'src/response/response.service';
import { UsersDocument } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { AddressDocument } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressDocument)
    private readonly addressRepository: Repository<AddressDocument>,
    @InjectRepository(UsersDocument)
    private readonly usersRepository: Repository<UsersDocument>,
    private readonly responseService: ResponseService,
  ) {}
}

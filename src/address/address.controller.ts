import {
  Controller,
  Body,
  UseGuards,
  Req,
  BadRequestException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { MessageService } from 'src/message/message.service';
import { ResponseService } from 'src/response/response.service';
import { AddressService } from './address.service';
@Controller('api/v1/address')
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
  ) {}
}

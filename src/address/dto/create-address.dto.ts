import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(6)
  zip_code: string;

  @IsString()
  @IsNotEmpty()
  province: string;
}

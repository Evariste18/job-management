import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email invalide' })
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

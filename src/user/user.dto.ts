import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { Role } from '../common/enums/role.enum';

export class UserDto {
  @ApiProperty() readonly _id: string;
  @ApiProperty() readonly email: string;
  @ApiProperty() readonly role: string;
  @ApiProperty() readonly firstName: string;
  @ApiProperty() readonly lastName: string;
  @ApiProperty() readonly createdAt: Date;
}

export class CreateUserDto {
  @ApiProperty() @IsNotEmpty() firstName: string;
  @ApiProperty() @IsNotEmpty() lastName: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email invalide' })
  email: string;
  @ApiProperty({
    description:
      'Minimum 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 symbole',
  })
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message:
      'Mot de passe trop faible (Minimum 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 symbole)',
  })
  password: string;
  @ApiProperty()
  @IsEnum([Role.ADMIN, Role.RECRUTEUR, Role.CANDIDAT], {
    message: 'Rôle invalide',
  })
  role: string;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @Length(3)
  @ApiProperty({
    description: 'User name',
    minLength: 3,
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    description: 'User email should be a valid email format',
  })
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minLowercase: 1,
    minUppercase: 1,
  })
  @ApiProperty({
    description:
      'Password must contain at least one letter, one number, one special character and be at least 8 characters length',
    minLength: 8,
  })
  password: string;
}

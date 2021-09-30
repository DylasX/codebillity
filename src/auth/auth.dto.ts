import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: `User's email`, default: 'JohnDoe@hotmail.com' })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `User's password`, default: '*********' })
  readonly password: string;
}

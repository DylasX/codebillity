import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `User's name` })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `User's last name` })
  readonly lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: `User's email` })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `User's email` })
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `User's email` })
  readonly password: string;
}

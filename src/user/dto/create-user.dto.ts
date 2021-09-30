import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `User's name`, default: 'John' })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `User's last name`, default: 'Doe' })
  readonly lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: `User's email`, default: 'JohnDoe@hotmail.com' })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `User's phone`, default: '3012391012' })
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `User's password`, default: '********' })
  readonly password: string;
}

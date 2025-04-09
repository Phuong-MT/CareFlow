import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, Matches, IsEmpty, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123',
    description: 'User password (min 6 characters, at least one letter and one number)',
  })
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '40ba1bb6-4e44-455b-bd66-36bc222e3497',
  })
  tenantCode: string;


}

export class loginUser{
  @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
  @IsEmail()  
  email: string;
  @ApiProperty({
    example: 'Password123',
    description: 'User password', 
  })
  @IsString()
  password: string;
}

export class CreateAdminDto{
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123',
    description: 'User password (min 6 characters, at least one letter and one number)',
  })
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;

}
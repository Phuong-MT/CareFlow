import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString,IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'User name' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ example: '0987654321', description: 'User phone' })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({ example: '123 Main St', description: 'User address' })
  @IsOptional()
  @IsString()
  address: string;
}
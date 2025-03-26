import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateTenantDto {
    @IsString()
    @IsNotEmpty()
    name?: string;
  }
  
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  tenantCode: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
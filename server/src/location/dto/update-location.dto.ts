import { IsOptional, IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateLocationDto {
    @IsNotEmpty()
    @IsString()
    tenantCode: string;
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsNotEmpty()
    @IsString()
    address: string;

}

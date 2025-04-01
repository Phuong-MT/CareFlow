import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateLocationDto {
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
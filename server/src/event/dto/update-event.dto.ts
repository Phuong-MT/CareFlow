import { IsOptional, IsString, IsDate, IsNumber } from 'class-validator';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDate()
  date?: Date;


  @IsOptional()
  @IsNumber()
  locationId?: number;
}

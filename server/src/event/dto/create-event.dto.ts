import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsDate, IsNumber } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  description: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dateStart: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dateEnd: Date;

  @IsNotEmpty()
  @IsString()
  tenantCode: string;

  @IsNotEmpty()
  @IsNumber()
  locationId: number;
}
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateQueueDto {
  @IsString()
  @IsNotEmpty()
  tenantCode: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  eventId: number
 
  @IsNotEmpty()
  locationId: number
}
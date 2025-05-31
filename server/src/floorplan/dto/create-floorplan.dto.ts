import { Expose, Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class FloorPlanDto {
  @IsString()
  eventCode: string;
  @IsString()
  floorPlanImageUrl: string;
}
export class UpdatePocLocationDto {
  @IsOptional()
  @IsNumber()
  @Expose()
  id?: number;

  @IsString()
  @Expose()
  name: string;

  @IsNumber()
  @Expose()
  x: number;

  @IsNumber()
  @Expose()
  y: number;

  @IsNumber()
  @Expose()
  floorPlanId: number;
}
export class UpdatePocLocationsRequest {
  floorPlanId: number;
  
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePocLocationDto)
  pocLocations: UpdatePocLocationDto[];
}
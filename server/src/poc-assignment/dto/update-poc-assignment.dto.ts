import { PartialType } from '@nestjs/swagger';
import { CreatePocAssignmentDto } from './create-poc-assignment.dto';

export class UpdatePocAssignmentDto extends PartialType(CreatePocAssignmentDto) {}

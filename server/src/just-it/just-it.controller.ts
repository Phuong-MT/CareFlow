import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JustItService } from './just-it.service';

@Controller('just-it')
export class JustItController {
  constructor(private readonly justItService: JustItService) {}

}

import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiTags } from '@nestjs/swagger';
import { UserExampleDto } from './user-example.controller.dto';

@ApiTags('UserExample')
@Controller({
  path: 'user-example',
  version: '1',
})
export class UserExampleController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async all(): Promise<UserExampleDto[]> {
    const findMany = await this.prisma.userExample.findMany({});
    return findMany.map((it) => ({ ...it }));
  }
}

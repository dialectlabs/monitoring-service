import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserExampleController } from './user-example.controller';

@Module({
  imports: [PrismaService],
  exports: [],
  controllers: [UserExampleController],
})
export class UserExampleModule {}

import { Module } from '@nestjs/common';
import { UserExampleController } from './user-example.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  exports: [],
  controllers: [UserExampleController],
})
export class UserExampleModule {}

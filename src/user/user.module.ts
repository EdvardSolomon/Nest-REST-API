import { Module } from '@nestjs/common';
import { RolesGuard } from './guard';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, RolesGuard]
})
export class UserModule {}

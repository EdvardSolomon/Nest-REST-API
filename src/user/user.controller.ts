import { Controller, Get, Patch, Delete, UseGuards, ParseIntPipe} from '@nestjs/common';
import { HttpCode } from '@nestjs/common/decorators';
import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { HttpStatus } from '@nestjs/common/enums';
import { ApiOkResponse, ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Error401, Error403 } from 'src/auth/entities';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { Roles } from './decorator';
import { EditUserDto } from './dto';
import { UserEntity } from './entities/user.entity';
import { RolesGuard } from './guard';
import { Role } from './models/role.enum';
import { UserService } from './user.service';

@ApiTags('User')

@ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: Error401,
})

@UseGuards(JwtGuard)
@ApiBearerAuth('JWT')
@Controller('users')
export class UserController {
    constructor(private userService: UserService){}

@Get('me')

@ApiOkResponse({
    description: 'return user',
    type: UserEntity,
})

getMe(@GetUser() user: User) {
    return user;
}

@Get(':id')

@ApiOkResponse({
    description: 'return user',
    type: UserEntity,
})


getUserById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) userId: number,
){
    return this.userService.getUserById(userId)
}

@Patch('me')

@ApiOkResponse({
    description: 'return user',
    type: UserEntity,
})

editMe(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
) {
    return this.userService.editUser(userId, dto);
}

@Roles(Role.ADMIN)
@UseGuards(RolesGuard)
@Patch(':id')

@ApiOkResponse({
    description: 'return user',
    type: UserEntity,
})

@ApiForbiddenResponse({
    description:' Insufficient rights',
    type: Error403,
})

editUserById(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: EditUserDto,
) {
    return this.userService.editUser(userId, dto);
}


@HttpCode(HttpStatus.NO_CONTENT)
@Delete('/me')

@ApiNoContentResponse({
    description:'Deleted successfully'
})

deleteMe(
    @GetUser('id') userId: number,
) {
    this.userService.deleteUser(userId);
}

@Roles(Role.ADMIN)
@UseGuards(RolesGuard)
@HttpCode(HttpStatus.NO_CONTENT)
@Delete(':id')

@ApiForbiddenResponse({
    description:' Insufficient rights',
    type: Error403,
})

@ApiNoContentResponse({
    description:'Deleted successfully'
})

deleteUserById(
    @Param('id', ParseIntPipe) userId: number,
) {
    this.userService.deleteUser(userId);
}
}

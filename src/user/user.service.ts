import { Injectable } from '@nestjs/common';
import { ForbiddenException, NotFoundException } from '@nestjs/common/exceptions';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async editUser(userId: number, dto: EditUserDto){
        const user = await this.prisma.user.update({
            where: {
                id: userId
            },
            data:{
                ...dto
            },
        });

        delete user.hash;

        return user;
    }

    async deleteUser(userId: number) {

        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if(!user) {
            throw new NotFoundException("Cant find user");
        }

        await this.prisma.user.delete({
            where: {
                id: userId,
            }
        })
        
    }

    getUserById(userId: number){
        return this.prisma.user.findFirst({
            where:{
                id: userId,
            }
        })
    }
}

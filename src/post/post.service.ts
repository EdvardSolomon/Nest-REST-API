import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { Role } from '../user/models/role.enum';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto';
import { EditPostDto } from './dto/edit-post.dto';

@Injectable()
export class PostService {
    constructor(private prisma: PrismaService){}

    getPosts() {
        return this.prisma.post.findMany()
    }

    getPostById(userId: number, PostId: number) {
        return this.prisma.post.findFirst({
            where:{
                id: PostId,
                userId,
            }
        })
    }

    getPostsByAuthorId(userId: number) {
        return this.prisma.post.findMany({
            where:{
                userId,
            }
        })
    }

    async createPost(userId: number, dto: CreatePostDto) {
        const post = await this.prisma.post.create({
            data: {
                userId,
                title: dto.title,
                content: dto.content,
                link: dto.link,

            },
          });

        return post;
    }

    async editPost(userId: number, postId: number, dto: EditPostDto, role: string) {

        const post = await this.prisma.post.findUnique({
            where: {
                id: postId,
            },
        });

        if(!post || post.userId !== userId && role !== Role.ADMIN) {
            throw new ForbiddenException("Acces to resource denied");
        }

        return this.prisma.post.update({
            where: {
                id: postId,
            },
            data: {
                ...dto,
            }
        })
    }
    
    async deletePostById(userId: number, postId: number, role: string) {

        const post = await this.prisma.post.findUnique({
            where: {
                id: postId,
            },
        });

        if(!post || post.userId !== userId && role !== Role.ADMIN) {
            throw new ForbiddenException("Acces to resource denied");
        }

        await this.prisma.post.delete({
            where: {
                id: postId,
            }
        })
        
    }

}

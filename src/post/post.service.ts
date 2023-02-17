import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto';
import { EditPostDto } from './dto/edit-post.dto';

@Injectable()
export class PostService {
    constructor(private prisma: PrismaService){}

    getPosts(userId: number) {
        return this.prisma.post.findMany({
            where:{
                userId,
            }
        })
    }

    getPostById(userId: number, PostId: number) {
        return this.prisma.post.findFirst({
            where:{
                id: PostId,
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

    async editPost(userId: number, postId: number, dto: EditPostDto) {

        const post = await this.prisma.post.findUnique({
            where: {
                id: postId,
            },
        });

        if(!post || post.userId !== userId) {
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
    
    async deletePostById(userId: number, postId: number) {

        const post = await this.prisma.post.findUnique({
            where: {
                id: postId,
            },
        });

        if(!post || post.userId !== userId) {
            throw new ForbiddenException("Acces to resource denied");
        }

        await this.prisma.post.delete({
            where: {
                id: postId,
            }
        })
        
    }

}

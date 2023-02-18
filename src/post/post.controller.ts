import { Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { CreatePostDto } from './dto';
import { EditPostDto } from './dto/edit-post.dto';
import { PostService } from './post.service';

@UseGuards(JwtGuard)
@Controller('posts')
export class PostController {
    constructor(private postService: PostService){}

    @Get()
    getPosts()
    {
        return this.postService.getPosts()
    }

    @Post()
    createPost(
        @GetUser('id') userId: number,
        @Body() dto: CreatePostDto
    ){
        return this.postService.createPost(userId, dto);
    }

    @Get(':id')
    getPostById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) postId: number,
        ){
            return this.postService.getPostById(userId, postId)
        }

    @Get('/author/:id')
    getPostsByAuthorId(
        @Param('id', ParseIntPipe) userId: number,
        ){
            return this.postService.getPostsByAuthorId(userId)
        }

    @Patch(':id')
    editPost(
        @GetUser('id') userId: number,
        @GetUser('role') role: string,
        @Param('id', ParseIntPipe) postId: number,
        @Body() dto: EditPostDto,
    ){
        return this.postService.editPost(userId, postId, dto, role);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deletePostById(
        @GetUser('id') userId: number,
        @GetUser('role') role: string,
        @Param('id', ParseIntPipe) postId: number,
    ){
        return this.postService.deletePostById(userId, postId, role)
    }
}

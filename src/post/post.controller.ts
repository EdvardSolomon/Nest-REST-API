import { Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Error401, Error403 } from 'src/auth/entities';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { CreatePostDto } from './dto';
import { EditPostDto } from './dto/edit-post.dto';
import { PostEntity } from './entities';
import { PostService } from './post.service';

@ApiTags('Post')
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: Error401,
})


@UseGuards(JwtGuard)
@Controller('posts')
export class PostController {
    constructor(private postService: PostService){}

    @Get()

    @ApiOkResponse({
        description: 'Get all posts',
        type: [PostEntity],
    })

    getPosts()
    {
        return this.postService.getPosts()
    }

    @Post()

    @ApiCreatedResponse({
        description:"Created new post",
        type: PostEntity,
    })

    createPost(
        @GetUser('id') userId: number,
        @Body() dto: CreatePostDto
    ){
        return this.postService.createPost(userId, dto);
    }

    @Get(':id')

    @ApiOkResponse({
        description: 'Get post by id',
        type: PostEntity,
    })

    getPostById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) postId: number,
        ){
            return this.postService.getPostById(userId, postId)
        }

    @Get('/author/:id')

    @ApiOkResponse({
        description: 'Get all posts by author id',
        type: [PostEntity],
    })

    getPostsByAuthorId(
        @Param('id', ParseIntPipe) userId: number,
        ){
            return this.postService.getPostsByAuthorId(userId)
        }

    @Patch(':id')

    @ApiOkResponse({
        description: 'Patched post successfully',
        type: PostEntity,
    })

    @ApiForbiddenResponse({
        description:' Insufficient rights',
        type: Error403,
    })

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

    @ApiNoContentResponse({
        description: 'Post deleted successfully',
    })

    @ApiForbiddenResponse({
        description:' Insufficient rights',
        type: Error403,
    })

    deletePostById(
        @GetUser('id') userId: number,
        @GetUser('role') role: string,
        @Param('id', ParseIntPipe) postId: number,
    ){
        return this.postService.deletePostById(userId, postId, role)
    }
}

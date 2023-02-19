import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreatePostDto {


    @ApiProperty({
        description: 'Title field',
        example: 'New Post Example',
    })

    @IsString()
    @IsNotEmpty()
    title: string


    @ApiProperty({
        description: 'Content field',
        example: 'Example content of post',
    })

    @IsString()
    @IsOptional()
    content?: string


    @ApiProperty({
        description: 'Link field',
        example: 'youtube.com',
    })

    @IsString()
    @IsNotEmpty()
    link: string

};
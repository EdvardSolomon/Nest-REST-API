import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class EditPostDto {

    @ApiProperty({
        description: 'Title field',
        example: 'New Title',
    })

    @IsString()
    @IsOptional()
    title?: string

    @ApiProperty({
        description: 'Content field',
        example: 'New content',
    })

    @IsString()
    @IsOptional()
    content?: string

    @ApiProperty({
        description: 'Link field',
        example: 'https://github.com/EdvardSolomon/Nest-REST-API',
    })

    @IsString()
    @IsOptional()
    link?: string

};
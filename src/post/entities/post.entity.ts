import { Post } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { type } from "os";

export class PostEntity implements Post {

    @ApiProperty()
    id: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    title: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    link: string;
 
    @ApiProperty()
    userId: number;

}
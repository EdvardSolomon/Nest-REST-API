import { User } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class UserEntity implements User {

    @ApiProperty()
    id: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
  
    @ApiProperty()
    email: string;

    @ApiProperty()
    hash: string;
  
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;
  
    @ApiProperty()
    role: string;

}
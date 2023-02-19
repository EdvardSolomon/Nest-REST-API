import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsOptional } from "class-validator";

export class EditUserDto {

    @ApiProperty({
        description: 'Email field',
        example: 'stopwar@gmail.com',
    })

    @IsEmail()
    @IsOptional()
    email?: string

    @ApiProperty({
        description: 'First name field',
        example: 'Taras',
    })

    @IsString()
    @IsOptional()
    firstName?: string

    @ApiProperty({
        description: 'Last name field',
        example: 'Bulba',
    })

    @IsString()
    @IsOptional()
    lastName?: string

}
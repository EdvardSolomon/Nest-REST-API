import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDto {

    @ApiProperty({
        description: 'Email field',
        example: 'example@gmail.com',
    })

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'password field',
        example: 'examplepassword',
    })
    
    @IsString()
    @IsNotEmpty()
    password: string;
}
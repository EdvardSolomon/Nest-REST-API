import { ApiProperty } from "@nestjs/swagger";
export class Error400 {

    @ApiProperty()
    statusCode: number; 

    @ApiProperty()
    message: [string];

    @ApiProperty()
    error: string;

}

export class Error401 {

    @ApiProperty()
    statusCode: number; 

    @ApiProperty()
    message: string;

}

export class Error403 {

    @ApiProperty()
    statusCode: 403;

    @ApiProperty()
    message: "Forbidden resource";

    @ApiProperty()
    error: "Forbidden";
}
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { AuthEntity, Error400 } from "./entities";

@ApiTags('Auth')

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('signup')

    @ApiCreatedResponse({
        description: 'Created user and return access_token',
        type: AuthEntity
    })

    @ApiBadRequestResponse({
        description: 'Expect status 400 on empty email, or email not email, or empty password',
        type: Error400
    })

    signup(@Body() dto: AuthDto){
        return this.authService.signup(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')

    @ApiOkResponse({
        description: 'Comfirmed signin and return access_token',
        type: AuthEntity
    })

    @ApiBadRequestResponse({
        description: 'Expect status 400 on empty email, or email not email, or empty password',
        type: Error400
    })

    signin(@Body() dto: AuthDto){
        return this.authService.signin(dto);
    }
}
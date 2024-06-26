import {
  Controller,
  Get,
  Param,
  Query,
  Redirect,
  HttpRedirectResponse,
  Res,
  Req,
  Inject,
  Post,
  Body,
  UseFilters,
  HttpException,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { User, User as UserModel } from '@prisma/client';
import { ValidationFilter } from 'src/validation/validation.filter';
import { SignUpRequest, signUpSchema } from 'src/model/sign-up.model';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { TimeInterceptor } from 'src/time/time.interceptor';
import { Auth } from 'src/auth/auth.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';

@Controller('/api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post('/create')
  @UseFilters(ValidationFilter)
  @UseInterceptors(TimeInterceptor)
  async signupUser(
    @Body(new ValidationPipe(signUpSchema)) userData: SignUpRequest,
  ): Promise<UserModel> {
    if (!userData.name)
      throw new HttpException({ code: 400, message: 'Name is required' }, 400);

    return this.userService.createUser(userData);
  }

  @Get('/current')
  @Roles(['admin', 'owner'])
  showCurrentUser(@Auth() user: User) {
    return {
      data: `hello user ${user.name} ${user.email}`,
    };
  }

  @Get('/log')
  log(@Query('message') mesage: string): HttpRedirectResponse {
    this.logger.info(`Logging ${mesage}`);
    return {
      url: `Logging ${mesage}`,
      statusCode: 200,
    };
  }

  @Get('/redirect')
  @Redirect()
  redirect(): HttpRedirectResponse {
    this.logger.info('Redirecting to /api/user/123?name=John');
    return {
      url: '/api/user/123?name=John',
      statusCode: 301,
    };
  }

  @Get('/set-cookie')
  setCookie(@Query('name') name: string, @Res() res: Response) {
    res.cookie('name', name);
    res.status(200).send('Cookie has been set');
  }

  @Get('/get-cookie')
  getCookie(@Req() request: Request) {
    return request.cookies['name'];
  }

  @Get(':id')
  getUserDetail(@Param('id') id: string, @Query('name') name: string): string {
    return `Halo User ${id} dan nama saya ${name}`;
  }
}

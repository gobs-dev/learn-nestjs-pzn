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
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { User as UserModel } from '@prisma/client';

@Controller('/api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post('/create')
  async signupUser(
    @Body() userData: { name?: string; email: string },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
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

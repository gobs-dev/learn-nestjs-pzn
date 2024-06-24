import {
  Controller,
  Get,
  Header,
  Param,
  Query,
  HttpCode,
  Redirect,
  HttpRedirectResponse,
  Res,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get()
  // @Header('Content-Type', 'application/json')
  // @HttpCode(200)
  // getUser(@Query('name') name: string) {
  //   return this.userService.getUser(name);
  // }

  @Get('/redirect')
  @Redirect()
  redirect(): HttpRedirectResponse {
    return {
      url: '/api/user',
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

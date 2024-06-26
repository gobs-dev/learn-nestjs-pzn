import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}
  async use(req: any, res: any, next: () => void) {
    const token = req.headers['x-auth'];
    const user = await this.prisma.user.findUnique({ where: { email: token } });
    if (!user) throw new HttpException('Unauthorized', 401);

    req.user = user;
    next();
  }
}

import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    res.on('finish', () => {
      const { method, originalUrl } = req;
      const { statusCode } = res;
      const message = `${method} ${originalUrl} ${statusCode}`;
      this.logger.log(message);
    });

    next();
  }
}

import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, baseUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      if (statusCode < 400) {
        return this.logger.log(
          `${method} ${baseUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
        );
      } else if (statusCode < 500) {
        return this.logger.warn(
          `${method} ${baseUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
        );
      } else {
        return this.logger.error(
          `${method} ${baseUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
        );
      }
    });

    next();
  }
}

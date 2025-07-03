import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (key: string | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest() as any;
    return key ? req.user?.[key] : req.user
  },
)

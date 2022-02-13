import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

/**
 * App Controller
 * Accepts requests on the root URL.
 * Used for redirecting api.wmgtss.com to /docs
 */
@Controller()
export class AppController {
  // GET: /
  @Get()
  @ApiExcludeEndpoint()
  redirect(@Res() res) {
    return res.redirect('/docs');
  }
}

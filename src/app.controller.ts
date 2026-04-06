import { Controller, Get } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@AllowAnonymous()
@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}

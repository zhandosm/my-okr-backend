import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(userId: string): string {
    console.log(userId);
    return 'Hello World!';
  }
}

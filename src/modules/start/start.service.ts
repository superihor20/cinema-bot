import { Injectable } from '@nestjs/common';

@Injectable()
export class StartService {
  greetingsMessage = (): string => {
    return `Hi, welcome to the meeting bot`;
  };
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
  getStatus() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'API is running smoothly',
    };
  }
}

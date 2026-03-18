import { Controller, Get } from '@nestjs/common';
import { HelperService } from './helper.service';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Helper')
@Controller('help')
export class HelperController {
  constructor(private readonly helperService: HelperService) {}

  @Get()
  @ApiProperty({
    description: 'Get API status',
    example: {
      status: 'ok',
      timestamp: '2024-06-01T12:00:00.000Z',
      message: 'API is running smoothly',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'API status retrieved successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  getStatus() {
    return this.helperService.getStatus();
  }
}

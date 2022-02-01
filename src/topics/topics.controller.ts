import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Role } from '../role/role.enum';
import RoleGuard from '../role/role.guard';
import { TopicsService } from './topics.service';

@ApiTags('Topics')
@Controller('topic')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  @UseGuards(RoleGuard(Role.Admin))
  @ApiUnauthorizedResponse({ description: 'Not signed in' })
  async createTopic(@Req() req) {
    return await this.topicsService.createTopic(req.body, req.user);
  }

  @Get()
  async getAllTopics() {
    return await this.topicsService.getTopics();
  }
}

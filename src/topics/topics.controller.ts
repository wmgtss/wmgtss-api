import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role } from '../role/role.enum';
import RoleGuard from '../role/role.guard';
import { CreateTopicDto } from './dto/topic.create.dto';
import { AuthorTopic } from './entity/authourTopic.view';
import { Topic } from './entity/topic.entity';
import { TopicsService } from './topics.service';

@ApiTags('Topics')
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  @UseGuards(RoleGuard(Role.Admin))
  @ApiBody({ type: CreateTopicDto })
  @ApiOkResponse({ type: Topic })
  @ApiUnauthorizedResponse({ description: 'Not signed in' })
  async createTopic(@Req() req) {
    return await this.topicsService.createTopic(req.body, req.user);
  }

  @Get()
  @ApiOkResponse({ type: [AuthorTopic] })
  async getAllTopics() {
    return await this.topicsService.getTopics();
  }
}

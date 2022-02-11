import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
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
  async createTopic(@Req() req) {
    return await this.topicsService.createTopic(req.body, req.user);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(Role.Admin))
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTopicById(@Param('id') id: string) {
    return await this.topicsService.deleteTopicById(id);
  }

  @Get()
  @ApiOkResponse({ type: [AuthorTopic] })
  async getAllTopics() {
    return await this.topicsService.getTopics();
  }

  @Get(':id')
  @ApiOkResponse({ type: AuthorTopic })
  async getTopicById(@Param('id') id: string) {
    return await this.topicsService.getTopicById(id);
  }
}

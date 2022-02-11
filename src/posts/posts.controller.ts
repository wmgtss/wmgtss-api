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
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/strategy/jwt/jwt.guard';
import { CreatePostDto } from './dto/post.create.dto';
import { AuthorPost } from './entity/authorPost.view';
import { Post as PostEntity } from './entity/post.entity';
import { PostsService } from './posts.service';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOkResponse({ type: PostEntity })
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Not signed in' })
  @ApiBody({ type: CreatePostDto })
  async createPost(@Req() req) {
    return await this.postsService.createPost(req.body, req.user);
  }

  @Get('topic/:id')
  @ApiOkResponse({ type: [AuthorPost] })
  @ApiNotFoundResponse({ description: 'Not found' })
  async getPostsForTopic(@Param('id') topicId: string) {
    const user = await this.postsService.getPostsForTopic(topicId);
    return user;
  }

  @Get(':id')
  @ApiOkResponse({ type: AuthorPost })
  @ApiNotFoundResponse({ description: 'Not found' })
  async getPost(@Param('id') id: string) {
    const user = await this.postsService.getPostById(id);
    return user;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTopicById(@Param('id') id: string, @Req() req) {
    return await this.postsService.deletePostById(id, req.user);
  }
}

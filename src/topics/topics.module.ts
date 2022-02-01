import { Module } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './entity/topic.entity';
import { AuthorTopic } from './entity/authourTopic.view';

@Module({
  imports: [TypeOrmModule.forFeature([Topic, AuthorTopic])],
  controllers: [TopicsController],
  providers: [TopicsService],
})
export class TopicsModule {}

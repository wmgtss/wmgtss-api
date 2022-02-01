import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from './entity/topic.entity';
import { Repository } from 'typeorm';
import { CreateTopicDto } from './dto/createTopic.dto';
import { AuthorTopic } from './entity/authourTopic.view';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic) private readonly topicRepo: Repository<Topic>,
    @InjectRepository(AuthorTopic)
    private readonly authorTopicRepo: Repository<AuthorTopic>,
  ) {}

  async createTopic(topic: CreateTopicDto, user: any): Promise<Topic> {
    const newTopic = await this.topicRepo.create({
      ...topic,
      authorId: user.id,
    });
    return await newTopic.save();
  }

  async getTopics(): Promise<AuthorTopic[]> {
    return await this.authorTopicRepo.find();
  }
}

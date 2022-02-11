import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from './entity/topic.entity';
import { Repository } from 'typeorm';
import { CreateTopicDto } from './dto/topic.create.dto';
import { AuthorTopic } from './entity/authourTopic.view';
import { User } from '../users/entity/user.entity';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic) private readonly topicRepo: Repository<Topic>,
    @InjectRepository(AuthorTopic)
    private readonly authorTopicRepo: Repository<AuthorTopic>,
  ) {}

  async createTopic(topic: CreateTopicDto, user: User): Promise<Topic> {
    return this.topicRepo
      .create({
        ...topic,
        authorId: user.id,
      })
      .save();
  }

  async getTopics(): Promise<AuthorTopic[]> {
    return await this.authorTopicRepo.find();
  }

  async getTopicById(id: string): Promise<AuthorTopic> {
    const res = await this.authorTopicRepo.findOne({ id });
    if (!res) throw new NotFoundException();
    return res;
  }

  refreshUpdatedTime(id: string) {
    this.authorTopicRepo.update(id, { updatedOn: Date.now() });
  }

  async deleteTopicById(id: string) {
    const res = await this.topicRepo.delete({ id });
    if (res.affected === 0) throw new NotFoundException();
  }
}

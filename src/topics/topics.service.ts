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

  // Create a topic with the ID of the given user as the authorId
  async createTopic(topic: CreateTopicDto, user: User): Promise<Topic> {
    return this.topicRepo
      .create({
        ...topic,
        authorId: user.id,
      })
      .save();
  }

  // Get all topics
  async getTopics(): Promise<AuthorTopic[]> {
    return await this.authorTopicRepo.find();
  }

  // Get one topic with the given ID
  async getTopicById(id: string): Promise<AuthorTopic> {
    const res = await this.authorTopicRepo.findOne({ id });
    if (!res) throw new NotFoundException();
    return res;
  }

  // Set the 'updatedOn' field for a post to the current time
  // This is currently not in use, but should be called when a post is created
  refreshUpdatedTime(id: string) {
    this.authorTopicRepo.update(id, { updatedOn: Date.now() });
  }

  // Delete a topic with the given ID
  async deleteTopicById(id: string) {
    const res = await this.topicRepo.delete({ id });
    if (res.affected === 0) throw new NotFoundException();
  }
}

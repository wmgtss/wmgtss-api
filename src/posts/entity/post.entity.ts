import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Topic } from '../../topics/entity/topic.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('post')
export class Post extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    nullable: false,
  })
  title: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    nullable: false,
  })
  content: string;

  @ApiProperty()
  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorId' })
  authorId: string;

  @ApiProperty()
  @ManyToOne(() => Topic, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topicId' })
  topicId: string;

  @ApiProperty()
  @Column()
  @CreateDateColumn()
  createdOn: Date;
}

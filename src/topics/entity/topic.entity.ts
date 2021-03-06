import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';

@Entity('topic')
export class Topic extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    nullable: false,
  })
  description: string;

  @ApiProperty()
  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorId' })
  authorId: string;

  @ApiProperty()
  @Column()
  @CreateDateColumn()
  createdOn: Date;

  @ApiProperty()
  @Column()
  @UpdateDateColumn()
  updatedOn: Date;
}

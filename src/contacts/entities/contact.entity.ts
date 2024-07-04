/**
 * Contact data entity
 *
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number = 0;

  @Column({ default: '', comment: '氏名' })
  name: string = '';

  @Column({ default: '', comment: '氏名ふりがな' })
  nameKana: string = '';

  @Column({ default: '', comment: 'メールアドレス' })
  email: string = '';

  @Column({ default: '', comment: 'タイトル' })
  subject: string = '';

  @Column({ type: 'text', default: '', comment: 'メッセージ' })
  message: string = '';

  @CreateDateColumn({ comment: '作成日時' })
  createdAt: string | undefined = undefined;

  @UpdateDateColumn({ comment: '更新日時' })
  updatedAt: string | undefined = undefined;

  @DeleteDateColumn({ comment: '削除日時' })
  deletedAt: string | undefined = undefined;
}

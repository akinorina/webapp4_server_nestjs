import { MigrationInterface, QueryRunner } from 'typeorm';

export class Contact1720077963614 implements MigrationInterface {
  name = 'Contact1720077963614';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`contact\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'ID', \`name\` varchar(255) NOT NULL COMMENT '氏名' DEFAULT '', \`nameKana\` varchar(255) NOT NULL COMMENT '氏名ふりがな' DEFAULT '', \`email\` varchar(255) NOT NULL COMMENT 'メールアドレス' DEFAULT '', \`subject\` varchar(255) NOT NULL COMMENT 'タイトル' DEFAULT '', \`message\` text NOT NULL COMMENT 'メッセージ', \`createdAt\` datetime(6) NOT NULL COMMENT '作成日時' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '削除日時', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`contact\``);
  }
}

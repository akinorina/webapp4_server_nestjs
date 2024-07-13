import { MigrationInterface, QueryRunner } from 'typeorm';

export class Image1720779929479 implements MigrationInterface {
  name = 'Image1720779929479';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`image\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'ID', \`name\` varchar(255) NOT NULL COMMENT '画像名' DEFAULT '', \`objectKey\` varchar(255) NOT NULL COMMENT 'オブジェクトキー' DEFAULT '', \`url\` varchar(255) NOT NULL COMMENT 'URL' DEFAULT '', \`path\` varchar(255) NOT NULL COMMENT 'PATH' DEFAULT '', \`createdAt\` datetime(6) NOT NULL COMMENT '作成日時' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '削除日時', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contact\` CHANGE \`message\` \`message\` text NOT NULL COMMENT 'メッセージ' DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`contact\` CHANGE \`message\` \`message\` text NOT NULL COMMENT 'メッセージ'`,
    );
    await queryRunner.query(`DROP TABLE \`image\``);
  }
}

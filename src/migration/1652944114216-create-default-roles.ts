import { MigrationInterface, QueryRunner } from 'typeorm';

export class createDefaultrole1652944114216 implements MigrationInterface {
  name = 'createDefaultrole1652944114216';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "role" ("name", "created_at", "updated_at", "deleted_at") VALUES ('User', now(), now(), null)`,
    );
    await queryRunner.query(
      `INSERT INTO "role" ("name", "created_at", "updated_at", "deleted_at") VALUES ('Admin', now(), now(), null)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "role" WHERE "name" = 'User'`);
    await queryRunner.query(`DELETE FROM "role" WHERE "name" = 'Admin'`);
  }
}

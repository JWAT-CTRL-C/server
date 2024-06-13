import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldAvatarOnUserTable1718260211486 implements MigrationInterface {
    name = 'AddFieldAvatarOnUserTable1718260211486'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" character varying(125)`);
    }

}

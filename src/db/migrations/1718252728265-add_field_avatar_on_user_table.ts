import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldAvatarOnUserTable1718252728265 implements MigrationInterface {
    name = 'AddFieldAvatarOnUserTable1718252728265'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" character varying(125)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUsrnOfUsersTableToUnique1719554900701 implements MigrationInterface {
    name = 'ChangeUsrnOfUsersTableToUnique1719554900701'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_82c7c717637087865b35d197916" UNIQUE ("usrn")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_82c7c717637087865b35d197916"`);
    }

}

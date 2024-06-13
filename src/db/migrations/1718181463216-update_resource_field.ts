import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateResourceField1718181463216 implements MigrationInterface {
    name = 'UpdateResourceField1718181463216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "deleted_user_id" integer`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "crd_user_id" integer`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "upd_user_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "upd_user_id"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "crd_user_id"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "deleted_user_id"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "deleted_at"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyDeleteUserIdToDeletedUserIdOfBlogUserEntity1718177978452 implements MigrationInterface {
    name = 'ModifyDeleteUserIdToDeletedUserIdOfBlogUserEntity1718177978452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog" RENAME COLUMN "delete_user_id" TO "deleted_user_id"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "delete_user_id" TO "deleted_user_id"`);
        await queryRunner.query(`ALTER TABLE "workspace" RENAME COLUMN "delete_user_id" TO "deleted_user_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workspace" RENAME COLUMN "deleted_user_id" TO "delete_user_id"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "deleted_user_id" TO "delete_user_id"`);
        await queryRunner.query(`ALTER TABLE "blog" RENAME COLUMN "deleted_user_id" TO "delete_user_id"`);
    }

}

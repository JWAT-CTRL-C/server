import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldUserCreateUserUpdateUserDeleteToBlogUserEntity1718176221458 implements MigrationInterface {
    name = 'AddFieldUserCreateUserUpdateUserDeleteToBlogUserEntity1718176221458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_workspace" DROP CONSTRAINT "FK_faf90374b266c152bf3de95eba8"`);
        await queryRunner.query(`ALTER TABLE "user_workspace" DROP CONSTRAINT "FK_4056e511e8e47609ad3d9106a5f"`);
        await queryRunner.query(`ALTER TABLE "blog" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "blog" ADD "delete_user_id" integer`);
        await queryRunner.query(`ALTER TABLE "blog" ADD "crd_user_id" integer`);
        await queryRunner.query(`ALTER TABLE "blog" ADD "upd_user_id" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD "delete_user_id" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD "crd_user_id" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD "upd_user_id" integer`);
        await queryRunner.query(`ALTER TABLE "workspace" ADD "delete_user_id" integer`);
        await queryRunner.query(`ALTER TABLE "workspace" ADD "crd_user_id" integer`);
        await queryRunner.query(`ALTER TABLE "workspace" ADD "upd_user_id" integer`);
        await queryRunner.query(`ALTER TABLE "user_workspace" ADD CONSTRAINT "FK_4056e511e8e47609ad3d9106a5f" FOREIGN KEY ("wksp_id") REFERENCES "workspace"("wksp_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_workspace" ADD CONSTRAINT "FK_faf90374b266c152bf3de95eba8" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_workspace" DROP CONSTRAINT "FK_faf90374b266c152bf3de95eba8"`);
        await queryRunner.query(`ALTER TABLE "user_workspace" DROP CONSTRAINT "FK_4056e511e8e47609ad3d9106a5f"`);
        await queryRunner.query(`ALTER TABLE "workspace" DROP COLUMN "upd_user_id"`);
        await queryRunner.query(`ALTER TABLE "workspace" DROP COLUMN "crd_user_id"`);
        await queryRunner.query(`ALTER TABLE "workspace" DROP COLUMN "delete_user_id"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "upd_user_id"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "crd_user_id"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "delete_user_id"`);
        await queryRunner.query(`ALTER TABLE "blog" DROP COLUMN "upd_user_id"`);
        await queryRunner.query(`ALTER TABLE "blog" DROP COLUMN "crd_user_id"`);
        await queryRunner.query(`ALTER TABLE "blog" DROP COLUMN "delete_user_id"`);
        await queryRunner.query(`ALTER TABLE "blog" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "user_workspace" ADD CONSTRAINT "FK_4056e511e8e47609ad3d9106a5f" FOREIGN KEY ("wksp_id") REFERENCES "workspace"("wksp_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_workspace" ADD CONSTRAINT "FK_faf90374b266c152bf3de95eba8" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}

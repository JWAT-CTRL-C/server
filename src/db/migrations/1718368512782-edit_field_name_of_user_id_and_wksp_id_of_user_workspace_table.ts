import { MigrationInterface, QueryRunner } from "typeorm";

export class EditFieldNameOfUserIdAndWkspIdOfUserWorkspaceTable1718368512782 implements MigrationInterface {
    name = 'EditFieldNameOfUserIdAndWkspIdOfUserWorkspaceTable1718368512782'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_workspace" DROP CONSTRAINT "FK_a4b023bad89825d2237b69b4ddc"`);
        await queryRunner.query(`ALTER TABLE "user_workspace" DROP CONSTRAINT "FK_b3d7edc8c6fe88d212472384c0f"`);
        await queryRunner.query(`ALTER TABLE "user_workspace" DROP COLUMN "workspaceWkspId"`);
        await queryRunner.query(`ALTER TABLE "user_workspace" DROP COLUMN "userUserId"`);
        await queryRunner.query(`ALTER TABLE "user_workspace" ADD "wksp_id" character varying`);
        await queryRunner.query(`ALTER TABLE "user_workspace" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "user_workspace" ADD CONSTRAINT "FK_4056e511e8e47609ad3d9106a5f" FOREIGN KEY ("wksp_id") REFERENCES "workspace"("wksp_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_workspace" ADD CONSTRAINT "FK_faf90374b266c152bf3de95eba8" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_workspace" DROP CONSTRAINT "FK_faf90374b266c152bf3de95eba8"`);
        await queryRunner.query(`ALTER TABLE "user_workspace" DROP CONSTRAINT "FK_4056e511e8e47609ad3d9106a5f"`);
        await queryRunner.query(`ALTER TABLE "user_workspace" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "user_workspace" DROP COLUMN "wksp_id"`);
        await queryRunner.query(`ALTER TABLE "user_workspace" ADD "userUserId" integer`);
        await queryRunner.query(`ALTER TABLE "user_workspace" ADD "workspaceWkspId" character varying`);
        await queryRunner.query(`ALTER TABLE "user_workspace" ADD CONSTRAINT "FK_b3d7edc8c6fe88d212472384c0f" FOREIGN KEY ("userUserId") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_workspace" ADD CONSTRAINT "FK_a4b023bad89825d2237b69b4ddc" FOREIGN KEY ("workspaceWkspId") REFERENCES "workspace"("wksp_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

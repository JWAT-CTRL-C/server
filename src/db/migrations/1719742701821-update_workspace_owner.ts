import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateWorkspaceOwner1719742701821 implements MigrationInterface {
    name = 'UpdateWorkspaceOwner1719742701821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workspace" DROP CONSTRAINT "FK_988cf8ee530a5f8a2d56269955b"`);
        await queryRunner.query(`ALTER TABLE "workspace" ALTER COLUMN "owner_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "workspace" ADD CONSTRAINT "FK_988cf8ee530a5f8a2d56269955b" FOREIGN KEY ("owner_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workspace" DROP CONSTRAINT "FK_988cf8ee530a5f8a2d56269955b"`);
        await queryRunner.query(`ALTER TABLE "workspace" ALTER COLUMN "owner_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "workspace" ADD CONSTRAINT "FK_988cf8ee530a5f8a2d56269955b" FOREIGN KEY ("owner_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

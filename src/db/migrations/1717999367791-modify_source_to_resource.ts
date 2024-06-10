import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifySourceToResource1717999367791 implements MigrationInterface {
    name = 'ModifySourceToResource1717999367791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_workspace" DROP CONSTRAINT "FK_faf90374b266c152bf3de95eba8"`);
        await queryRunner.query(`ALTER TABLE "user_workspace" DROP CONSTRAINT "FK_4056e511e8e47609ad3d9106a5f"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP CONSTRAINT "PK_98df46d4eddfa1a64983aecc027"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "src_id"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "src_name"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "src_url"`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "resrc_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "resource" ADD CONSTRAINT "PK_d0f5f0404e9de77fd91d030cf93" PRIMARY KEY ("resrc_id")`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "resrc_name" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "resrc_url" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_workspace" ADD CONSTRAINT "FK_4056e511e8e47609ad3d9106a5f" FOREIGN KEY ("wksp_id") REFERENCES "workspace"("wksp_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_workspace" ADD CONSTRAINT "FK_faf90374b266c152bf3de95eba8" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_workspace" DROP CONSTRAINT "FK_faf90374b266c152bf3de95eba8"`);
        await queryRunner.query(`ALTER TABLE "user_workspace" DROP CONSTRAINT "FK_4056e511e8e47609ad3d9106a5f"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "resrc_url"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "resrc_name"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP CONSTRAINT "PK_d0f5f0404e9de77fd91d030cf93"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "resrc_id"`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "src_url" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "src_name" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "src_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "resource" ADD CONSTRAINT "PK_98df46d4eddfa1a64983aecc027" PRIMARY KEY ("src_id")`);
        await queryRunner.query(`ALTER TABLE "user_workspace" ADD CONSTRAINT "FK_4056e511e8e47609ad3d9106a5f" FOREIGN KEY ("wksp_id") REFERENCES "workspace"("wksp_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_workspace" ADD CONSTRAINT "FK_faf90374b266c152bf3de95eba8" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}

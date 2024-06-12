import { MigrationInterface, QueryRunner } from 'typeorm';

export class BlogRelationResourceAtDltAt1718166683566
  implements MigrationInterface
{
  name = 'BlogRelationResourceAtDltAt1718166683566';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_workspace" DROP CONSTRAINT "FK_4056e511e8e47609ad3d9106a5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_workspace" DROP CONSTRAINT "FK_faf90374b266c152bf3de95eba8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_workspace" ADD CONSTRAINT "FK_faf90374b266c152bf3de95eba8" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_workspace" ADD CONSTRAINT "FK_4056e511e8e47609ad3d9106a5f" FOREIGN KEY ("wksp_id") REFERENCES "workspace"("wksp_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_workspace" DROP CONSTRAINT "FK_4056e511e8e47609ad3d9106a5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_workspace" DROP CONSTRAINT "FK_faf90374b266c152bf3de95eba8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_workspace" ADD CONSTRAINT "FK_faf90374b266c152bf3de95eba8" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_workspace" ADD CONSTRAINT "FK_4056e511e8e47609ad3d9106a5f" FOREIGN KEY ("wksp_id") REFERENCES "workspace"("wksp_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}

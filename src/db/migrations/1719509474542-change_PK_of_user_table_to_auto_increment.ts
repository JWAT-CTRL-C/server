import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangePKOfUserTableToAutoIncrement1719509474542 implements MigrationInterface {
    name = 'ChangePKOfUserTableToAutoIncrement1719509474542'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_comment" DROP CONSTRAINT "FK_3c38d37452f5a029f82b1074a6d"`);
        await queryRunner.query(`ALTER TABLE "blog" DROP CONSTRAINT "FK_b5345539f92330bd1751668a958"`);
        await queryRunner.query(`ALTER TABLE "blog_rating" DROP CONSTRAINT "FK_d1133eab8da5d8535c727803b07"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_18b536d96dc58ce02165525cf87"`);
        await queryRunner.query(`ALTER TABLE "user_workspace" DROP CONSTRAINT "FK_faf90374b266c152bf3de95eba8"`);
        await queryRunner.query(`ALTER TABLE "workspace" DROP CONSTRAINT "FK_988cf8ee530a5f8a2d56269955b"`);
        await queryRunner.query(`ALTER TABLE "user_notification_read" DROP CONSTRAINT "FK_3a78640fb8e2a1f250468333461"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "user_user_id_seq" OWNED BY "user"."user_id"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "user_id" SET DEFAULT nextval('"user_user_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "blog_comment" ADD CONSTRAINT "FK_3c38d37452f5a029f82b1074a6d" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_rating" ADD CONSTRAINT "FK_d1133eab8da5d8535c727803b07" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog" ADD CONSTRAINT "FK_b5345539f92330bd1751668a958" FOREIGN KEY ("auth_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_notification_read" ADD CONSTRAINT "FK_3a78640fb8e2a1f250468333461" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_18b536d96dc58ce02165525cf87" FOREIGN KEY ("auth_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_workspace" ADD CONSTRAINT "FK_faf90374b266c152bf3de95eba8" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workspace" ADD CONSTRAINT "FK_988cf8ee530a5f8a2d56269955b" FOREIGN KEY ("owner_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workspace" DROP CONSTRAINT "FK_988cf8ee530a5f8a2d56269955b"`);
        await queryRunner.query(`ALTER TABLE "user_workspace" DROP CONSTRAINT "FK_faf90374b266c152bf3de95eba8"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_18b536d96dc58ce02165525cf87"`);
        await queryRunner.query(`ALTER TABLE "user_notification_read" DROP CONSTRAINT "FK_3a78640fb8e2a1f250468333461"`);
        await queryRunner.query(`ALTER TABLE "blog" DROP CONSTRAINT "FK_b5345539f92330bd1751668a958"`);
        await queryRunner.query(`ALTER TABLE "blog_rating" DROP CONSTRAINT "FK_d1133eab8da5d8535c727803b07"`);
        await queryRunner.query(`ALTER TABLE "blog_comment" DROP CONSTRAINT "FK_3c38d37452f5a029f82b1074a6d"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "user_id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "user_user_id_seq"`);
        await queryRunner.query(`ALTER TABLE "user_notification_read" ADD CONSTRAINT "FK_3a78640fb8e2a1f250468333461" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workspace" ADD CONSTRAINT "FK_988cf8ee530a5f8a2d56269955b" FOREIGN KEY ("owner_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_workspace" ADD CONSTRAINT "FK_faf90374b266c152bf3de95eba8" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_18b536d96dc58ce02165525cf87" FOREIGN KEY ("auth_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_rating" ADD CONSTRAINT "FK_d1133eab8da5d8535c727803b07" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog" ADD CONSTRAINT "FK_b5345539f92330bd1751668a958" FOREIGN KEY ("auth_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_comment" ADD CONSTRAINT "FK_3c38d37452f5a029f82b1074a6d" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

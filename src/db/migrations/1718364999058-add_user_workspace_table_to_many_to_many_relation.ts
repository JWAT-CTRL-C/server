import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserWorkspaceTableToManyToManyRelation1718364999058 implements MigrationInterface {
    name = 'AddUserWorkspaceTableToManyToManyRelation1718364999058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dev"."tag" ("tag_id" SERIAL NOT NULL, "tag_name" character varying(50) NOT NULL, "crd_at" TIMESTAMP NOT NULL DEFAULT now(), "upd_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e9fe36a7c01af44f6c47f972f0b" PRIMARY KEY ("tag_id"))`);
        await queryRunner.query(`CREATE TABLE "dev"."blog_image" ("blog_img_id" character varying NOT NULL, "blog_img_url" text NOT NULL, "crd_at" TIMESTAMP NOT NULL DEFAULT now(), "upd_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_435337150633f58df5c19c01181" PRIMARY KEY ("blog_img_id"))`);
        await queryRunner.query(`CREATE TABLE "dev"."blog_comment" ("blog_cmt_id" character varying NOT NULL, "blog_cmt_cont" text NOT NULL, "crd_at" TIMESTAMP NOT NULL DEFAULT now(), "upd_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "blog_id" character varying, CONSTRAINT "PK_854abe552c1ef058939db4f2aaf" PRIMARY KEY ("blog_cmt_id"))`);
        await queryRunner.query(`CREATE TABLE "dev"."blog_rating" ("blog_rtg_id" character varying NOT NULL, "is_rated" boolean NOT NULL DEFAULT true, "crd_at" TIMESTAMP NOT NULL DEFAULT now(), "upd_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "blog_id" character varying, CONSTRAINT "PK_713ad984d629ebf04f960289873" PRIMARY KEY ("blog_rtg_id"))`);
        await queryRunner.query(`CREATE TABLE "dev"."resource" ("resrc_id" character varying NOT NULL, "resrc_name" character varying(50) NOT NULL, "resrc_url" text NOT NULL, "deleted_at" TIMESTAMP, "deleted_user_id" integer, "crd_user_id" integer, "upd_user_id" integer, "crd_at" TIMESTAMP NOT NULL DEFAULT now(), "upd_at" TIMESTAMP NOT NULL DEFAULT now(), "wksp_id" character varying, "blog_id" character varying, CONSTRAINT "REL_e4a5f866f53e347e7b6913727f" UNIQUE ("blog_id"), CONSTRAINT "PK_d0f5f0404e9de77fd91d030cf93" PRIMARY KEY ("resrc_id"))`);
        await queryRunner.query(`CREATE TABLE "dev"."blog" ("blog_id" character varying NOT NULL, "blog_tle" character varying(150) NOT NULL, "blog_cont" text NOT NULL, "deleted_at" TIMESTAMP, "deleted_user_id" integer, "crd_at" TIMESTAMP NOT NULL DEFAULT now(), "crd_user_id" integer, "upd_at" TIMESTAMP NOT NULL DEFAULT now(), "upd_user_id" integer, "dld_at" TIMESTAMP, "auth_id" integer, "wksp_id" character varying, "blog_img_id" character varying, CONSTRAINT "REL_ef111a7630e9b8427de8374a6f" UNIQUE ("blog_img_id"), CONSTRAINT "PK_b7647f1f3b095a20e19c62ff529" PRIMARY KEY ("blog_id"))`);
        await queryRunner.query(`CREATE TABLE "dev"."notification" ("noti_id" character varying NOT NULL, "noti_tle" character varying(150) NOT NULL, "noti_cont" text NOT NULL, "crd_at" TIMESTAMP NOT NULL DEFAULT now(), "upd_at" TIMESTAMP NOT NULL DEFAULT now(), "auth_id" integer, "wksp_id" character varying, CONSTRAINT "PK_951e5f8c35f9fc922f9c171aab5" PRIMARY KEY ("noti_id"))`);
        await queryRunner.query(`CREATE TYPE "dev"."user_role_enum" AS ENUM('MA', 'HM', 'PM', 'EM')`);
        await queryRunner.query(`CREATE TABLE "dev"."user" ("user_id" integer NOT NULL, "usrn" character varying(50) NOT NULL, "avatar" text, "email" character varying(125), "fuln" character varying(30), "phone" character varying(20), "pass" character varying(125) NOT NULL, "role" "dev"."user_role_enum" NOT NULL DEFAULT 'EM', "deleted_at" TIMESTAMP, "deleted_user_id" integer, "crd_at" TIMESTAMP NOT NULL DEFAULT now(), "crd_user_id" integer, "upd_at" TIMESTAMP NOT NULL DEFAULT now(), "upd_user_id" integer, CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "dev"."workspace" ("wksp_id" character varying NOT NULL, "wksp_name" character varying(50) NOT NULL, "wksp_desc" character varying(125) NOT NULL, "deleted_at" TIMESTAMP, "deleted_user_id" integer, "crd_at" TIMESTAMP NOT NULL DEFAULT now(), "crd_user_id" integer, "upd_at" TIMESTAMP NOT NULL DEFAULT now(), "upd_user_id" integer, "owner_id" integer, CONSTRAINT "PK_ddaf0eaa9a454838c3dcf46ff86" PRIMARY KEY ("wksp_id"))`);
        await queryRunner.query(`CREATE TABLE "dev"."user_workspace" ("user_workspace_id" SERIAL NOT NULL, "deleted_at" TIMESTAMP, "deleted_user_id" integer, "crd_at" TIMESTAMP NOT NULL DEFAULT now(), "crd_user_id" integer, "upd_at" TIMESTAMP NOT NULL DEFAULT now(), "upd_user_id" integer, "workspaceWkspId" character varying, "userUserId" integer, CONSTRAINT "PK_0f01aac42120f52e470233a3620" PRIMARY KEY ("user_workspace_id"))`);
        await queryRunner.query(`CREATE TABLE "dev"."blog_tag" ("blog_id" character varying NOT NULL, "tag_id" integer NOT NULL, CONSTRAINT "PK_963f14e901570694209e4cd379f" PRIMARY KEY ("blog_id", "tag_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_27db7831164e793961a270e70d" ON "dev"."blog_tag" ("blog_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_4adb7dbb6eb9f4ca51be44ec8d" ON "dev"."blog_tag" ("tag_id") `);
        await queryRunner.query(`ALTER TABLE "dev"."blog_comment" ADD CONSTRAINT "FK_3c38d37452f5a029f82b1074a6d" FOREIGN KEY ("user_id") REFERENCES "dev"."user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dev"."blog_comment" ADD CONSTRAINT "FK_a2e06d1f23800610fb9f3715c45" FOREIGN KEY ("blog_id") REFERENCES "dev"."blog"("blog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dev"."blog_rating" ADD CONSTRAINT "FK_d1133eab8da5d8535c727803b07" FOREIGN KEY ("user_id") REFERENCES "dev"."user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dev"."blog_rating" ADD CONSTRAINT "FK_97fee0ab40a0184f3dc56b899b5" FOREIGN KEY ("blog_id") REFERENCES "dev"."blog"("blog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dev"."resource" ADD CONSTRAINT "FK_bc752980938e7cd5348fc561d9e" FOREIGN KEY ("wksp_id") REFERENCES "dev"."workspace"("wksp_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dev"."resource" ADD CONSTRAINT "FK_e4a5f866f53e347e7b6913727f8" FOREIGN KEY ("blog_id") REFERENCES "dev"."blog"("blog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dev"."blog" ADD CONSTRAINT "FK_b5345539f92330bd1751668a958" FOREIGN KEY ("auth_id") REFERENCES "dev"."user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dev"."blog" ADD CONSTRAINT "FK_403a216ec5b33f2f3e589dfb913" FOREIGN KEY ("wksp_id") REFERENCES "dev"."workspace"("wksp_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dev"."blog" ADD CONSTRAINT "FK_ef111a7630e9b8427de8374a6f0" FOREIGN KEY ("blog_img_id") REFERENCES "dev"."blog_image"("blog_img_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dev"."notification" ADD CONSTRAINT "FK_18b536d96dc58ce02165525cf87" FOREIGN KEY ("auth_id") REFERENCES "dev"."user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dev"."notification" ADD CONSTRAINT "FK_a6ce715a82d5e8d6d1d3801917f" FOREIGN KEY ("wksp_id") REFERENCES "dev"."workspace"("wksp_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dev"."workspace" ADD CONSTRAINT "FK_988cf8ee530a5f8a2d56269955b" FOREIGN KEY ("owner_id") REFERENCES "dev"."user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dev"."user_workspace" ADD CONSTRAINT "FK_a4b023bad89825d2237b69b4ddc" FOREIGN KEY ("workspaceWkspId") REFERENCES "dev"."workspace"("wksp_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dev"."user_workspace" ADD CONSTRAINT "FK_b3d7edc8c6fe88d212472384c0f" FOREIGN KEY ("userUserId") REFERENCES "dev"."user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dev"."blog_tag" ADD CONSTRAINT "FK_27db7831164e793961a270e70d3" FOREIGN KEY ("blog_id") REFERENCES "dev"."blog"("blog_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "dev"."blog_tag" ADD CONSTRAINT "FK_4adb7dbb6eb9f4ca51be44ec8db" FOREIGN KEY ("tag_id") REFERENCES "dev"."tag"("tag_id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dev"."blog_tag" DROP CONSTRAINT "FK_4adb7dbb6eb9f4ca51be44ec8db"`);
        await queryRunner.query(`ALTER TABLE "dev"."blog_tag" DROP CONSTRAINT "FK_27db7831164e793961a270e70d3"`);
        await queryRunner.query(`ALTER TABLE "dev"."user_workspace" DROP CONSTRAINT "FK_b3d7edc8c6fe88d212472384c0f"`);
        await queryRunner.query(`ALTER TABLE "dev"."user_workspace" DROP CONSTRAINT "FK_a4b023bad89825d2237b69b4ddc"`);
        await queryRunner.query(`ALTER TABLE "dev"."workspace" DROP CONSTRAINT "FK_988cf8ee530a5f8a2d56269955b"`);
        await queryRunner.query(`ALTER TABLE "dev"."notification" DROP CONSTRAINT "FK_a6ce715a82d5e8d6d1d3801917f"`);
        await queryRunner.query(`ALTER TABLE "dev"."notification" DROP CONSTRAINT "FK_18b536d96dc58ce02165525cf87"`);
        await queryRunner.query(`ALTER TABLE "dev"."blog" DROP CONSTRAINT "FK_ef111a7630e9b8427de8374a6f0"`);
        await queryRunner.query(`ALTER TABLE "dev"."blog" DROP CONSTRAINT "FK_403a216ec5b33f2f3e589dfb913"`);
        await queryRunner.query(`ALTER TABLE "dev"."blog" DROP CONSTRAINT "FK_b5345539f92330bd1751668a958"`);
        await queryRunner.query(`ALTER TABLE "dev"."resource" DROP CONSTRAINT "FK_e4a5f866f53e347e7b6913727f8"`);
        await queryRunner.query(`ALTER TABLE "dev"."resource" DROP CONSTRAINT "FK_bc752980938e7cd5348fc561d9e"`);
        await queryRunner.query(`ALTER TABLE "dev"."blog_rating" DROP CONSTRAINT "FK_97fee0ab40a0184f3dc56b899b5"`);
        await queryRunner.query(`ALTER TABLE "dev"."blog_rating" DROP CONSTRAINT "FK_d1133eab8da5d8535c727803b07"`);
        await queryRunner.query(`ALTER TABLE "dev"."blog_comment" DROP CONSTRAINT "FK_a2e06d1f23800610fb9f3715c45"`);
        await queryRunner.query(`ALTER TABLE "dev"."blog_comment" DROP CONSTRAINT "FK_3c38d37452f5a029f82b1074a6d"`);
        await queryRunner.query(`DROP INDEX "dev"."IDX_4adb7dbb6eb9f4ca51be44ec8d"`);
        await queryRunner.query(`DROP INDEX "dev"."IDX_27db7831164e793961a270e70d"`);
        await queryRunner.query(`DROP TABLE "dev"."blog_tag"`);
        await queryRunner.query(`DROP TABLE "dev"."user_workspace"`);
        await queryRunner.query(`DROP TABLE "dev"."workspace"`);
        await queryRunner.query(`DROP TABLE "dev"."user"`);
        await queryRunner.query(`DROP TYPE "dev"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "dev"."notification"`);
        await queryRunner.query(`DROP TABLE "dev"."blog"`);
        await queryRunner.query(`DROP TABLE "dev"."resource"`);
        await queryRunner.query(`DROP TABLE "dev"."blog_rating"`);
        await queryRunner.query(`DROP TABLE "dev"."blog_comment"`);
        await queryRunner.query(`DROP TABLE "dev"."blog_image"`);
        await queryRunner.query(`DROP TABLE "dev"."tag"`);
    }

}

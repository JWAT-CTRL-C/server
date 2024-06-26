import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableUserNotification1719382334739 implements MigrationInterface {
    name = 'UpdateTableUserNotification1719382334739'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_notification_read" ("user_noti_read_id" SERIAL NOT NULL, "user_id" integer NOT NULL, "noti_id" character varying NOT NULL, "is_read" boolean NOT NULL, "crd_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9f80b8866c7c82a0414cebca41a" PRIMARY KEY ("user_noti_read_id"))`);
        await queryRunner.query(`ALTER TABLE "user_notification_read" ADD CONSTRAINT "FK_3a78640fb8e2a1f250468333461" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_notification_read" ADD CONSTRAINT "FK_3dbd92f5872016e7e7b1e564166" FOREIGN KEY ("noti_id") REFERENCES "notification"("noti_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_notification_read" DROP CONSTRAINT "FK_3dbd92f5872016e7e7b1e564166"`);
        await queryRunner.query(`ALTER TABLE "user_notification_read" DROP CONSTRAINT "FK_3a78640fb8e2a1f250468333461"`);
        await queryRunner.query(`DROP TABLE "user_notification_read"`);
    }

}

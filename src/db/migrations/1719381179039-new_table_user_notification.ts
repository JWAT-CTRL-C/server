import { MigrationInterface, QueryRunner } from "typeorm";

export class NewTableUserNotification1719381179039 implements MigrationInterface {
    name = 'NewTableUserNotification1719381179039'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_notication_read" ("user_noti_read_id" SERIAL NOT NULL, "user_id" integer NOT NULL, "noti_id" character varying NOT NULL, "is_read" boolean NOT NULL, "crd_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a31bc3415ca76bec33775aac1fa" PRIMARY KEY ("user_noti_read_id"))`);
        await queryRunner.query(`ALTER TABLE "user_notication_read" ADD CONSTRAINT "FK_50a38ad8e17c754b7e0989ab130" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_notication_read" ADD CONSTRAINT "FK_be6700fc7e8dca9b0f8d44f95cc" FOREIGN KEY ("noti_id") REFERENCES "notification"("noti_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_notication_read" DROP CONSTRAINT "FK_be6700fc7e8dca9b0f8d44f95cc"`);
        await queryRunner.query(`ALTER TABLE "user_notication_read" DROP CONSTRAINT "FK_50a38ad8e17c754b7e0989ab130"`);
        await queryRunner.query(`DROP TABLE "user_notication_read"`);
    }

}

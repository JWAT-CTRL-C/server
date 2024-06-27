import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableUserNotification1719386283321 implements MigrationInterface {
    name = 'UpdateTableUserNotification1719386283321'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_notification_read" ALTER COLUMN "is_read" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_notification_read" ALTER COLUMN "is_read" DROP DEFAULT`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class EditFieldEmailOfUserTableToNotNullable1718632333489 implements MigrationInterface {
    name = 'EditFieldEmailOfUserTableToNotNullable1718632333489'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "fuln" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "fuln" DROP NOT NULL`);
    }

}

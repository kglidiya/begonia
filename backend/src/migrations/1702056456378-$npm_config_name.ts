import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1702056456378 implements MigrationInterface {
    name = ' $npmConfigName1702056456378'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "article"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" ADD "article" integer NOT NULL`);
    }

}

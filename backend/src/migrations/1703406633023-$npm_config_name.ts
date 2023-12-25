import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1703406633023 implements MigrationInterface {
    name = ' $npmConfigName1703406633023'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "refreshToken" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refreshToken"`);
    }

}

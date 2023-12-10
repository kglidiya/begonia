import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1702202584934 implements MigrationInterface {
    name = ' $npmConfigName1702202584934'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."item_type_enum" RENAME TO "item_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."item_type_enum" AS ENUM('Элатиор', 'Клубневая', 'Ампельная', 'Все сорта')`);
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "type" TYPE "public"."item_type_enum" USING "type"::"text"::"public"."item_type_enum"`);
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "type" SET DEFAULT 'Элатиор'`);
        await queryRunner.query(`DROP TYPE "public"."item_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."item_type_enum_old" AS ENUM('Элатиор', 'Клубневая', 'Декоративно-лиственная', 'Все сорта')`);
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "type" TYPE "public"."item_type_enum_old" USING "type"::"text"::"public"."item_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "type" SET DEFAULT 'Элатиор'`);
        await queryRunner.query(`DROP TYPE "public"."item_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."item_type_enum_old" RENAME TO "item_type_enum"`);
    }

}

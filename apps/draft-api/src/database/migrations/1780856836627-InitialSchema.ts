import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1780856836627 implements MigrationInterface {
    name = 'InitialSchema1780856836627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "is_admin" boolean NOT NULL DEFAULT false, "last_login" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_772886e2f1f47b9ceb04a06e203" UNIQUE ("username", "email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sources" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "base_url" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_85523beafe5a2a6b90b02096443" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."data_import_logs_status_enum" AS ENUM('pending', 'published', 'failed')`);
        await queryRunner.query(`CREATE TYPE "public"."data_import_logs_source_enum" AS ENUM('daily', 'manual')`);
        await queryRunner.query(`CREATE TABLE "data_import_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."data_import_logs_status_enum" NOT NULL, "started_at" TIMESTAMP NOT NULL DEFAULT now(), "completed_at" TIMESTAMP, "error_summary" text, "player_count" integer NOT NULL DEFAULT '0', "ranking_count" integer NOT NULL DEFAULT '0', "source" "public"."data_import_logs_source_enum" NOT NULL, "data_version_id" uuid, CONSTRAINT "PK_01a5b6d0505ecb9f4767de9463f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."data_versions_source_enum" AS ENUM('daily', 'manual')`);
        await queryRunner.query(`CREATE TYPE "public"."data_versions_status_enum" AS ENUM('pending', 'published', 'failed')`);
        await queryRunner.query(`CREATE TABLE "data_versions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "source" "public"."data_versions_source_enum" NOT NULL, "status" "public"."data_versions_status_enum" NOT NULL, "is_active" boolean NOT NULL DEFAULT false, "published_at" TIMESTAMP, "player_count" integer NOT NULL DEFAULT '0', "ranking_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5cc253399d3471daa779658886a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "player_rankings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "year" integer NOT NULL, "overall_rank" integer NOT NULL, "position_rank" integer NOT NULL, "position" character varying NOT NULL, "notes" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "player_id" uuid, "data_version_id" uuid, "source_article_id" uuid, CONSTRAINT "PK_d626ed3b65fcf9c550a3a8d6eaa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "draft_pick_trades" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "trade_date" date, "trade_details" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "draft_pick_id" uuid, "from_team_id" uuid, "to_team_id" uuid, CONSTRAINT "PK_d150380bedd8eaf6d46ab4c2863" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "draft_picks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "year" integer NOT NULL, "round" integer NOT NULL, "pick_number" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "original_team_id" uuid, "current_team_id" uuid, "player_id" uuid, CONSTRAINT "unique_draft_pick" UNIQUE ("year", "round", "pick_number"), CONSTRAINT "REL_808f73cc7ad056f24d53e7a64b" UNIQUE ("player_id"), CONSTRAINT "PK_d39b2bc8afb5ccdb05b92edcf63" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "players" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "position" character varying NOT NULL, "date_of_birth" TIMESTAMP, "college" character varying, "height" integer, "weight" integer, "arm_length" numeric(5,3), "hand_size" numeric(5,3), "forty_yard_dash" numeric(5,3), "ten_yard_split" numeric(5,3), "twenty_yard_split" numeric(5,3), "twenty_yard_shuttle" numeric(5,3), "three_cone_drill" numeric(5,3), "vertical_jump" numeric(5,3), "broad_jump" numeric(6,3), "bench_press" integer, "hometown" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "data_version_id" uuid, CONSTRAINT "PK_de22b8fdeee0c33ab55ae71da3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "player_grades" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "grade" character varying, "grade_numeric" double precision, "text" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "draft_pick_id" uuid, "player_id" uuid, "team_id" uuid, "source_article_id" uuid, CONSTRAINT "PK_312f4734cd245424738ab9cf2c6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "source_articles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "year" integer NOT NULL, "title" character varying NOT NULL, "url" character varying NOT NULL, "publication_date" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "source_id" uuid, CONSTRAINT "UQ_2788b4ffe99e13e1a8521cee038" UNIQUE ("year", "url"), CONSTRAINT "PK_a2f55b3d27e5481002bce7ad0a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "draft_class_grades" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "grade" character varying NOT NULL, "grade_numeric" double precision NOT NULL, "year" integer NOT NULL, "text" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "team_id" uuid, "source_article_id" uuid, CONSTRAINT "PK_074b69e069063ea5c7402aabe9a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "teams" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "location" character varying NOT NULL, "nickname" character varying NOT NULL, "abbreviation" character varying NOT NULL, "slug" character varying NOT NULL, "conference" character varying NOT NULL, "division" character varying NOT NULL, "logo" character varying NOT NULL, "colors" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_de8536da4945fe980f4a61900d3" UNIQUE ("slug"), CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "draft_sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "data_version_id" uuid, CONSTRAINT "PK_8a6a37b27c812109f213bba5956" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "data_import_logs" ADD CONSTRAINT "FK_d6f837ac53ba78314d4c72fb06f" FOREIGN KEY ("data_version_id") REFERENCES "data_versions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player_rankings" ADD CONSTRAINT "FK_6944e3e048e0160488cbe437587" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player_rankings" ADD CONSTRAINT "FK_d2c8e38d8327d06fd124e663a03" FOREIGN KEY ("data_version_id") REFERENCES "data_versions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player_rankings" ADD CONSTRAINT "FK_a854e38a0111b0faf51cb45e024" FOREIGN KEY ("source_article_id") REFERENCES "source_articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "draft_pick_trades" ADD CONSTRAINT "FK_0e23a73e9cb59158b6a5a546858" FOREIGN KEY ("draft_pick_id") REFERENCES "draft_picks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "draft_pick_trades" ADD CONSTRAINT "FK_8234a4d19f05b837e029faf5f30" FOREIGN KEY ("from_team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "draft_pick_trades" ADD CONSTRAINT "FK_169c7a2863f0115ca3cf86bac7f" FOREIGN KEY ("to_team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "draft_picks" ADD CONSTRAINT "FK_84c5bfea604324c04aa25cc7071" FOREIGN KEY ("original_team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "draft_picks" ADD CONSTRAINT "FK_e488715401e882f29882f324e37" FOREIGN KEY ("current_team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "draft_picks" ADD CONSTRAINT "FK_808f73cc7ad056f24d53e7a64b1" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "players" ADD CONSTRAINT "FK_abc007e6e5b7192700ebf768d57" FOREIGN KEY ("data_version_id") REFERENCES "data_versions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player_grades" ADD CONSTRAINT "FK_82286c3c7d52ce66f19c203547e" FOREIGN KEY ("draft_pick_id") REFERENCES "draft_picks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player_grades" ADD CONSTRAINT "FK_9ebfd46c22acfe721aa01503832" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player_grades" ADD CONSTRAINT "FK_0d8523f0a6e109baf1a9301913c" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player_grades" ADD CONSTRAINT "FK_ed98eb4a4ff5186738ede24960b" FOREIGN KEY ("source_article_id") REFERENCES "source_articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "source_articles" ADD CONSTRAINT "FK_b7bd147a44dc755efb628c3e8ce" FOREIGN KEY ("source_id") REFERENCES "sources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "draft_class_grades" ADD CONSTRAINT "FK_4d71b5f5010177be54dbba713b6" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "draft_class_grades" ADD CONSTRAINT "FK_0f1d8c8ee26236f5e7d59ed0c02" FOREIGN KEY ("source_article_id") REFERENCES "source_articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "draft_sessions" ADD CONSTRAINT "FK_46626836aa20fcbcfc87151e952" FOREIGN KEY ("data_version_id") REFERENCES "data_versions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "draft_sessions" DROP CONSTRAINT "FK_46626836aa20fcbcfc87151e952"`);
        await queryRunner.query(`ALTER TABLE "draft_class_grades" DROP CONSTRAINT "FK_0f1d8c8ee26236f5e7d59ed0c02"`);
        await queryRunner.query(`ALTER TABLE "draft_class_grades" DROP CONSTRAINT "FK_4d71b5f5010177be54dbba713b6"`);
        await queryRunner.query(`ALTER TABLE "source_articles" DROP CONSTRAINT "FK_b7bd147a44dc755efb628c3e8ce"`);
        await queryRunner.query(`ALTER TABLE "player_grades" DROP CONSTRAINT "FK_ed98eb4a4ff5186738ede24960b"`);
        await queryRunner.query(`ALTER TABLE "player_grades" DROP CONSTRAINT "FK_0d8523f0a6e109baf1a9301913c"`);
        await queryRunner.query(`ALTER TABLE "player_grades" DROP CONSTRAINT "FK_9ebfd46c22acfe721aa01503832"`);
        await queryRunner.query(`ALTER TABLE "player_grades" DROP CONSTRAINT "FK_82286c3c7d52ce66f19c203547e"`);
        await queryRunner.query(`ALTER TABLE "players" DROP CONSTRAINT "FK_abc007e6e5b7192700ebf768d57"`);
        await queryRunner.query(`ALTER TABLE "draft_picks" DROP CONSTRAINT "FK_808f73cc7ad056f24d53e7a64b1"`);
        await queryRunner.query(`ALTER TABLE "draft_picks" DROP CONSTRAINT "FK_e488715401e882f29882f324e37"`);
        await queryRunner.query(`ALTER TABLE "draft_picks" DROP CONSTRAINT "FK_84c5bfea604324c04aa25cc7071"`);
        await queryRunner.query(`ALTER TABLE "draft_pick_trades" DROP CONSTRAINT "FK_169c7a2863f0115ca3cf86bac7f"`);
        await queryRunner.query(`ALTER TABLE "draft_pick_trades" DROP CONSTRAINT "FK_8234a4d19f05b837e029faf5f30"`);
        await queryRunner.query(`ALTER TABLE "draft_pick_trades" DROP CONSTRAINT "FK_0e23a73e9cb59158b6a5a546858"`);
        await queryRunner.query(`ALTER TABLE "player_rankings" DROP CONSTRAINT "FK_a854e38a0111b0faf51cb45e024"`);
        await queryRunner.query(`ALTER TABLE "player_rankings" DROP CONSTRAINT "FK_d2c8e38d8327d06fd124e663a03"`);
        await queryRunner.query(`ALTER TABLE "player_rankings" DROP CONSTRAINT "FK_6944e3e048e0160488cbe437587"`);
        await queryRunner.query(`ALTER TABLE "data_import_logs" DROP CONSTRAINT "FK_d6f837ac53ba78314d4c72fb06f"`);
        await queryRunner.query(`DROP TABLE "draft_sessions"`);
        await queryRunner.query(`DROP TABLE "teams"`);
        await queryRunner.query(`DROP TABLE "draft_class_grades"`);
        await queryRunner.query(`DROP TABLE "source_articles"`);
        await queryRunner.query(`DROP TABLE "player_grades"`);
        await queryRunner.query(`DROP TABLE "players"`);
        await queryRunner.query(`DROP TABLE "draft_picks"`);
        await queryRunner.query(`DROP TABLE "draft_pick_trades"`);
        await queryRunner.query(`DROP TABLE "player_rankings"`);
        await queryRunner.query(`DROP TABLE "data_versions"`);
        await queryRunner.query(`DROP TYPE "public"."data_versions_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."data_versions_source_enum"`);
        await queryRunner.query(`DROP TABLE "data_import_logs"`);
        await queryRunner.query(`DROP TYPE "public"."data_import_logs_source_enum"`);
        await queryRunner.query(`DROP TYPE "public"."data_import_logs_status_enum"`);
        await queryRunner.query(`DROP TABLE "sources"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}

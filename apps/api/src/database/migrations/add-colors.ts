import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColorsToTeam1625000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'teams',
      new TableColumn({
        name: 'colors',
        type: 'text',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('teams', 'colors');
  }
}

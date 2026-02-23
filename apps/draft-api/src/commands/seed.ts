import 'reflect-metadata';
import { config } from 'dotenv';
import { AppDataSource } from '../database';

config();

type StepName = 'teams' | 'players' | 'draft-classes' | 'grades';

type StepResult = {
  step: string;
  success: number;
  failed: number;
  skipped: number;
};

function parseArgs(): { steps: StepName[] | null; year: number } {
  const args = process.argv.slice(2);
  let steps: StepName[] | null = null;
  let year = new Date().getFullYear();

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--step' && args[i + 1]) {
      steps = [args[i + 1] as StepName];
      i++;
    }
    if (args[i] === '--year' && args[i + 1]) {
      year = parseInt(args[i + 1], 10);
      i++;
    }
  }

  return { steps, year };
}

async function main() {
  const { steps, year } = parseArgs();
  console.log(`\n=== Database Seed Script ===`);
  console.log(`Year: ${year}`);
  console.log(`Steps: ${steps ? steps.join(', ') : 'all'}\n`);

  await AppDataSource.initialize();
  console.log('Database connected.\n');

  const results: StepResult[] = [];
  const allSteps: StepName[] = ['teams', 'players', 'draft-classes', 'grades'];
  const stepsToRun = steps ?? allSteps;

  for (const step of stepsToRun) {
    console.log(`--- Running step: ${step} ---`);
    // Steps will be wired in subsequent tasks
    console.log(`Step "${step}" not yet implemented.\n`);
  }

  console.log('\n=== Seed Summary ===');
  for (const result of results) {
    console.log(
      `  ${result.step}: ${result.success} created, ${result.failed} failed, ${result.skipped} skipped`,
    );
  }

  await AppDataSource.destroy();
  console.log('\nDone.');
  process.exit(0);
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});

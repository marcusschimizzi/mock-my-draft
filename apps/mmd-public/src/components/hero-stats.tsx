import { SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow } from '@chakra-ui/react';
import Card from './card';
import { GradeBadge } from './grade-badge';

interface HeroStatsProps {
  currentYear: number;
  previousYear: number;
  stats: {
    leagueAverage: number;
    toughestCritic: string;
    sourceAgreement: number;
    teamsGraded: number;
  };
  deltas: {
    leagueAverage: number;
    sourceAgreement: number;
  };
}

export const HeroStats: React.FC<HeroStatsProps> = ({ stats, deltas }) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={12}>
      <Card variant="hero">
        <Stat>
          <StatLabel>League Average</StatLabel>
          <StatNumber>
            <GradeBadge grade={stats.leagueAverage} size="lg" />
          </StatNumber>
          <StatHelpText>
            <StatArrow type={deltas.leagueAverage >= 0 ? 'increase' : 'decrease'} />
            {Math.abs(deltas.leagueAverage).toFixed(1)} from last year
          </StatHelpText>
        </Stat>
      </Card>

      <Card variant="hero">
        <Stat>
          <StatLabel>Toughest Critic</StatLabel>
          <StatNumber fontSize="lg">{stats.toughestCritic}</StatNumber>
          <StatHelpText>Lowest average grades</StatHelpText>
        </Stat>
      </Card>

      <Card variant="hero">
        <Stat>
          <StatLabel>Source Agreement</StatLabel>
          <StatNumber>{stats.sourceAgreement.toFixed(1)}%</StatNumber>
          <StatHelpText>
            <StatArrow type={deltas.sourceAgreement >= 0 ? 'increase' : 'decrease'} />
            {Math.abs(deltas.sourceAgreement).toFixed(1)}% consensus
          </StatHelpText>
        </Stat>
      </Card>

      <Card variant="hero">
        <Stat>
          <StatLabel>Teams Graded</StatLabel>
          <StatNumber>{stats.teamsGraded}</StatNumber>
          <StatHelpText>Across all sources</StatHelpText>
        </Stat>
      </Card>
    </SimpleGrid>
  );
};

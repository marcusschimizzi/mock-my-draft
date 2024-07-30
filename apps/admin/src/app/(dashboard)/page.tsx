'use client';

import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
import { useTeams } from '@/lib/teams';
import { useSources } from '@/lib/sources';
import { useSourceArticles } from '@/lib/sources-articles';
import { useDraftGrades } from '@/lib/draft-grades';
import DataSummary from '@/components/data-summary';
import { useDraftPicks } from '@/lib/draft-picks';
import { usePlayers } from '@/lib/players';

export default function Index() {
  const { teams, isLoading: teamsLoading } = useTeams();
  const { sources, isLoading: sourcesLoading } = useSources();
  const { sourceArticles, isLoading: sourceArticlesLoading } =
    useSourceArticles();
  const { draftGrades, isLoading: draftGradesLoading } = useDraftGrades();
  const { draftPicks, isLoading: draftPicksLoading } = useDraftPicks();
  const { players, isLoading: playersLoading } = usePlayers();

  return (
    <main>
      <Box maxWidth={800} mx="auto" p={4} mt={8}>
        <Heading mb={6}>Admin Dashboard</Heading>
        <SimpleGrid
          columns={{
            base: 1,
            md: 2,
            lg: 3,
          }}
          columnGap={4}
          rowGap={4}
        >
          <DataSummary
            title="Teams"
            data={teams}
            isLoading={teamsLoading}
            link="/teams"
          />
          <DataSummary
            title="Sources"
            data={sources}
            isLoading={sourcesLoading}
            link="/sources"
          />
          <DataSummary
            title="Source Articles"
            data={sourceArticles}
            isLoading={sourceArticlesLoading}
            link="/source-articles"
          />
          <DataSummary
            title="Draft Grades"
            data={draftGrades}
            isLoading={draftGradesLoading}
            link="/draft-grades"
          />
          <DataSummary
            title="Draft Picks"
            data={draftPicks}
            isLoading={draftPicksLoading}
            link="/draft-picks"
          />
          <DataSummary
            title="Players"
            data={players}
            isLoading={playersLoading}
            link="/players"
          />
        </SimpleGrid>
      </Box>
    </main>
  );
}

'use client';

import { Box, Heading, Wrap, WrapItem } from '@chakra-ui/react';
import DashboardLayout from '../layouts/dashboard-layout';
import { useTeams } from '../lib/teams';
import { useSources } from '../lib/sources';
import { useSourceArticles } from '../lib/sources-articles';
import { useDraftGrades } from '../lib/draft-grades';
import DataSummary from '../components/data-summary';

export default function Index() {
  const { teams, isLoading: teamsLoading } = useTeams();
  const { sources, isLoading: sourcesLoading } = useSources();
  const { sourceArticles, isLoading: sourceArticlesLoading } =
    useSourceArticles();
  const { draftGrades, isLoading: draftGradesLoading } = useDraftGrades();

  return (
    <DashboardLayout requireAdmin={true}>
      <main>
        <Box maxWidth={800} mx="auto" p={4} mt={8}>
          <Heading mb={6}>Admin Dashboard</Heading>
          <Wrap>
            <WrapItem>
              <DataSummary
                title="Teams"
                data={teams}
                isLoading={teamsLoading}
              />
            </WrapItem>
            <WrapItem>
              <DataSummary
                title="Sources"
                data={sources}
                isLoading={sourcesLoading}
              />
            </WrapItem>
            <WrapItem>
              <DataSummary
                title="Source Articles"
                data={sourceArticles}
                isLoading={sourceArticlesLoading}
              />
            </WrapItem>
            <WrapItem>
              <DataSummary
                title="Draft Grades"
                data={draftGrades}
                isLoading={draftGradesLoading}
              />
            </WrapItem>
          </Wrap>
        </Box>
      </main>
    </DashboardLayout>
  );
}

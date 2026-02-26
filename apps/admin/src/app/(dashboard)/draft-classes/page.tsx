'use client';

import { Loading } from '@/components/loading';
import { useDraftClasses, useDraftClassYears } from '@/lib/draft-class';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  HStack,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  chakra,
} from '@chakra-ui/react';
import { ReactNode, useMemo, useState } from 'react';

const ViewDraftClassesPage = () => {
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [year, setYear] = useState(new Date().getFullYear());
  const { years, isLoading: isYearsLoading } = useDraftClassYears();
  const { draftClasses, isLoading } = useDraftClasses(year);

  const sortedDraftClasses = useMemo(() => {
    if (!draftClasses) return [];

    return [...draftClasses].sort((a, b) => {
      let aValue, bValue;

      switch (sortColumn) {
        case 'team':
          aValue = a.draftPicks[0].currentTeam.name;
          bValue = b.draftPicks[0].currentTeam.name;
          break;
        case 'year':
          aValue = a.year;
          bValue = b.year;
          break;
        case 'picks':
          aValue = a.draftPicks.length;
          bValue = b.draftPicks.length;
          break;
        default:
          return 0;
      }

      if (!aValue || !bValue) return 0;

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [draftClasses, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    console.info('Sorting by', column);
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const SortableHeader = ({
    column,
    children,
  }: {
    column: string;
    children: ReactNode;
  }) => (
    <Th
      onClick={() => handleSort(column)}
      cursor="pointer"
      _hover={{ textDecoration: 'underline' }}
    >
      <chakra.span display="flex" alignItems="center">
        {children}
        {sortColumn === column && (
          <chakra.span ml={2}>
            {sortDirection === 'asc' ? '▲' : '▼'}
          </chakra.span>
        )}
      </chakra.span>
    </Th>
  );

  const AccordionComponentWrapper = ({ children, type, ...rest }: { children: React.ReactNode; type?: string } & React.HTMLAttributes<HTMLDivElement>) => {
    if (type === 'AccordionItem') {
      return <>{children}</>;
    }
    return <div {...rest}>{children}</div>;
  };

  return (
    <Box maxW="container.xl" mx="auto" mt={8} p={4}>
      <HStack mb={6} justifyContent="space-between">
        <Heading>View Draft Classes</Heading>
        <Select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          maxW={100}
        >
          {(years ?? [year]).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>
      </HStack>
      <Accordion allowToggle>
        <TableContainer whiteSpace="pre-line" overflowX={'hidden'}>
          {isLoading || isYearsLoading ? (
            <Loading />
          ) : (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <SortableHeader column="team">Team</SortableHeader>
                  <SortableHeader column="year">Year</SortableHeader>
                  <SortableHeader column="picks">Picks</SortableHeader>
                  <Th width={'50px'}></Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedDraftClasses?.map((draftClass) => (
                  <AccordionItem
                    key={`${draftClass.teamId}-${draftClass.year}`}
                    as={AccordionComponentWrapper}
                    type="AccordionItem"
                  >
                    {({ isExpanded }) => (
                      <>
                        <Tr key={`${draftClass.teamId}-${draftClass.year}`}>
                          <Td>{draftClass.draftPicks[0].currentTeam.name}</Td>
                          <Td>{draftClass.year}</Td>
                          <Td>{draftClass.draftPicks.length}</Td>
                          <Td>
                            <AccordionButton>
                              <AccordionIcon />
                            </AccordionButton>
                          </Td>
                        </Tr>
                        {isExpanded && (
                          <Tr>
                            <Td colSpan={4}>
                              <AccordionPanel>
                                <TableContainer>
                                  <Table variant="simple">
                                    <Thead>
                                      <Tr>
                                        <Th>Round</Th>
                                        <Th>Overall</Th>
                                        <Th>Player</Th>
                                        <Th>Position</Th>
                                        <Th>College</Th>
                                      </Tr>
                                    </Thead>
                                    <Tbody>
                                      {draftClass.draftPicks.map((pick) => (
                                        <Tr key={pick.id}>
                                          <Td>{pick.round}</Td>
                                          <Td>{pick.pickNumber}</Td>
                                          <Td>{pick.player?.name}</Td>
                                          <Td>{pick.player?.position}</Td>
                                          <Td>{pick.player?.college}</Td>
                                        </Tr>
                                      ))}
                                    </Tbody>
                                  </Table>
                                </TableContainer>
                              </AccordionPanel>
                            </Td>
                          </Tr>
                        )}
                      </>
                    )}
                  </AccordionItem>
                ))}
              </Tbody>
            </Table>
          )}
        </TableContainer>
      </Accordion>
    </Box>
  );
};

export default ViewDraftClassesPage;

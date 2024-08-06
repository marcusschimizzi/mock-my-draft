import { ComponentType, ReactNode, useState } from 'react';
import {
  Box,
  Table as ChakraTable,
  Skeleton,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

interface DataCell {
  type: 'text' | 'number' | 'component';
  column: string;
  value: string | number | ReactNode;
}

type DataRow = DataCell[];

interface TableProps {
  data: DataRow[];
  isLoading?: boolean;
}

const MotionTr = motion(Tr);
const MotionTbody = motion(Tbody);
const MotionBox = motion(Box);

const Table: ComponentType<TableProps> = ({ data, isLoading = false }) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const tableAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const rowAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;
    const cellA = a.find((cell) => cell.column === sortColumn);
    const cellB = b.find((cell) => cell.column === sortColumn);
    if (!cellA?.value || !cellB?.value || cellA?.value === cellB?.value)
      return 0;
    if (sortDirection === 'asc') {
      return cellA?.value > cellB?.value ? 1 : -1;
    } else {
      return cellA?.value < cellB?.value ? 1 : -1;
    }
  });

  return (
    <TableContainer>
      <ChakraTable variant="simple">
        <Thead>
          <Tr>
            {(data[0] ?? [])
              .map((cell) => cell.column)
              .map((column) => (
                <Th
                  key={column}
                  cursor="pointer"
                  onClick={() => handleSort(column)}
                >
                  <Box display="flex" alignItems="center">
                    <Text>{column}</Text>
                    {sortColumn === column && (
                      <MotionBox
                        animate={{ rotate: sortDirection === 'asc' ? 0 : 180 }}
                        transition={{ duration: 0.3 }}
                        ml={2}
                      >
                        <FontAwesomeIcon icon={faArrowUp} />
                      </MotionBox>
                    )}
                  </Box>
                </Th>
              ))}
          </Tr>
        </Thead>
        <AnimatePresence>
          {isLoading ? (
            <Tbody>
              <MotionTr>
                <Td colSpan={Object.keys(data[0]).length + 1}>
                  <Skeleton height="40px" />
                </Td>
              </MotionTr>
            </Tbody>
          ) : (
            <MotionTbody
              variants={tableAnimation}
              initial="hidden"
              animate="show"
            >
              {sortedData.map((row, index) => (
                <MotionTr
                  key={index}
                  variants={rowAnimation}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                >
                  {Object.values(row).map((cell, index) => (
                    <Td key={index}>{cell.value}</Td>
                  ))}
                </MotionTr>
              ))}
            </MotionTbody>
          )}
        </AnimatePresence>
      </ChakraTable>
    </TableContainer>
  );
};

export default Table;

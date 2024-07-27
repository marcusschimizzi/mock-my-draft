import { useCreateDraftGrade, useUpdateDraftGrade } from '@/lib/draft-grades';
import { CreateDraftGradeDto, DraftGrade, SourceArticle, Team } from '@/types';
import { FormEvent, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useSourceArticles } from '@/lib/sources-articles';
import { useTeams } from '@/lib/teams';
import { boxShadow } from '@/utils/style-utils';

interface DraftGradeFormProps {
  draftGrade: Partial<CreateDraftGradeDto>;
  onChange: (draftGrade: Partial<CreateDraftGradeDto>) => void;
  sourceArticles: SourceArticle[];
  teams: Team[];
}

function DraftGradeForm({
  draftGrade,
  onChange,
  sourceArticles,
  teams,
}: DraftGradeFormProps) {
  return (
    <Box as="form">
      <VStack spacing={4} mb={8}>
        <FormControl isRequired>
          <FormLabel>Team</FormLabel>
          <Select
            value={draftGrade.teamId}
            onChange={(e) =>
              onChange({ ...draftGrade, teamId: e.target.value })
            }
          >
            <option value="">Select a team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Grade</FormLabel>
          <Select
            value={draftGrade.grade?.toUpperCase()}
            onChange={(e) => onChange({ ...draftGrade, grade: e.target.value })}
          >
            <option value="">Select a grade</option>
            <option value="A+">A+</option>
            <option value="A">A</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B">B</option>
            <option value="B-">B-</option>
            <option value="C+">C+</option>
            <option value="C">C</option>
            <option value="C-">C-</option>
            <option value="D+">D+</option>
            <option value="D">D</option>
            <option value="D-">D-</option>
            <option value="F">F</option>
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Source article</FormLabel>
          <Select
            value={draftGrade.sourceArticleId}
            onChange={(e) =>
              onChange({ ...draftGrade, sourceArticleId: e.target.value })
            }
          >
            <option value="">Select a source article</option>
            {sourceArticles.map((sourceArticle) => (
              <option key={sourceArticle.id} value={sourceArticle.id}>
                {sourceArticle.title}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Year</FormLabel>
          <Input
            type="number"
            min={1995}
            max={new Date().getFullYear()}
            value={draftGrade.year}
            onChange={(e) =>
              onChange({ ...draftGrade, year: parseInt(e.target.value) })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Notes</FormLabel>
          <Textarea
            value={draftGrade.text}
            onChange={(e) => onChange({ ...draftGrade, text: e.target.value })}
          />
        </FormControl>
      </VStack>
    </Box>
  );
}

interface DraftGradeDrawerProps {
  draftGrade: Partial<CreateDraftGradeDto>;
  onClose: () => void;
  isOpen: boolean;
  onChange: (draftGrade: Partial<CreateDraftGradeDto>) => void;
  toggleBtnRef: React.MutableRefObject<null>;
  selectedId: string | null;
}

function DraftGradeDrawer({
  draftGrade,
  onChange,
  isOpen,
  onClose,
  toggleBtnRef,
  selectedId,
}: DraftGradeDrawerProps) {
  const createDraftGrade = useCreateDraftGrade({ onSuccess: onClose });
  const updateDraftGrade = useUpdateDraftGrade({ onSuccess: onClose });
  const { sourceArticles } = useSourceArticles();
  const { teams } = useTeams();
  const [isValid, setIsValid] = useState(false);

  console.info('Grade:', draftGrade);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (selectedId) {
      updateDraftGrade.submit(draftGrade as DraftGrade);
    } else {
      createDraftGrade.submit({
        year: draftGrade.year,
        sourceArticleId: draftGrade.sourceArticleId,
        teamId: draftGrade.teamId,
        grade: draftGrade.grade,
        text: draftGrade.text,
      } as CreateDraftGradeDto);
    }
  };

  useEffect(() => {
    console.info('Check validity:', {
      teamId: draftGrade.teamId,
      grade: draftGrade.grade,
      sourceArticleId: draftGrade.sourceArticleId,
      year: draftGrade.year,
    });
    setIsValid(
      !!draftGrade.teamId &&
        !!draftGrade.grade &&
        !!draftGrade.sourceArticleId &&
        !!draftGrade.year,
    );
  }, [draftGrade]);

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        finalFocusRef={toggleBtnRef}
        placement="right"
      >
        <DrawerOverlay />
        <DrawerContent
          bg="elevations.light.dp12"
          _dark={{ bg: 'elevations.dark.dp12' }}
          boxShadow={boxShadow(12)}
        >
          <DrawerCloseButton />

          <DrawerHeader>
            {selectedId ? 'Edit draft grade' : 'Add draft grade'}
          </DrawerHeader>

          <DrawerBody>
            <DraftGradeForm
              draftGrade={draftGrade}
              onChange={onChange}
              sourceArticles={sourceArticles}
              teams={teams}
            />
          </DrawerBody>

          <DrawerFooter>
            <Box w="full" display="flex" justifyContent="space-between">
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="primary"
                onClick={handleSubmit}
                isDisabled={!isValid}
              >
                Save
              </Button>
            </Box>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default DraftGradeDrawer;

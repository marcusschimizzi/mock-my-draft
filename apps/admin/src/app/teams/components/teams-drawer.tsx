import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';
import { defaultTeam, Team } from '../../../types';
import { FormEvent, useState } from 'react';
import { useCreateTeam, useUpdateTeam } from '../../../lib/teams';
import TeamsForm from './teams-form';

interface TeamsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  toggleBtnRef: React.MutableRefObject<null>;
}

function TeamsDrawer({ isOpen, onClose, toggleBtnRef }: TeamsDrawerProps) {
  const [team, setTeam] = useState<Partial<Team>>(defaultTeam);
  const createTeam = useCreateTeam({ onSuccess: onClose });
  const updateTeam = useUpdateTeam({ onSuccess: onClose });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (team.id) {
      updateTeam.submit(team as Team);
    } else {
      createTeam.submit(team as Team);
    }
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        finalFocusRef={toggleBtnRef}
        placement="right"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />

          <DrawerHeader>{team.id ? 'Edit Team' : 'Add Team'}</DrawerHeader>

          <DrawerBody>
            <TeamsForm team={team} onChange={setTeam} />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default TeamsDrawer;

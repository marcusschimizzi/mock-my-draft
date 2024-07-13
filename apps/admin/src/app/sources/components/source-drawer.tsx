import { useCreateSource, useUpdateSource } from '../../../lib/sources';
import { Source } from '../../../types';
import { FormEvent } from 'react';
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
import SourceForm from './source-form';

interface SourcesDrawerProps {
  source: Partial<Source>;
  onChange: (source: Partial<Source>) => void;
  isOpen: boolean;
  onClose: () => void;
  toggleBtnRef: React.MutableRefObject<null>;
}

function SourcesDrawer({
  source,
  onChange,
  isOpen,
  onClose,
  toggleBtnRef,
}: SourcesDrawerProps) {
  const createSource = useCreateSource({ onSuccess: onClose });
  const updateSource = useUpdateSource({ onSuccess: onClose });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (source.id) {
      updateSource.submit(source as Source);
    } else {
      createSource.submit(source as Source);
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

          <DrawerHeader>
            {source.id ? 'Edit source' : 'Add source'}
          </DrawerHeader>

          <DrawerBody>
            <SourceForm source={source} onChange={onChange} />
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

export default SourcesDrawer;

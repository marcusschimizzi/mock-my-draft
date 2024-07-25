import { useCreateSource, useUpdateSource } from '../../../lib/sources';
import { Source } from '../../../types';
import { FormEvent } from 'react';
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
  useToast,
} from '@chakra-ui/react';
import SourceForm from './source-form';
import { boxShadow } from '@/utils/style-utils';

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
  const toast = useToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      if (source.id) {
        updateSource.submit(source as Source);
        toast({
          title: 'Source updated',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        createSource.submit(source as Source);
        toast({
          title: 'Source created',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'We encountered an error',
        description: 'Could not save source.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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
        <DrawerContent
          bg="elevations.light.dp12"
          _dark={{ bg: 'elevations.dark.dp12' }}
          boxShadow={boxShadow(12)}
        >
          <DrawerCloseButton />

          <DrawerHeader>
            {source.id ? 'Edit source' : 'Add source'}
          </DrawerHeader>

          <DrawerBody>
            <SourceForm source={source} onChange={onChange} />
          </DrawerBody>

          <DrawerFooter>
            <Box display="flex" justifyContent="space-between" w="full">
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleSubmit}>
                Save
              </Button>
            </Box>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SourcesDrawer;

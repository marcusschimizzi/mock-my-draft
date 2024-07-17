import { ReactElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faPeopleGroup,
  faPerson,
  faHandshake,
  faRulerVertical,
  faNewspaper,
  faBars,
} from '@fortawesome/free-solid-svg-icons';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js';

interface NavItem {
  name: string;
  path: string;
  icon: ReactElement;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: <FontAwesomeIcon icon={faHome} /> },
  {
    name: 'Teams',
    path: '/teams',
    icon: <FontAwesomeIcon icon={faHandshake} />,
  },
  {
    name: 'Players',
    path: '/players',
    icon: <FontAwesomeIcon icon={faPerson} />,
  },
  {
    name: 'Users',
    path: '/users',
    icon: <FontAwesomeIcon icon={faPeopleGroup} />,
  },
  {
    name: 'Draft Grades',
    path: '/draft-grades',
    icon: <FontAwesomeIcon icon={faRulerVertical} />,
  },
  {
    name: 'Sources',
    path: '/sources',
    icon: <FontAwesomeIcon icon={faNewspaper} />,
  },
];

const SideNavMenu: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const NavContent = () => (
    <VStack align="stretch" spacing={4}>
      {navItems.map((item) => (
        <Button
          key={item.name}
          as={Link}
          href={item.path}
          leftIcon={item.icon}
          justifyContent="flex-start"
          variant="ghost"
          w="full"
          onClick={isMobile ? onClose : undefined}
        >
          {item.name}
        </Button>
      ))}
    </VStack>
  );

  if (isMobile) {
    return (
      <>
        <Button
          onClick={onOpen}
          zIndex="overlay"
          top={6}
          right={4}
          position="fixed"
        >
          <FontAwesomeIcon icon={faBars} />
        </Button>
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody>
              <NavContent />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <Box
      as="nav"
      pos="fixed"
      top={0}
      left={0}
      h="full"
      w={64}
      bg="gray.100"
      boxShadow="md"
      p={4}
    >
      <Text fontSize="xl" fontWeight="bold" mb={6}>
        Admin Dashboard
      </Text>
      <NavContent />
    </Box>
  );
};

export default SideNavMenu;

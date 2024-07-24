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
  faWandSparkles,
  faFootball,
  faFootballBall,
} from '@fortawesome/free-solid-svg-icons';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js';
import { boxShadow } from '@/utils/style-utils';

interface NavCategory {
  name: string;
  items: NavItem[];
}

interface NavItem {
  name: string;
  path: string;
  icon: ReactElement;
}

const navItems: (NavItem | NavCategory)[] = [
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
    name: 'Sources',
    items: [
      {
        name: 'Manage sources',
        path: '/sources',
        icon: <FontAwesomeIcon icon={faNewspaper} />,
      },
      {
        name: 'Source articles',
        path: '/source-articles',
        icon: <FontAwesomeIcon icon={faNewspaper} />,
      },
      {
        name: 'Add source article',
        path: '/source-articles/create',
        icon: <FontAwesomeIcon icon={faWandSparkles} />,
      },
    ],
  },
  {
    name: 'Grades',
    items: [
      {
        name: 'Draft Grades',
        path: '/draft-grades',
        icon: <FontAwesomeIcon icon={faRulerVertical} />,
      },
    ],
  },
  {
    name: 'Draft Picks',
    items: [
      {
        name: 'Manage draft picks',
        path: '/draft-picks',
        icon: <FontAwesomeIcon icon={faFootball} />,
      },
      {
        name: 'Bulk edit draft picks',
        path: '/draft-picks/bulk',
        icon: <FontAwesomeIcon icon={faFootballBall} />,
      },
    ],
  },
];

const NavItemButton: React.FC<{
  item: NavItem;
  isMobile?: boolean;
  onClose: () => void;
}> = ({ item, isMobile, onClose }) => (
  <Button
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
);

const isNavCategory = (item: NavItem | NavCategory): item is NavCategory =>
  (item as NavCategory).items !== undefined;

const SideNavMenu: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const NavContent = () => (
    <VStack align="stretch" spacing={4}>
      {navItems.map((item) => {
        if (isNavCategory(item)) {
          return (
            <Accordion allowToggle key={item.name}>
              <AccordionItem border="none">
                <Heading>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left" fontWeight="700">
                      {item.name}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </Heading>
                <AccordionPanel pb={4}>
                  {item.items.map((subItem) => (
                    <NavItemButton
                      key={subItem.path}
                      item={subItem}
                      isMobile={isMobile}
                      onClose={onClose}
                    />
                  ))}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          );
        }
        return (
          <NavItemButton
            key={item.path}
            item={item}
            isMobile={isMobile}
            onClose={onClose}
          />
        );
      })}
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
      bg="elevations.light.dp8"
      _dark={{
        bg: 'elevations.dark.dp8',
      }}
      boxShadow={boxShadow(8)}
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

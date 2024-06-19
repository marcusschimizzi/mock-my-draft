import {
  Button,
  ButtonGroup,
  Container,
  Flex,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import React from "react";
import Logo from "@/components/logo";

export function Nav() {
  return (
    <>
      <Container maxW="8xl">
        <Flex
          justifyContent="space-between"
          alignContent="center"
          as="nav"
          p={8}
        >
          <Logo />
          <ButtonGroup>
            <Popover>
              <PopoverTrigger>
                <Button>Teams</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverCloseButton />
                <PopoverHeader>Teams</PopoverHeader>
                <PopoverBody>
                  <ul>
                    <li>Baltimore Ravens</li>
                    <li>Pittsburgh Steelers</li>
                    <li>Cincinnati Bengals</li>
                    <li>Cleveland Browns</li>
                  </ul>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </ButtonGroup>
        </Flex>
      </Container>
    </>
  );
}

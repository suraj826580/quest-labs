import React, { useState } from "react";
import { Box, Heading, Container, Text, Button, Stack } from "@chakra-ui/react";
import PopupForm from "./PopupForm.js";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Container maxW={"3xl"}>
        <Stack
          as={Box}
          textAlign={"center"}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}>
          <Heading
            fontWeight={600}
            fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}>
            Quest-labs <br />
            <Text as={"span"} color={"green.400"}>
              SDE-Engineers
            </Text>
          </Heading>
          <Text color={"gray.500"}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Necessitatibus nostrum quis incidunt unde cum, officiis non minus
            doloremque nemo praesentium eligendi eveniet, harum, veniam eius
            illo amet veritatis vel nesciunt.
          </Text>
          <Stack
            direction={"column"}
            spacing={3}
            align={"center"}
            alignSelf={"center"}
            position={"relative"}>
            <Box>
              <Button
                colorScheme={"green"}
                bg={"green.400"}
                rounded={"full"}
                px={6}
                _hover={{
                  bg: "green.500",
                }}
                onClick={togglePopup}>
                Open Form
              </Button>
              {isOpen && <PopupForm isOpen={isOpen} onClose={togglePopup} />}
            </Box>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}

export default App;

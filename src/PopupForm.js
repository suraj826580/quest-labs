import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import axios from "axios";

const API_KEY = "k-8f7aa4ea-a0c7-42ac-a821-a342d21887fe";
const ENTITY_AUTHENTICATION_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnRpdHlJZCI6ImUtYjY2YmNhMjQtZjZjZS00NDg5LWIyZTktZTI0YTkwZTA0ODc3IiwiaWF0IjoxNzE4ODcyODg0fQ.O0DEB_S-dirK4MMa2nm0yqwDhdCtdvTySPGpmCGAqqU";
const ENTITY_ID = "e-b66bca24-f6ce-4489-b2e9-e24a90e04877";
const CAMPAIGN_ID = "c-14d4f959-5999-4308-af48-37549b89eec7";

function PopupForm({ isOpen, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      axios
        .get("https://staging.questapp.com/getcampaigndetails", {
          headers: {
            Authorization: `Bearer ${ENTITY_AUTHENTICATION_TOKEN}`,
            "x-api-key": API_KEY,
          },
          params: {
            entityId: ENTITY_ID,
            campaignId: CAMPAIGN_ID,
          },
        })
        .then((response) => {
          const data = response.data;
          setValue("name", data.name);
          setValue("email", data.email);
        })
        .catch((error) => {
          toast({
            title: "Error fetching form data",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    } else {
      reset();
    }
  }, [isOpen, toast, reset, setValue]);

  const onSubmit = (data) => {
    axios
      .post("https://staging.questapp.com/veirfycampaignaction", data, {
        headers: {
          Authorization: `Bearer ${ENTITY_AUTHENTICATION_TOKEN}`,
          "x-api-key": API_KEY,
        },
      })
      .then((response) => {
        toast({
          title: "Form submitted",
          description: "Your form has been submitted successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
      })
      .catch((error) => {
        toast({
          title: "Error submitting form",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"full"}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Fill out the form</DrawerHeader>
        <DrawerBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.name}>
              <FormLabel>Name</FormLabel>
              <Input {...register("name", { required: "Name is required" })} />
              {errors.name && <span>{errors.name.message}</span>}
            </FormControl>
            <FormControl mt={4} isInvalid={errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && <span>{errors.email.message}</span>}
            </FormControl>
            <Button
              colorScheme={"green"}
              bg={"green.400"}
              rounded={"full"}
              px={6}
              _hover={{
                bg: "green.500",
              }}
              mt={4}
              type="submit">
              Submit
            </Button>
          </form>
        </DrawerBody>
        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default PopupForm;

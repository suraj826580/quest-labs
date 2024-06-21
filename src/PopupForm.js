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
  Skeleton,
  Stack,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import axios from "axios";

const API_KEY = "k-8f7aa4ea-a0c7-42ac-a821-a342d21887fe";
const ENTITY_ID = "e-b66bca24-f6ce-4489-b2e9-e24a90e04877";
const CAMPAIGN_ID = "c-14d4f959-5999-4308-af48-37549b89eec7";
const campaignVariationId = "cv-d9d30363-2ce8-4793-a7b3-ab34eccdbd71";

function PopupForm({ isOpen, onClose }) {
  const [formFields, setFormFields] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      setisLoading(true);
      axios
        .get(
          `https://staging.questprotocol.xyz/api/v2/entities/${ENTITY_ID}/campaigns/${CAMPAIGN_ID}`,
          {
            headers: {
              accept: "application/json",
              apikey: API_KEY,
              token:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1LTY1NjAyMzg5LTU0ODgtNGI2Ni1hM2M4LTJiYmQ4OTlmMjcyMSIsImlhdCI6MTcxODk4MDc4NiwiZXhwIjoxNzE5NTg1NTg2fQ.-rG_17y3QBJuwRdTivs-35qRwfqVKdZduLv30E85f48",
              userid: "u-65602389-5488-4b66-a3c8-2bbd899f2721",
            },
          }
        )
        .then((response) => {
          const data = response.data || [];
          if (data.success) {
            setFormFields(
              data.data.actions.map((action) => ({
                title: action.title,
                actionId: action.actionId,
              }))
            );
          }
        })
        .catch((error) => {
          toast({
            title: "Error fetching form data",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        })
        .finally(() => setisLoading(false));
    } else {
      reset();
    }
  }, [isOpen, reset, toast]);

  const onSubmit = (data) => {
    const formData = formFields.map((field) => ({
      title: field.title,
      actionId: field.actionId,
      answers: [data[field.title.toLowerCase().split(" ").join("_")]],
    }));
    setisLoading(true);
    axios
      .post(
        `https://staging.questprotocol.xyz/api/v2/entities/${ENTITY_ID}/campaigns/${CAMPAIGN_ID}/verify`,
        { actions: formData, campaignVariationId },
        {
          headers: {
            accept: "application/json",
            apikey: API_KEY,
            token:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1LTY1NjAyMzg5LTU0ODgtNGI2Ni1hM2M4LTJiYmQ4OTlmMjcyMSIsImlhdCI6MTcxODk4MDc4NiwiZXhwIjoxNzE5NTg1NTg2fQ.-rG_17y3QBJuwRdTivs-35qRwfqVKdZduLv30E85f48",
            userid: "u-65602389-5488-4b66-a3c8-2bbd899f2721",
            "content-type": "application/json",
          },
        }
      )
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
      })
      .finally(() => setisLoading(false));
  };

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"lg"}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Fill out the form</DrawerHeader>
          <DrawerBody>
            {!isLoading ? (
              <form>
                {formFields.map((fieldName, index) => (
                  <FormControl
                    key={fieldName.title}
                    isInvalid={
                      errors[fieldName.title.toLowerCase().split(" ").join("_")]
                    }>
                    <FormLabel>{fieldName.title}</FormLabel>
                    <Input
                      {...register(
                        fieldName.title.toLowerCase().split(" ").join("_"),
                        {
                          required: `${fieldName.title} is required`,
                        }
                      )}
                    />
                    {errors[
                      fieldName.title.toLowerCase().split(" ").join("_")
                    ] && (
                      <span>
                        {
                          errors[
                            fieldName.title.toLowerCase().split(" ").join("_")
                          ].message
                        }
                      </span>
                    )}
                  </FormControl>
                ))}
              </form>
            ) : (
              <Stack>
                {new Array(15).fill(10).map((ele, index) => {
                  return <Skeleton key={index} height="40px" />;
                })}
              </Stack>
            )}
          </DrawerBody>
          <DrawerFooter>
            <Button px={4} variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Box display={"flex"} alignItems={"center"} gap={2}>
              <Button
                colorScheme={"green"}
                px={4}
                bg={"green.400"}
                _hover={{
                  bg: "green.500",
                }}
                onClick={handleSubmit(onSubmit)}>
                {!isLoading ? "Submit" : <Spinner color="white" />}
              </Button>
            </Box>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default PopupForm;

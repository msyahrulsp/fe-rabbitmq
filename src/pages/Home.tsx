import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
  useToast
} from '@chakra-ui/react';
import { Layout } from '../components/Layout';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BaseSyntheticEvent } from 'react';
import axios from 'axios';

type BookingType = 'vaccination' | string;

interface FormValue {
  name: string;
  email: string;
  phone: string;
  datetime: string;
  bookingType: BookingType;
  description?: string;
}

export const HomePage = () => {
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      datetime: new Date().toISOString().split('T')[0],
      bookingType: 'vaccination',
      description: ''
    }
  });
  const toast = useToast();

  const submitHandler: SubmitHandler<FormValue> = (data: FormValue, event) => {
    event?.preventDefault();

    try {
      const res = axios.post('docker-booking-client:3001/api/v1/book', data);
      console.log(res);

      toast({
        description: 'WIBU ROJAN',
        status: 'success',
        duration: 3000,
        position: 'top',
        isClosable: true
      });
    } catch (error) {
      toast({
        description: 'Yah gagal :p',
        status: 'error',
        duration: 3000,
        position: 'top',
        isClosable: true
      });
      console.error(error);
    }
  };

  return (
    <Layout>
      <VStack
        spacing={2}
        bg="#FFFFFF99"
        borderRadius="lg"
        py={4}
        px={5}
        alignItems="flex-start"
        w="50ch"
      >
        <VStack spacing={2} w="full">
          <FormControl isInvalid={!!formState.errors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              {...register('name', {
                required: { value: true, message: 'Nama tidak boleh kosong' }
              })}
              type="text"
              placeholder="John Doe"
              variant="flushed"
            />
            {formState.errors.name && (
              <FormErrorMessage>
                {formState.errors.name.message as string}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!formState.errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              {...register('email', {
                required: { value: true, message: 'Email tidak boleh kosong' },
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Email must be valid'
                }
              })}
              type="text"
              placeholder="john@gmail.com"
              variant="flushed"
            />
            {formState.errors.email && (
              <FormErrorMessage>
                {formState.errors.email.message as string}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!formState.errors.phone}>
            <FormLabel>Phone</FormLabel>
            <Input
              {...register('phone', {
                required: {
                  value: true,
                  message: 'Nomor HP tidak boleh kosong'
                },
                pattern: {
                  value: /\d+/,
                  message: 'Nomor HP harus angka'
                }
              })}
              type="text"
              placeholder="08123456789"
              variant="flushed"
            />
            {formState.errors.phone && (
              <FormErrorMessage>
                {formState.errors.phone.message as string}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!formState.errors.datetime}>
            <FormLabel>Tanggal</FormLabel>
            <Input
              {...register('datetime', {
                required: {
                  value: true,
                  message: 'Tanggal tidak boleh kosong'
                }
              })}
              type="date"
              variant="flushed"
            />
            {formState.errors.datetime && (
              <FormErrorMessage>
                {formState.errors.datetime.message as string}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!formState.errors.description}>
            <FormLabel>Description</FormLabel>
            <Input {...register('description')} variant="flushed" />
            {formState.errors.description && (
              <FormErrorMessage>
                {formState.errors.description.message as string}
              </FormErrorMessage>
            )}
          </FormControl>
        </VStack>
        <Button
          colorScheme="green"
          alignSelf="center"
          w="50%"
          onClick={(e: BaseSyntheticEvent) => handleSubmit(submitHandler)(e)}
        >
          Pesan
        </Button>
      </VStack>
    </Layout>
  );
};

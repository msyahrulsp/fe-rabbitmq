import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast
} from '@chakra-ui/react';
import { Layout } from '../components/Layout';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
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

export const PasientPage = () => {
  const { register, handleSubmit, formState, control, setValue } = useForm({
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

  const submitHandler: SubmitHandler<FormValue> = async (
    data: FormValue,
    event
  ) => {
    event?.preventDefault();

    try {
      const res = await axios.post(
        import.meta.env.VITE_BASE_REST_URL + '/api/v1/book',
        data,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(res);

      toast({
        description: 'Berhasil ditambahkan!',
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
    <Layout title="Pasient" bg="/pixiv.jpg">
      <VStack
        spacing={2}
        bg="#FFFFFFCC"
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
          <FormControl isInvalid={!!formState.errors.bookingType}>
            <FormLabel mb={1}>Type</FormLabel>
            <Controller
              control={control}
              name="bookingType"
              rules={{
                required: {
                  value: true,
                  message: 'Type must be filled'
                }
              }}
              render={() => (
                <Select
                  variant="filled"
                  w="full"
                  onChange={(e) =>
                    setValue('bookingType', e.target.value as unknown as string)
                  }
                  transition="all 0.2s ease-in-out"
                  _hover={{
                    opacity: 0.8
                  }}
                  _focus={{
                    background: 'gray.100',
                    color: 'black'
                  }}
                  cursor="pointer"
                >
                  <option
                    style={{
                      background: 'gray.100',
                      color: 'black'
                    }}
                    value="vaccination"
                  >
                    Vaccination
                  </option>
                  <option
                    style={{
                      background: 'gray.100',
                      color: 'black'
                    }}
                    value="general"
                  >
                    General
                  </option>
                </Select>
              )}
            />
            {formState.errors.bookingType && (
              <FormErrorMessage>
                {formState.errors.bookingType.message}
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

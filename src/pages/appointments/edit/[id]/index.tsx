import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getAppointmentById, updateAppointmentById } from 'apiSdk/appointments';
import { Error } from 'components/error';
import { appointmentValidationSchema } from 'validationSchema/appointments';
import { AppointmentInterface } from 'interfaces/appointment';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ResidentInterface } from 'interfaces/resident';
import { getResidents } from 'apiSdk/residents';

function AppointmentEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<AppointmentInterface>(
    () => (id ? `/appointments/${id}` : null),
    () => getAppointmentById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: AppointmentInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateAppointmentById(id, values);
      mutate(updated);
      resetForm();
      router.push('/appointments');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<AppointmentInterface>({
    initialValues: data,
    validationSchema: appointmentValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Appointment
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="date" mb="4">
              <FormLabel>Date</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.date as Date}
                onChange={(value: Date) => formik.setFieldValue('date', value)}
              />
            </FormControl>
            <FormControl id="time" mb="4">
              <FormLabel>Time</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.time as Date}
                onChange={(value: Date) => formik.setFieldValue('time', value)}
              />
            </FormControl>
            <FormControl id="doctor_name" mb="4" isInvalid={!!formik.errors?.doctor_name}>
              <FormLabel>Doctor Name</FormLabel>
              <Input type="text" name="doctor_name" value={formik.values?.doctor_name} onChange={formik.handleChange} />
              {formik.errors.doctor_name && <FormErrorMessage>{formik.errors?.doctor_name}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<ResidentInterface>
              formik={formik}
              name={'resident_id'}
              label={'Select Resident'}
              placeholder={'Select Resident'}
              fetcher={getResidents}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.first_name as any}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'appointment',
  operation: AccessOperationEnum.UPDATE,
})(AppointmentEditPage);

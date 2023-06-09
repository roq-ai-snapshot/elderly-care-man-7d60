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
import { getResidentById, updateResidentById } from 'apiSdk/residents';
import { Error } from 'components/error';
import { residentValidationSchema } from 'validationSchema/residents';
import { ResidentInterface } from 'interfaces/resident';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { CareHomeInterface } from 'interfaces/care-home';
import { getCareHomes } from 'apiSdk/care-homes';
import { allergyValidationSchema } from 'validationSchema/allergies';
import { appointmentValidationSchema } from 'validationSchema/appointments';
import { carePlanValidationSchema } from 'validationSchema/care-plans';
import { caregiverValidationSchema } from 'validationSchema/caregivers';
import { medicationValidationSchema } from 'validationSchema/medications';

function ResidentEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ResidentInterface>(
    () => (id ? `/residents/${id}` : null),
    () => getResidentById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ResidentInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateResidentById(id, values);
      mutate(updated);
      resetForm();
      router.push('/residents');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ResidentInterface>({
    initialValues: data,
    validationSchema: residentValidationSchema,
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
            Edit Resident
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
            <FormControl id="first_name" mb="4" isInvalid={!!formik.errors?.first_name}>
              <FormLabel>First Name</FormLabel>
              <Input type="text" name="first_name" value={formik.values?.first_name} onChange={formik.handleChange} />
              {formik.errors.first_name && <FormErrorMessage>{formik.errors?.first_name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="last_name" mb="4" isInvalid={!!formik.errors?.last_name}>
              <FormLabel>Last Name</FormLabel>
              <Input type="text" name="last_name" value={formik.values?.last_name} onChange={formik.handleChange} />
              {formik.errors.last_name && <FormErrorMessage>{formik.errors?.last_name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="date_of_birth" mb="4">
              <FormLabel>Date Of Birth</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.date_of_birth as Date}
                onChange={(value: Date) => formik.setFieldValue('date_of_birth', value)}
              />
            </FormControl>
            <AsyncSelect<CareHomeInterface>
              formik={formik}
              name={'care_home_id'}
              label={'Select Care Home'}
              placeholder={'Select Care Home'}
              fetcher={getCareHomes}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name as any}
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
  entity: 'resident',
  operation: AccessOperationEnum.UPDATE,
})(ResidentEditPage);

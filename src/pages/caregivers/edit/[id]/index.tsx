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
import { getCaregiverById, updateCaregiverById } from 'apiSdk/caregivers';
import { Error } from 'components/error';
import { caregiverValidationSchema } from 'validationSchema/caregivers';
import { CaregiverInterface } from 'interfaces/caregiver';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { ResidentInterface } from 'interfaces/resident';
import { getUsers } from 'apiSdk/users';
import { getResidents } from 'apiSdk/residents';

function CaregiverEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CaregiverInterface>(
    () => (id ? `/caregivers/${id}` : null),
    () => getCaregiverById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: CaregiverInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateCaregiverById(id, values);
      mutate(updated);
      resetForm();
      router.push('/caregivers');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<CaregiverInterface>({
    initialValues: data,
    validationSchema: caregiverValidationSchema,
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
            Edit Caregiver
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
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email as any}
                </option>
              )}
            />
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
  entity: 'caregiver',
  operation: AccessOperationEnum.UPDATE,
})(CaregiverEditPage);

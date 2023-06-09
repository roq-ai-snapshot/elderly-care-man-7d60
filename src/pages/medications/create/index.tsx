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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createMedication } from 'apiSdk/medications';
import { Error } from 'components/error';
import { medicationValidationSchema } from 'validationSchema/medications';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ResidentInterface } from 'interfaces/resident';
import { getResidents } from 'apiSdk/residents';
import { MedicationInterface } from 'interfaces/medication';

function MedicationCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: MedicationInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createMedication(values);
      resetForm();
      router.push('/medications');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<MedicationInterface>({
    initialValues: {
      name: '',
      dosage: '',
      resident_id: (router.query.resident_id as string) ?? null,
    },
    validationSchema: medicationValidationSchema,
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
            Create Medication
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="dosage" mb="4" isInvalid={!!formik.errors?.dosage}>
            <FormLabel>Dosage</FormLabel>
            <Input type="text" name="dosage" value={formik.values?.dosage} onChange={formik.handleChange} />
            {formik.errors.dosage && <FormErrorMessage>{formik.errors?.dosage}</FormErrorMessage>}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'medication',
  operation: AccessOperationEnum.CREATE,
})(MedicationCreatePage);

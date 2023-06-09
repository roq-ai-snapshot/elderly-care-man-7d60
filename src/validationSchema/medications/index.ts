import * as yup from 'yup';

export const medicationValidationSchema = yup.object().shape({
  name: yup.string().required(),
  dosage: yup.string().required(),
  resident_id: yup.string().nullable().required(),
});

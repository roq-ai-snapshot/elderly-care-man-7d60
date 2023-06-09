import * as yup from 'yup';

export const caregiverValidationSchema = yup.object().shape({
  user_id: yup.string().nullable().required(),
  resident_id: yup.string().nullable().required(),
});

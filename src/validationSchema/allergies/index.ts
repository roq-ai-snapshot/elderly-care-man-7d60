import * as yup from 'yup';

export const allergyValidationSchema = yup.object().shape({
  name: yup.string().required(),
  severity: yup.string().required(),
  resident_id: yup.string().nullable().required(),
});

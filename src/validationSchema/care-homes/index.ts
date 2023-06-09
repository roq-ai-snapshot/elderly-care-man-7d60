import * as yup from 'yup';
import { residentValidationSchema } from 'validationSchema/residents';

export const careHomeValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  image: yup.string(),
  user_id: yup.string().nullable().required(),
  resident: yup.array().of(residentValidationSchema),
});

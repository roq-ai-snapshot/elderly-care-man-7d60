import * as yup from 'yup';

export const carePlanValidationSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  resident_id: yup.string().nullable().required(),
});

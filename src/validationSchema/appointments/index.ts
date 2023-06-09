import * as yup from 'yup';

export const appointmentValidationSchema = yup.object().shape({
  date: yup.date().required(),
  time: yup.date().required(),
  doctor_name: yup.string().required(),
  resident_id: yup.string().nullable().required(),
});

import * as yup from 'yup';
import { allergyValidationSchema } from 'validationSchema/allergies';
import { appointmentValidationSchema } from 'validationSchema/appointments';
import { carePlanValidationSchema } from 'validationSchema/care-plans';
import { caregiverValidationSchema } from 'validationSchema/caregivers';
import { medicationValidationSchema } from 'validationSchema/medications';

export const residentValidationSchema = yup.object().shape({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  date_of_birth: yup.date().required(),
  care_home_id: yup.string().nullable().required(),
  allergy: yup.array().of(allergyValidationSchema),
  appointment: yup.array().of(appointmentValidationSchema),
  care_plan: yup.array().of(carePlanValidationSchema),
  caregiver: yup.array().of(caregiverValidationSchema),
  medication: yup.array().of(medicationValidationSchema),
});

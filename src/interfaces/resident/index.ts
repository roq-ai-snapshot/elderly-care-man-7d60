import { AllergyInterface } from 'interfaces/allergy';
import { AppointmentInterface } from 'interfaces/appointment';
import { CarePlanInterface } from 'interfaces/care-plan';
import { CaregiverInterface } from 'interfaces/caregiver';
import { MedicationInterface } from 'interfaces/medication';
import { CareHomeInterface } from 'interfaces/care-home';
import { GetQueryInterface } from 'interfaces';

export interface ResidentInterface {
  id?: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date | string;
  care_home_id: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  allergy?: AllergyInterface[];
  appointment?: AppointmentInterface[];
  care_plan?: CarePlanInterface[];
  caregiver?: CaregiverInterface[];
  medication?: MedicationInterface[];
  care_home?: CareHomeInterface;
  _count?: {
    allergy?: number;
    appointment?: number;
    care_plan?: number;
    caregiver?: number;
    medication?: number;
  };
}

export interface ResidentGetQueryInterface extends GetQueryInterface {
  id?: string;
  first_name?: string;
  last_name?: string;
  care_home_id?: string;
}

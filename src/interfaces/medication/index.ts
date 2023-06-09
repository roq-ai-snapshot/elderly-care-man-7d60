import { ResidentInterface } from 'interfaces/resident';
import { GetQueryInterface } from 'interfaces';

export interface MedicationInterface {
  id?: string;
  name: string;
  dosage: string;
  resident_id: string;
  created_at?: Date | string;
  updated_at?: Date | string;

  resident?: ResidentInterface;
  _count?: {};
}

export interface MedicationGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  dosage?: string;
  resident_id?: string;
}

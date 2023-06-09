import { ResidentInterface } from 'interfaces/resident';
import { GetQueryInterface } from 'interfaces';

export interface AppointmentInterface {
  id?: string;
  date: Date | string;
  time: Date | string;
  doctor_name: string;
  resident_id: string;
  created_at?: Date | string;
  updated_at?: Date | string;

  resident?: ResidentInterface;
  _count?: {};
}

export interface AppointmentGetQueryInterface extends GetQueryInterface {
  id?: string;
  doctor_name?: string;
  resident_id?: string;
}

import { ResidentInterface } from 'interfaces/resident';
import { GetQueryInterface } from 'interfaces';

export interface CarePlanInterface {
  id?: string;
  title: string;
  description: string;
  resident_id: string;
  created_at?: Date | string;
  updated_at?: Date | string;

  resident?: ResidentInterface;
  _count?: {};
}

export interface CarePlanGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  description?: string;
  resident_id?: string;
}

import { UserInterface } from 'interfaces/user';
import { ResidentInterface } from 'interfaces/resident';
import { GetQueryInterface } from 'interfaces';

export interface CaregiverInterface {
  id?: string;
  user_id: string;
  resident_id: string;
  created_at?: Date | string;
  updated_at?: Date | string;

  user?: UserInterface;
  resident?: ResidentInterface;
  _count?: {};
}

export interface CaregiverGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  resident_id?: string;
}

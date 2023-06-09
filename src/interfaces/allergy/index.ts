import { ResidentInterface } from 'interfaces/resident';
import { GetQueryInterface } from 'interfaces';

export interface AllergyInterface {
  id?: string;
  name: string;
  severity: string;
  resident_id: string;
  created_at?: Date | string;
  updated_at?: Date | string;

  resident?: ResidentInterface;
  _count?: {};
}

export interface AllergyGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  severity?: string;
  resident_id?: string;
}

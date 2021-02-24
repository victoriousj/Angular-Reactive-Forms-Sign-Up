import { UserType } from './../user-types/user-type';
import { Address } from '../home/addresses/address';

export interface User {
  id: number | null;
  firstName: string;
  middleInitial?: string;
  lastName: string;
  userTypeId: number;
  userType?: UserType;
  age?: number;
  gender: 'Male' | 'Female' | 'Not-Specified';
  email: string;
  phoneNumbers?: string[];
  addressIds: number[];
  addresses?: Address[];
  fullName?: string;
}

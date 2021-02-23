import { InMemoryDbService } from 'angular-in-memory-web-api';

import { UserType } from './user-types/user-type';
import { User } from './users/user';
import { Address } from './home/addresses/address';

import { UserTypeData } from './user-types/user-type-data';
import { UserData } from './users/user-data';
import { AddressData } from './home/addresses/address-data';

export class AppData implements InMemoryDbService {
  createDb(): { users: User[]; userTypes: UserType[]; addresses: Address[] } {
    const users = UserData.users;
    const userTypes = UserTypeData.userTypes;
    const addresses = AddressData.addresses;

    return { users, userTypes, addresses };
  }
}

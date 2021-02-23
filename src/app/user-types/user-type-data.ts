import { UserType } from './user-type';

export class UserTypeData {
  static userTypes: UserType[] = [
    {
      id: 1,
      name: 'Customer',
      description:
        'A regular user who has limited access and control to site functionality.',
    },
    {
      id: 2,
      name: 'Administrator',
      description:
        'A user who can view, create and edit important site functionality.',
    },
  ];
}

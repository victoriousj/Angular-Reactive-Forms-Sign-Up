import { UserTypeService } from './../user-types/user-type.service';
import { AddressService } from './../home/addresses/address.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  from,
  Observable,
  throwError,
} from 'rxjs';
import {
  catchError,
  map,
  switchMap,
  mergeMap,
  toArray,
  shareReplay,
} from 'rxjs/operators';

import { User } from './user';
import { Address } from '../home/addresses/address';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersUrl = 'api/users';
  private addressUrl = 'api/addresses';

  constructor(
    private http: HttpClient,
    private userTypeService: UserTypeService,
    private addressService: AddressService
  ) {}

  users$: Observable<User[]> = this.http
    .get<User[]>(this.usersUrl)
    .pipe(catchError(this.handleError), shareReplay(1));

  usersWithSubProps$ = combineLatest([
    this.users$,
    this.userTypeService.userTypes$,
    this.addressService.addresses$,
  ]).pipe(
    map(([users, userTypes, addresses]) =>
      users.map(
        (user) =>
          ({
            ...user,
            fullName: [user.firstName, user.middleInitial, user.lastName].join(
              ' '
            ),
            userType: userTypes.find(
              (userType) => userType.id === user.userTypeId
            ),
            addresses: addresses.filter((address) =>
              user.addressIds.includes(address.id)
            ),
          } as User)
      )
    )
  );

  private userSelectedSubject = new BehaviorSubject<number>(0);
  userSelectedAction = this.userSelectedSubject.asObservable();

  selectedUser$: Observable<User> = combineLatest([
    this.usersWithSubProps$,
    this.userSelectedAction,
  ]).pipe(
    map(
      ([users, selectedUserId]) =>
        users.find((user) => user.id === selectedUserId) as User
    )
  );

  selectedUserChanged(selectedUserId: number) {
    this.userSelectedSubject.next(selectedUserId);
  }

  private handleError(err: any): Observable<never> {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    return throwError(errorMessage);
  }
}

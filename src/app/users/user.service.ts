import { UserTypeService } from './../user-types/user-type.service';
import { AddressService } from './../home/addresses/address.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersUrl = 'api/users';

  constructor(
    private http: HttpClient,
    private userTypeService: UserTypeService,
    private addressService: AddressService
  ) {}

  users$: Observable<User[]> = this.http.get<User[]>(this.usersUrl).pipe(
    tap((data) => console.log('Users: ', data)),
    catchError(this.handleError)
  );

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
              user.addressIds?.includes(address.id!)
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

  createUser(user: User): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    user.id = null;

    return this.http
      .post<User>(this.usersUrl, user, { headers })
      .pipe(
        map((newUser) => newUser),
        catchError(this.handleError)
      );
  }

  updateUser(user: User): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.usersUrl}/${user.id}`;

    return this.http
      .put<User>(url, user, { headers })
      .pipe(catchError(this.handleError));
  }

  deleteUser(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.usersUrl}/${id}`;
    return this.http
      .delete<User>(url, { headers })
      .pipe(
        tap(() => console.log('Deleted User: ', id)),
        catchError(this.handleError)
      );
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

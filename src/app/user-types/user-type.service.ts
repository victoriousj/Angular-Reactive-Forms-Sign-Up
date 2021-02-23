import { catchError, shareReplay } from 'rxjs/operators';
import { UserType } from './user-type';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserTypeService {
  private userTypeUrl = 'api/userTypes';

  constructor(private http: HttpClient) {}

  userTypes$ = this.http
    .get<UserType[]>(this.userTypeUrl)
    .pipe(catchError(this.handleError), shareReplay(1));

  private handleError(err: any): Observable<never> {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}

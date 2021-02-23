import { catchError, shareReplay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Address } from './address';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private addressUrl = 'api/addresses';

  constructor(private http: HttpClient) {}

  addresses$ = this.http
    .get<Address[]>(this.addressUrl)
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

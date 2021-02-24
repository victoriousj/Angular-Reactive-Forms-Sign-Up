import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Address } from './address';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private addressUrl = 'api/addresses';

  constructor(private http: HttpClient) {}

  addresses$ = this.http.get<Address[]>(this.addressUrl).pipe(
    tap((data) => {
      console.log('Addresses: ', data);
    }),
    catchError(this.handleError)
  );

  createAddress(address: Address): Observable<Address> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    address.id = null;
    return this.http
      .post<Address>(this.addressUrl, address, { headers })
      .pipe(
        map((newAddress) => newAddress),
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
    console.error(err);
    return throwError(errorMessage);
  }
}

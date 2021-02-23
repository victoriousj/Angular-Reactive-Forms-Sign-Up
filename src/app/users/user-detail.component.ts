import { catchError } from 'rxjs/operators';
import { UserService } from './user.service';
import { Component } from '@angular/core';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent {
  errorMessage: string = '';

  constructor(private userService: UserService) {}

  user$ = this.userService.selectedUser$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );
}

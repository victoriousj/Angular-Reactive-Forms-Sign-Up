import { catchError } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';
import { UserService } from './user.service';
import { Component } from '@angular/core';
import { User } from './user';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent {
  pageTitle: string = 'Users';
  listFilter: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService) {}

  users$: Observable<User[]> = this.userService.usersWithSubProps$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  selectedUser$ = this.userService.selectedUser$;

  onSelected(userId: number): void {
    console.log(userId);
    this.userService.selectedUserChanged(userId);
  }
}

import { catchError } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';
import { UserService } from './user.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class UserListComponent {
  listFilter: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService) {}

  users$ = this.userService.usersWithSubProps$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  selectedUser$ = this.userService.selectedUser$;

  onSelected(userId: number): void {
    this.userService.selectedUserChanged(userId);
  }
}

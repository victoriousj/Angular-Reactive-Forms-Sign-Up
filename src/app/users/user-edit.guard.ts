import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

import { UserEditComponent } from './user-edit.component';

@Injectable({
  providedIn: 'root',
})
export class UserEditGuard implements CanDeactivate<UserEditComponent> {
  canDeactivate(
    component: UserEditComponent
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (component.userForm.dirty) {
      const userName =
        component.userForm?.get('firstName')?.value || 'New User';
      return confirm(`Navigate away and lose all changes to ${userName}?`);
    }
    return true;
  }
}

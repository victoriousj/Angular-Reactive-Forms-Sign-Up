import { combineLatest } from 'rxjs';
import { UserShellComponent } from './user-shell.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserListComponent } from './user-list.component';
import { UserDetailComponent } from './user-detail.component';
import { UserEditComponent } from './user-edit.component';

@NgModule({
  declarations: [
    UserListComponent,
    UserDetailComponent,
    UserEditComponent,
    UserShellComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule.forChild([
      { path: 'users', component: UserShellComponent },
      { path: 'users/:id', component: UserEditComponent },
    ]),
  ],
})
export class UsersModule {}

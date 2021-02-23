import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <a class="nav-link" routerLinkActive="active" [routerLink]="['/home']">
        <img
          src="../assets/firethief.png"
          class="mr-0 mr-md-2"
          width="30"
          height="30"
          alt="fire theif logo"
        />
        <span class="navbar-brand">{{ title }}</span>
      </a>
      <ul class="navbar-nav">
        <li class="nav-item">
          <a
            class="nav-link"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            [routerLink]="['/users']"
            >User List</a
          >
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            [routerLink]="['/users/0']"
            >Add User</a
          >
        </li>
      </ul>
    </nav>
    <div class="container mt-3">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Angular-Reactive-Forms-Sign-Up';
}

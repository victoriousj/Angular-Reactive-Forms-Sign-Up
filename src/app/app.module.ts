import { AppData } from './app-data';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { UsersModule } from './users/users.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    InMemoryWebApiModule.forRoot(AppData),
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ]),
    UsersModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

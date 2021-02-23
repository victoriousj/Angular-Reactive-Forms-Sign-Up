import { catchError, debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { User } from './user';
import { UserTypeService } from '../user-types/user-type.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnInit {
  pageTitle: string = '';
  errorMessage: string = '';
  userForm: FormGroup = new FormGroup({});
  user: User | undefined;

  userTypes$ = this.userTypeService.userTypes$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  get phoneNumbers(): FormArray {
    return this.userForm.get('phoneNumbers') as FormArray;
  }
  get addresses(): FormArray {
    return this.userForm.get('addresses') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private userService: UserService,
    private userTypeService: UserTypeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      middleInitial: ['', Validators.maxLength(1)],
      lastName: ['', [Validators.required]],
      userTypeId: 1,
      age: '',
      gender: 'Not-Specified',
      email: ['', Validators.email],
      phoneNumbers: this.fb.array([]),
      addresses: this.fb.array([]),
    });

    this.route.paramMap.subscribe((params) => {
      const id = +(params?.get('id') || 0);
      if (id > 0) {
        this.pageTitle = 'Edit User';
        this.setUser(id);
      } else {
        this.pageTitle = 'Add User';
        this.addPhoneNumber();
        this.addAddress();
      }
    });
  }

  setUser(id: number): void {
    this.userService.usersWithSubProps$.subscribe({
      next: (data) => {
        this.user = data.find((user) => user.id === id);
        this.hydrateForm(this.user!);
      },
    });
  }

  hydrateForm(user: User): void {
    const { phoneNumbers, addresses } = user;

    this.userForm.patchValue({
      ...user,
    });

    phoneNumbers?.forEach((phoneNumber) =>
      this.phoneNumbers.push(new FormControl(phoneNumber))
    );

    addresses?.forEach((address) =>
      this.addresses.push(
        this.fb.group({
          ...address,
        })
      )
    );
  }

  addPhoneNumber(): void {
    this.phoneNumbers.push(new FormControl());
  }

  deletePhoneNumber(index: number) {
    this.phoneNumbers.removeAt(index);
    this.phoneNumbers.markAsDirty();
  }

  addAddress(): void {
    this.addresses.push(
      this.fb.group({
        street1: '',
        street2: '',
        city: '',
        state: '',
        zip: '',
      })
    );
  }

  deleteAddress(index: number) {
    this.addresses.removeAt(index);
    this.addresses.markAsDirty();
  }

  saveUser(): void {}
}

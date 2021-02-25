import { AddressService } from './../home/addresses/address.service';
import { CustomValidators } from './../shared/custom.validators';
import { catchError, debounceTime, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { concat, EMPTY, fromEvent, merge } from 'rxjs';
import { UserService } from './user.service';
import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { User } from './user';
import { UserTypeService } from '../user-types/user-type.service';
import { GenericValidator } from '../shared/generic-validator';

@Component({
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[] = [];
  primaryAction: string = '';
  errorMessage: string = '';
  userForm: FormGroup = new FormGroup({});
  user: User | undefined;
  userId: number | undefined;

  private validationMessages: { [key: string]: { [key: string]: string } } = {
    firstName: {
      required: 'First Name is required.',
    },
    middleInitial: {
      maxlength: 'Middle Initial must be one letter.',
    },
    lastName: {
      required: 'Last Name is required.',
    },
    age: {
      required: 'Age is required.',
      isNumber: 'Please enter a valid number.',
    },
    email: {
      required: 'Email is required.',
      email: 'Please enter a valid email address.',
    },
    phoneNumbers: {
      isNumber: 'Please enter a valid number.',
    },
    street1: {
      required: 'Street Information is required',
    },
  };

  private genericValidator: GenericValidator = new GenericValidator(
    this.validationMessages
  );
  displayMessage: { [key: string]: string } = {};

  userTypes$ = this.userTypeService.userTypes$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  constructor(
    private userTypeService: UserTypeService,
    private addressService: AddressService,
    private userService: UserService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      middleInitial: ['', [Validators.maxLength(1)]],
      lastName: ['', [Validators.required]],
      userTypeId: 1,
      age: ['', [Validators.required, CustomValidators.isNumber()]],
      gender: 'Not-Specified',
      email: ['', [Validators.required, Validators.email]],
      phoneNumbers: this.fb.array([]),
      addresses: this.fb.array([]),
    });

    this.route.paramMap.subscribe((params) => {
      const id = +(params?.get('id') || 0);
      this.userId = id;
      if (this.userId > 0) {
        this.primaryAction = 'Save';
        this.setUser(id);
      } else {
        this.primaryAction = 'Add User';
        this.addPhoneNumber();
        this.addAddress();
      }
    });
  }

  ngAfterViewInit(): void {
    const controlBlurs = this.formInputElements.map((formControl: ElementRef) =>
      fromEvent(formControl.nativeElement, 'blur')
    );

    merge(this.userForm.valueChanges, ...controlBlurs)
      .pipe(debounceTime(800))
      .subscribe(() => {
        this.displayMessage = this.genericValidator.processMessages(
          this.userForm
        );
      });
  }

  setUser(id: number): void {
    this.userService.usersWithSubProps$.subscribe((data) => {
      this.user = data.find((user) => user.id === id);
      this.patchForm(this.user!);
    });
  }

  patchForm(user: User): void {
    user.phoneNumbers?.forEach((phoneNumber) =>
      this.phoneNumbers.push(this.fb.control(phoneNumber))
    );

    user.addresses?.forEach((address) =>
      this.addresses.push(
        this.fb.group({
          ...address,
        })
      )
    );

    this.userForm.patchValue({
      ...user,
    });
  }

  //#region Phone Numbers
  get phoneNumbers(): FormArray {
    return this.userForm.get('phoneNumbers') as FormArray;
  }

  addPhoneNumber(): void {
    this.phoneNumbers.push(new FormControl());
  }
  //#endregion

  //#region  Addresses
  deletePhoneNumber(index: number) {
    this.phoneNumbers.removeAt(index);
    this.phoneNumbers.markAsDirty();
  }

  get addresses(): FormArray {
    return this.userForm.get('addresses') as FormArray;
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

  //#endregion

  saveUser(): void {
    if (!this.userForm.valid) {
      this.displayMessage = this.genericValidator.processMessages(
        this.userForm,
        true
      );
    } else if (!this.userForm.dirty) {
      this.errorMessage = 'No changes have been made.';
    } else {
      const user = { ...this.user, ...this.userForm.value } as User;
      if (user.id && user.id > 0) {
        this.updateUser(user);
      } else {
        this.createUser(user);
      }
    }
  }

  deleteUser(): void {
    if (confirm(`Are you sure you want to delete this user?`)) {
      this.userService.deleteUser(this.userId!).subscribe({
        next: () => this.onSaveComplete(),
        error: (err: string) => (this.errorMessage = err),
      });
    }
  }

  updateUser(user: User): void {
    user.addressIds = [];
    const existingAddresses = user.addresses?.filter((address) => address.id);
    const updatedAddresses = existingAddresses?.map((address) =>
      this.addressService.updateAddress(address).pipe(
        tap((updatedAddress) => {
          user.addressIds.push(updatedAddress.id!);
        })
      )
    );

    const newAddresses = user.addresses?.filter((address) => !address.id);
    const createdAddresses = newAddresses?.map((address) =>
      this.addressService
        .createAddress(address)
        .pipe(tap((createdAddress) => user.addressIds.push(createdAddress.id!)))
    );

    concat(
      ...updatedAddresses!,
      ...createdAddresses!,
      this.userService.updateUser(user)
    ).subscribe(() => this.onSaveComplete());
  }

  createUser(user: User): void {
    user.addressIds = [];
    const newAddresses = user.addresses?.map((address) =>
      this.addressService
        .createAddress(address)
        .pipe(tap((newAddress) => user.addressIds.push(newAddress.id!)))
    );

    concat(...newAddresses!, this.userService.createUser(user)).subscribe(() =>
      this.onSaveComplete()
    );
  }

  onSaveComplete(): void {
    this.userForm.reset();
    this.router.navigate(['/users']);
  }
}

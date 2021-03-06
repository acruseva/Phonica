import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { MessageService } from '@core/services/message.service';
import { UserService } from '@core/services/user.service';
import { Role, User } from '@core/types/user.interface';
import { Subscription, Observable } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
@Component({
  selector: 'app-user-edit-create-form',
  templateUrl: './user-edit-create-form.component.html',
  styleUrls: ['./user-edit-create-form.component.scss']
})
export class UserEditCreateFormComponent implements OnInit, OnChanges {
  @Input() mode = 'details';
  @Input() user: User;
  @Output() userChange = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  title = 'Register as New User';

  userForm: FormGroup;
  isNewUser = true; // new user by default
  isAdmin = false;
  isCanceled = false;
  errorMessage: string;
  private subscription: Subscription;

  roles: { key: Role, value: string }[] = [];
 

  formErrors = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    avatar: ''
  };

  validationMessages = {
    username: {
      'required': 'Username is required.',
      'pattern': 'Username can contain only letters, digits, and underscore.',
      'minlength': 'Username must be at least 3 characters long.',
      'maxlength': 'Username cannot be more than 24 characters long.'
    },
    firstName: {
      'required': 'First name is required.',
      'minlength': 'Name must be at least 2 characters long.',
      'maxlength': 'Name cannot be more than 24 characters long.'
    },
    lastName: {
      'required': 'Last name is required.',
      'minlength': 'Name must be at least 2 characters long.',
      'maxlength': 'Name cannot be more than 24 characters long.'
    },
    email: {
      'required': 'Email is required.',
      'email': 'Please enter a valid email.',
    },
    password: {
      'required': 'Password is required.',
      'pattern': 'Password should be between 8 and 20 characters, and should conatain at least one letter and one number.'
    },
    role: {
      'required': 'Password is required.'
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    for (const role in Role) {
      if (typeof Role[role] === 'number') {
        this.roles.push({ key: +Role[role], value: role });
      }
    }    
  }

  ngOnInit() {
     this.route.params.pipe(
      filter(params => params['userId']),
      switchMap(params => this.userService.findById(params['userId'])),
      tap(user => console.log(user))
     ).subscribe(
       user => {
         this.user = user;
        this.isNewUser = false;
         this.resetUser();
     },
      err => this.messageService.error(err.error.message)
     );

    this.route.data
    .subscribe(
      (data: {title?: string, mode?: string }) => {
        this.title = data.title || this.title;
        this.mode = data.mode || this.mode;
      },
      err => this.messageService.error(err.error.message)
    );

    
    this.isAdmin = this.authService.currentUserFromStorage && this.authService.currentUserFromStorage.user.role === Role.ADMIN;
      

    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.user && changes.user.currentValue !== changes.user.previousValue) {
      this.resetUser();
    }
  }

  buildForm(): void {
    this.userForm = this.fb.group({
      id: {value: this.user?.id, disabled: true},
      username: [
        this.user?.username,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(24),
          Validators.pattern(/^\w{3,24}$/)
        ]
      ],
      email: [
        this.user?.email,
        [
          Validators.required,
          Validators.email
        ]
      ],
      password: [
        this.user?.password,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#?????*?&]{6,20}$/)
        ]
      ],
      firstName: [
        this.user?.firstName,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(24)
        ]
      ],
      lastName: [
        this.user?.lastName,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20)
        ]
      ],      
      role: [this.user?.role || Role.CUSTOMER, [
        Validators.required
      ]],
      avatar: [this.user?.avatar],
    });
    this.userForm.statusChanges.subscribe( () => this.onStatusChanged() );
  }

  resetUser() {
    if (this.userForm) {
      this.userForm.reset(this.user);
    }
  }

  submitUser() {
    this.user = this.userForm.getRawValue();
    this.userChange.emit(this.user);
    if (this.isNewUser) {
      if (this.mode === 'register') {
        this.authService.register(this.user).subscribe(
          u => {
            this.messageService.success(`Successfully registered user: ${u.username}`);
            this.router.navigate(['/login']);
          },
          err => this.messageService.error(err.error.message)
        );
      } else {
        this.userService.create(this.user).subscribe(
          u => {
            this.messageService.success(`Successfully added user: ${u.username}`);
            this.router.navigate(['/users'], {queryParams: {refresh: true}});
          },
          err => this.messageService.error(err.error.message)
        );
      }
    } else {
      this.userService.update(this.user).subscribe(
        u => {
          this.messageService.success(`Successfully updated user: ${u.username}`);
          this.router.navigate(['/users'], {queryParams: {refresh: true}});
        },
        err => this.messageService.error(err.error.message)
      );
    }
    // this.goBack();
  }

  private onStatusChanged(data?: any) {
    if (!this.userForm) { return; }
    const form = this.userForm;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && (control.dirty || control.touched) && control.invalid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  cancelUser() {
    this.isCanceled = true;
    this.cancel.emit();
    this.router.navigate(['/users']);
  }

  getAvatar() {
    return this.userForm.value.avatar;    
  }

  getRoleName(role: Role) {
    return Role[role];
  }

  handleUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.userForm.patchValue({
        avatar: reader.result
      });
    };
  }
}

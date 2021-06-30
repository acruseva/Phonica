import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { MessageService } from '@core/services/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = this.formBuilder.group({
    username: ['', { validators: Validators.required }],
    password: ['', { validators: Validators.required }]
  }, { updateOn: 'submit' });

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private messageService: MessageService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return false;
    }
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(() => {
      this.router.navigate(['/products']);
    },
    err => this.messageService.error('Invalid user credentials. Try again.')
    );
    return true;
  }

}

import { Component } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  pass1: string | undefined;
  pass2: string | undefined;

  signup() {
    console.log('First Name:', this.firstName);
    console.log('Last Name:', this.lastName);
    console.log('Email:', this.email);
    console.log('Password 1:', this.pass1);
    console.log('Password 2:', this.pass2);
  }
}

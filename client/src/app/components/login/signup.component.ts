import { Component } from '@angular/core';
import axios from 'axios';

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
    const data = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.pass1
    };

    if (this.pass1 !== this.pass2) {
      alert('Passwords do not match');
    } else {
      axios.post('http://localhost:5001/auth/register', data)
        .then(res => {
          document.cookie = `userToken=${res.data.userToken}`;
          document.cookie = `userId=${res.data.uuid}`;
        })
        .catch(err => {
          alert('Signup failed');
        });
    }
  }
}

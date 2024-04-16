import { Component } from '@angular/core';
import axios from 'axios';
import { storeData } from '../../storage/util';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}


  async signup() {
    const data = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.pass1
    };

    if (this.pass1 !== this.pass2) {
      alert('Passwords do not match');
    } else {

      try {
        const result = await axios.post('http://localhost:5001/auth/register', data);

        if (result.status == 200) {

          console.log(result.data);

          await storeData('userToken', result.data.userToken);
          await storeData('userID', result.data.uuid);

          this.router.navigate(['/app']);
        } else {
          alert('Signup failed');
        }
      } catch (err) {
        console.error('Error during signup:', err);
        alert('Signup failed');
      }
    }
  }
}

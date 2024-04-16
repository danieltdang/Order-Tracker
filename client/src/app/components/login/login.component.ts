import { Component } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';
import { storeData } from '../../storage/util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string | undefined;
  password: string | undefined;

  constructor(private router: Router) {}

  async login() {
    const data = {
      email: this.email,
      password: this.password
    };
  
    try {
      const result = await axios.post('http://localhost:5001/auth/login', data);

      if (result.status == 200) {
        await storeData('userToken', result.data.userToken);
        await storeData('userID', result.data.uuid);

        this.router.navigate(['/app']);
      } else {
        alert('Login failed');
      }
    } catch (err) {
      console.error('Error during login:', err);
      alert('Login failed');}
  }
}

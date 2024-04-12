import { Component } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string | undefined;
  password: string | undefined;

  constructor(private router: Router) {}

  login() {
    const data = {
      email: this.email,
      password: this.password
    };
  
    axios.post('http://localhost:5001/auth/login', data)
      .then(res => {
        if (res.status === 200) {
          document.cookie = `userToken=${res.data.userToken}; path=/`;
          document.cookie = `userId=${res.data.uuid}; path=/`;
          } else {
          console.log('Login not successful:', res.status);
          alert('Login failed with status: ' + res.status);
        }
      })
      .catch(err => {
        console.error('Error during login:', err);
        alert('Login failed with error: ' + err.message);
      });
  }
}

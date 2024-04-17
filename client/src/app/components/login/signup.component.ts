import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

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

  constructor(private router: Router, private apiService: ApiService, private authService: AuthService) {}


  async signup() {

    if (this.firstName && this.lastName && this.email && this.pass1 && this.pass2 && this.pass1 === this.pass2) {
      try {
        const result = await this.apiService.registerUser(this.firstName, this.lastName, this.email, this.pass1)

        if (result.status == 200) {

          this.authService.setToken(result.data.userToken);
          this.authService.setUUID(result.data.uuid);
          
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

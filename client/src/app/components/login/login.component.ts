import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string | undefined;
  password: string | undefined;
  loginFailed: boolean = false;

  constructor(private router: Router, private apiService: ApiService, private authService: AuthService) {}

  async login() {
    if (this.email && this.password){
      try {
        const result = await this.apiService.loginUser(this.email, this.password);

        if (result.status == 200) {
          this.authService.setToken(result.data.userToken);
          this.authService.setUUID(result.data.uuid);

          this.router.navigate(['/app']);
        } else {
          this.loginFailed = true;
        }
      } 
      catch (err) {
        //console.error('Error during login:', err);
        this.loginFailed = true;
      }
    }
  }
}

import { Injectable }   from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const isAuthenticated = this.authService.isAuthenticated();
        const userRole = this.authService.getRole();
        console.log("Authentication status:", isAuthenticated);
        console.log("User Role:", userRole)
        if (!isAuthenticated) {
            this.router.navigate(['/']);
            return false;
        }
        if(userRole ==  'base_user' && state.url.includes('email-hub')) {
            this.router.navigate(['/dashboard'])
            return false;
        }
        return true;
    }
}
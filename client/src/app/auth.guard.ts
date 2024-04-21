import { Injectable, inject }   from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PermissionsService {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        //console.log('Checking if user is authenticated');
        return this.authService.isAuthenticated().pipe(
            map(isAuthenticated => {
                if (!isAuthenticated) {
                    this.router.navigate(['/']);
                    return false;
                }
                return true;
            }),
            catchError(() => {
                this.router.navigate(['/']);
                return of(false);
            })
        );
    }
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
    const permissionsService = inject(PermissionsService);
    return permissionsService.canActivate(next, state);
};
import { Injectable, afterRender } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable, map, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private userToken: string | null = null;
    private uuid: string | null = null;
    private role: string | null = null;
    private permissions: boolean | null = null;

    constructor (private storage: StorageMap) {
        this.storage.get('userToken').subscribe((userToken) => {
            this.userToken = userToken as string;
        });

        this.storage.get('uuid').subscribe((uuid) => {
            this.uuid = uuid as string;
        });
    }

    // Set User Token
    public setToken(token: string): void {
        this.userToken = token;
        this.storage.set('userToken', token).subscribe(() => {});
    }

    // Get User Token
    public getToken(): string | null {
        if (this.userToken === null) {
            this.storage.get('userToken').subscribe((userToken) => {
                this.userToken = userToken as string;
            });
        }

        return this.userToken;
    }

    // Set UUID
    public setUUID(uuid: string): void {
        this.uuid = uuid;
        this.storage.set('uuid', uuid).subscribe(() => {});
    }

    // Get UUID
    public getUUID(): string | null {
        if (this.uuid === null) {
            this.storage.get('uuid').subscribe((uuid) => {
                this.uuid = uuid as string;
            });
        }

        return this.uuid;
    }

    // Set User Role
    public setRole(role: string): void {
        this.role = role;
        localStorage.setItem('userRole', role);
    }

    // Get User Role
     public getRole(): string | null {
        if (!this.role) {
        this.role = localStorage.getItem('userRole');
        }
        return this.role;
    }

    //Set User Email Permission
    public setPermission(permissions: boolean | null): void {
        this.permissions = permissions;
        //localStorage.setItem('userPermission', this.permissions !== null ? this.permissions.toString() : '');
    }

    //Get User Email Permission
    public getPermission(): boolean | null {
        if (this.permissions === null) {
            const storedPermission = localStorage.getItem('userPermission');
            if (storedPermission !== null) {
                this.permissions = storedPermission === 'true';
            }
        }
        return this.permissions;
    }

    // Check if user is authed
    public isAuthenticated(): Observable<boolean> {
        if (this.userToken !== null) {
            return of(true);
        } else {
            return this.storage.get('userToken').pipe(
                map(token => {
                    this.userToken = token as string;
                    return !!this.userToken;
                })
            );
        }
    }

    // Clear data
    public logout(): void {
        this.userToken = null;
        this.uuid = null;
        this.storage.delete('userToken').subscribe(() => {});
        this.storage.delete('uuid').subscribe(() => {});
    }
}
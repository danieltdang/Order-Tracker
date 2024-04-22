import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private userToken: string | null = null;
    private uuid: string | null = null;
    private role: string | null = null;
    private permissions: boolean | null = null;

    constructor () {}

    // Set User Token
    public setToken(token: string): void {
        this.userToken = token;
        localStorage.setItem('userToken', token);
    }

    // Get User Token
    public getToken(): string | null {
        if (!this.userToken && typeof window !== 'undefined' && window.localStorage) {
            this.userToken = localStorage.getItem('userToken');
        }
        return this.userToken;
    }

    // Set UUID
    public setUUID(uuid: string): void {
        this.uuid = uuid;
        localStorage.setItem('uuid', uuid);
    }

    // Get UUID
    public getUUID(): string | null {
        if (!this.uuid) {
            this.uuid = localStorage.getItem('uuid');
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
    public isAuthenticated(): boolean {
        return this.getToken() !== null;
    }

    // Clear data
    public logout(): void {
        this.userToken = null;
        this.uuid = null;
        localStorage.removeItem('userToken');
        localStorage.removeItem('uuid');
    }
}
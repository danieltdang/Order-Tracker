import { Injectable, afterRender } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private userToken: string | null = null;
    private uuid: string | null = null;

    constructor (private storage: StorageMap) {
        this.storage.get('userToken').subscribe((userToken) => {
            this.userToken = userToken as string;
            console.log("token", this.userToken);
        });

        this.storage.get('uuid').subscribe((uuid) => {
            this.uuid = uuid as string;
            console.log("uuid", this.uuid);
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

    // Check if user is authed
    public isAuthenticated(): boolean {
        console.log("token", this.userToken);
        return this.getToken() !== null;
    }

    // Clear data
    public logout(): void {
        this.userToken = null;
        this.uuid = null;
        this.storage.delete('userToken').subscribe(() => {});
        this.storage.delete('uuid').subscribe(() => {});
    }
}
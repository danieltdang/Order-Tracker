import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  isPremium: boolean = false;

  constructor() { }

  updatePremiumStatus(): void {
    this.isPremium = !this.isPremium;   
  }

  verifyPremium(): void {
    
  }

  getPremiumStatus(): boolean {
    return this.isPremium;
  }
}

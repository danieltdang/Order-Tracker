import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private isPremiumSubject = new BehaviorSubject<boolean>(false);

  constructor(private apiService: ApiService) {
    this.initializePremium();
  }

  private async initializePremium() {
    const result = await this.apiService.getPremium();
    if (result.status === 200) {
      this.isPremiumSubject.next(result.data);
      //console.log("initPrem:", result.data);
    }
  }

  get isPremium() {
    return this.isPremiumSubject.asObservable();
  }

  async updatePremiumStatus(): Promise<void> {
    const newStatus = this.isPremiumSubject.value;
    const response = await this.apiService.updatePremium(newStatus);
    if (response.status === 200) {
      this.isPremiumSubject.next(response.data);
      //console.log("updatedPrem:", response.data);
    }
  }

  async getPremiumStatus(): Promise<void> {
    const response = await this.apiService.getPremium();
    if (response.status === 200) {
      this.isPremiumSubject.next(response.data);
    }
    return response.data;
  }
}
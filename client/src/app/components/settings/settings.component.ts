import { Component } from '@angular/core';
import { Theme } from "../../interfaces/theme";
import { ThemeService } from '../../services/theme-service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'
import { ApiService } from '../../services/api.service';

import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  providers: [ConfirmationService, MessageService]
})
export class SettingsComponent {
  themes: Theme[] | undefined;
  selectedTheme: Theme | undefined;

  currPass: string = '';
  confirmPass1: string = '';
  confirmPass2: string = '';
  incorrectPass: boolean = false;
  submitted: boolean = false;

  isPremium: boolean = false;

  userName!: string;
  userEmail!: string;

  constructor(private themeService: ThemeService, private confirmationService: ConfirmationService, private messageService: MessageService,
              private router: Router, private authService: AuthService, private apiService: ApiService, private roleService: RoleService) { }

  changeTheme() {
    if (this.selectedTheme) {
      this.themeService.switchTheme(this.selectedTheme.name);
      this.themeService.setTheme(this.selectedTheme);
    }    
  }

  async updatePremium() {
    this.roleService.updatePremiumStatus();
    const result = await this.apiService.getPremium();
    console.log("res", result)
    if (result.status === 200) {
      this.isPremium = result.data;
    }
  }

  async passwordConfirm(event: Event) {
    this.submitted = true;
    console.log(this.currPass, this.confirmPass1, this.confirmPass2)
    if (this.currPass !== "" && this.confirmPass1 !== "" && this.confirmPass2 !== "" && this.confirmPass1 === this.confirmPass2) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Are you sure you want to change your password?',
        header: 'Change Password Confirmation',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass:"p-button-danger p-button-text",
        rejectButtonStyleClass:"p-button-text p-button-text",
        acceptIcon:"none",
        rejectIcon:"none",

        accept: async () => {
          try {
            const result = await this.apiService.changePassword(this.currPass, this.confirmPass1);

            if (result.status == 200) {
              this.incorrectPass = false;
              this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Password changed' });
            }
          } catch (err) {
            this.incorrectPass = true;
          }
        }
      });
    }
  }

  async deleteConfirm(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Are you sure you want to delete this account?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass:"p-button-danger p-button-text",
        rejectButtonStyleClass:"p-button-text p-button-text",
        acceptIcon:"none",
        rejectIcon:"none",

        accept: async () => {
       
        try {
          const result = await this.apiService.deleteUser();
          console.log(result);

          if (result.status == 200) {
            this.authService.logout();
            this.router.navigate(['/']);
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Account deleted' });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Account deletion failed', life: 3000 });
          }
        }
        catch (err) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Account deletion failed', life: 3000 });
        }        },
        reject: () => {
          //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
        }
    });
  }

  async updateUser() {
    this.userName = await this.apiService.getName();
    this.userEmail = await this.apiService.getEmail();
  }

  async ngOnInit(): Promise<void> {
    const result = await this.apiService.getPremium();
    if (result.status === 200) {
      this.isPremium = result.data;
    }
    this.updateUser();

    this.themes = this.themeService.getThemes();
    this.selectedTheme = this.themeService.getTheme();
  }
}

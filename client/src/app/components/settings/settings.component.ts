import { Component } from '@angular/core';
import { Theme } from "./theme";
import { ThemeService } from '../../theme-service';
import axios from 'axios';
import { getData, clearData } from '../../storage/util';
import { Router } from '@angular/router';


import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { get } from 'http';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  providers: [ConfirmationService, MessageService]
})
export class SettingsComponent {
  themes: Theme[] | undefined;
  selectedTheme: Theme | undefined;

  currPass: string | undefined;
  confirmPass1: string | undefined;
  confirmPass2: string | undefined;

  constructor(private themeService: ThemeService, private confirmationService: ConfirmationService, private messageService: MessageService, private router: Router) { }

  changeTheme() {
    if (this.selectedTheme) {
      this.themeService.switchTheme(this.selectedTheme.name);
    }
  }

  async passwordConfirm(event: Event) {
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
        const userToken = await getData('userToken');
        const userID = await getData('userID');

        let headers = {
          'Authorization': userToken
        }

        let payload = {
          "uuid": userID,
          "oldPassword": this.currPass,
          "newPassword": this.confirmPass1
        }

        if (this.confirmPass1 !== this.confirmPass2) {
          alert('Passwords do not match');
        } else {
          try {
            const result = await axios.post("http://localhost:5001/auth/change-password", payload, { headers: headers });

            if (result.status == 200) {
              this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Password changed' });
            } else {
              alert('Password change failed');
            }
          }
          catch (err) {
            console.error('Error during password change:', err);
            alert('Password change failed');
          }
        }
      }
    });
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
          const userToken = await getData('userToken');
          const userID = await getData('userID');

          let headers = {
            'Authorization': userToken
          }

        try {
          const result = await axios.delete('http://localhost:5001/api/users/' + userID, { headers: headers });

          if (result.status == 200) {
            await clearData();
            this.router.navigate(['/']);
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Account deleted' });
          } else {
            alert('Account deletion failed');
          }
        }
        catch (err) {
          console.error('Error during account deletion:', err);
          alert('Account deletion failed');
        }        },
        reject: () => {
          //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
        }
    });
}

  ngOnInit() {
    this.themes = [
      { name: 'lara-dark-blue', displayName: 'Dark Theme' },
      { name: 'lara-light-blue', displayName: 'Light Theme' },
    ];

    this.selectedTheme = this.themes[0];
  }
}

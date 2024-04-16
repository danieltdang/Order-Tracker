import { Component } from '@angular/core';
import { Theme } from "./theme";
import { ThemeService } from '../../theme-service';
import axios from 'axios';


import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';

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

  constructor(private themeService: ThemeService, private confirmationService: ConfirmationService, private messageService: MessageService) { }

  changeTheme() {
    if (this.selectedTheme) {
      this.themeService.switchTheme(this.selectedTheme.name);
    }
  }

  confirm(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Are you sure you want to delete this account?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass:"p-button-danger p-button-text",
        rejectButtonStyleClass:"p-button-text p-button-text",
        acceptIcon:"none",
        rejectIcon:"none",

        accept: () => {
          let headers = {
            'Authoriiization': 'Bearer ' + localStorage.getItem("token"),
          }

          axios.delete('https://localhost:5001/users/' + localStorage.getItem("userId"), { headers: headers })
            .then((response) => {
              console.log(response);
              localStorage.clear();
              window.location.href = "/login";
            })
            .catch((error) => {
              console.log(error);
            });

          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Account deleted' });
        },
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

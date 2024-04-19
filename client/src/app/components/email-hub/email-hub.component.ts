import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Email } from '../../interfaces/email';
import { PackageStatusService } from '../../services/package-status.service';

@Component({
  selector: 'app-email-hub',
  templateUrl: './email-hub.component.html',
  styleUrl: './email-hub.component.css',
  providers: [MessageService, ConfirmationService]
})
export class EmailHubComponent {
  email!: Email;
  emails!: Email[];
  selectedEmails!: Email[] | null;
  dateReceived!: Date;
  statuses!: any[];
  submitted: boolean = false;
  emailDialog: boolean = false;

  constructor(private apiService: ApiService, private router: Router, private statusService: PackageStatusService,
              private confirmationService: ConfirmationService, private messageService: MessageService
  ) {}

  async ngOnInit(): Promise<void> {
    const result = await this.apiService.getUserEmails()
    if (result.status === 200) {
        this.emails = result.data.data;
        console.log(this.emails);
    } else {
      
    }
    

    this.statuses = [
      { label: 'Pre Transit', value: 0 },
      { label: 'In Transit', value: 1 },
      { label: 'Delivered', value: 2 },
      { label: 'Returned', value: 3 }
    ];
  }

  goToOrder(orderID: string) {
    this.router.navigate(['app/packages', orderID]);
  }

  onRowSelect(event: any) {
    //this.router.navigate(['app/packages', event.data.orderID]);
    console.log(event.data.emailID);
  }

  getStatus(status: number) {
    return this.statusService.getStatus(status);
  }

  formatDate(date: string) {
    return this.statusService.formatDate(date);
  }

  clear(table: Table) {
    this.selectedEmails = null;
    table.clear();
  }

  openNew() {
    this.email = {
      subject: '',
      status: '',
      order: '',
      emailID: '',
      content: '',
      source: '',
      datereceived: '',
    };
    this.dateReceived = new Date();
    this.submitted = false;
    this.emailDialog = true;
  }

  editEmail(email: Email) {
    this.email = { ...email };
    this.dateReceived = new Date(email.datereceived);
    this.emailDialog = true;
  }

  async deleteEmail(email: Email) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + email.emailID + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
            const result = await this.apiService.deleteOrderEmail(email.emailID);

            if (result.status === 200) {
              this.emails = this.emails.filter((val: any) => val.id !== email.emailID);
              this.email = {
                subject: '',
                status: '',
                order: '',
                emailID: '',
                content: '',
                source: '',
                datereceived: '',
              };
            }
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Email Deleted', life: 3000 });
        }
    });
  }

  hideDialog() {
    this.emailDialog = false;
    this.submitted = false;
  }

  formatDateToString(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is zero-indexed in JavaScript, so add 1
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.emails.length; i++) {
        if (this.emails[i].emailID === id) {
            index = i;
            break;
        }
    }

    return index;
  }
  
  async saveEmail() {
    this.submitted = true;

    if (this.email.subject?.trim()) {
      this.email.datereceived = this.formatDateToString(this.dateReceived);

      if (this.email.emailID) {

        const result = await this.apiService.updateOrderEmail(this.email);

        if (result.status === 200) {
          this.emails[this.findIndexById(this.email.emailID)] = this.email;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Email Updated', life: 3000 });
        } else if (result.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Email Not Updated', life: 3000 });
        }
      } else {

        const result = await this.apiService.createOrderEmail(this.email);
        console.log(result);
        if (result.status === 200) {
          this.emails.push(this.email);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Email Created', life: 3000 });
        } else if (result.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Email Not Created', life: 3000 });
        }
      }

      this.emails = [...this.emails];
      this.emailDialog = false;
      this.email = {
        subject: '',
        status: '',
        order: '',
        emailID: '',
        content: '',
        source: '',
        datereceived: '',
      };
    }
  }
}

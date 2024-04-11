import { Component } from '@angular/core';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.css'
})
export class ForgotComponent {
  value: string | undefined;

  forgot() {
    console.log('Recovery:', this.value);
  }
}

import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { UiService } from './ui.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @ViewChild('sidebar', {static: false}) sidebarElement!: ElementRef;

  constructor(protected uiService: UiService) {}

  sidebarVisible: boolean = true;
  modalVisible: boolean = false;
}

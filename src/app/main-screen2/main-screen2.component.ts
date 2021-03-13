import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-main-screen2',
  templateUrl: './main-screen2.component.html',
  styleUrls: ['./main-screen2.component.scss']
})
export class MainScreen2Component implements OnInit {
  @ViewChild('drawer') public sidenav: MatSidenav;

  constructor() { }

  ngOnInit(): void {
  }

  draweropen() {
  }
  drawerclose() {
    this.sidenav.close();
  }
}

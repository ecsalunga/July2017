import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Core } from './core';
import { DataAccess } from './data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('viewChild', {read: ViewContainerRef})
  viewChild: ViewContainerRef;

  constructor(public core: Core, private DA: DataAccess) { }

  loadTester(name: string) {
    this.core.loadComponent(name);
  }

  ngOnInit() {
    this.core.viewChild = this.viewChild;
    this.DA.LoadData();
  }
}

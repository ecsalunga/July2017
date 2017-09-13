import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Core } from './core';
import { DataAccess, DataLayer } from './data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('viewChild', {read: ViewContainerRef})
  viewChild: ViewContainerRef;
  show: string = "100%";
  hide: string = "0%"
  navWidth: string = "0%";
  loader: string = "100%";

  constructor(public core: Core, private DA: DataAccess, private DL: DataLayer) {}

  LoadPage(name: string) {
    this.DL.LoadFromMenu(name);
  }

  LoadFromHeader(name: string) {
    this.navWidth = this.hide;
    this.LoadPage(name)
  }

  ToggleNav() {
    this.navWidth = (this.navWidth == this.show) ? this.hide : this.show;
  }

  ngOnInit() {
    this.core.viewChild = this.viewChild;
    this.DA.DataLoad();
    this.DL.LoadFromMenu("dashboard-home");
    this.DA.DataLoaded.subscribe(data => {
      this.loader =  this.hide;
    });
  }
}
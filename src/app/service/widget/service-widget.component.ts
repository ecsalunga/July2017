import { Component, OnInit } from '@angular/core';
import { DataLayer, DataAccess } from '../../data';
import { ServiceInfo } from '../../data/models';

@Component({
  selector: 'service-widget',
  templateUrl: './service-widget.component.html',
  styleUrls: ['./service-widget.component.css']
})
export class ServiceWidgetComponent implements OnInit {
 
  constructor(public DL: DataLayer, private DA: DataAccess) { }

  Book(item: ServiceInfo) {
    this.DL.Service = item;
    this.DL.LoadFromLink("service-reserve");
  }

  ngOnInit() {
  }
}

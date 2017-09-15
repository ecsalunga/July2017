import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataLayer } from '../../data';
import { ServiceInfo } from '../../data/models';

@Component({
  selector: 'service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {

  constructor(private core: Core, private DL: DataLayer) { }
  
    SelectItem(item: ServiceInfo) {
      this.DL.Service = item;
      this.LoadDetail();
    }
  
    AddItem() {
      this.DL.Service = null;
      this.LoadDetail();
    }

    LoadDetail() {
      this.DL.LoadFromLink("service-detail");
    }
  
    ngOnInit() { 
      this.DL.TITLE = "Service List";
    }
}

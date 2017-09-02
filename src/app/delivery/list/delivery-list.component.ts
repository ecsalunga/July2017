import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataLayer } from '../../data';
import { DeliveryInfo } from '../../models';

@Component({
  selector: 'delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.css']
})
export class DeliveryListComponent implements OnInit {
  constructor(private core: Core, private DL: DataLayer) {}
  
  Select(item: DeliveryInfo) {
    this.DL.Delivery = item;
    this.DL.LoadFromLink("delivery-detail");
  }

  ngOnInit() { 
    this.DL.TITLE = "Delivery List";
  }
}
import { Component, OnInit } from '@angular/core';
import { DataLayer } from '../../data';
import { Access } from '../../models';

@Component({
  selector: 'access-list',
  templateUrl: './access-list.component.html',
  styleUrls: ['./access-list.component.css']
})
export class AccessListComponent implements OnInit {

  constructor(private DL: DataLayer) { }

  SelectItem(item: Access) {
    this.DL.Access = item;
    this.DL.LoadFromLink("access-detail");
  }

  AddItem(){
    this.DL.Access = null;
    this.DL.LoadFromLink("access-detail");
  }

  ngOnInit() { 
    this.DL.TITLE = "Access List";
  }
}
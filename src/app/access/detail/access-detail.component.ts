import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { Access } from '../../models';

@Component({
  selector: 'access-detail',
  templateUrl: './access-detail.component.html',
  styleUrls: ['./access-detail.component.css']
})
export class AccessDetailComponent implements OnInit {
  model: Access;
  
  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer) {
    if (this.DL.Access)
      this.model = Object.assign({}, this.DL.Access);
    else
      this.model = new Access();
  }

  Save() {
    this.DA.AccessSave(this.model);
    this.LoadList();
  }

  LoadList() {
    this.DL.LoadFromLink("access-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Access Details";
  }
}

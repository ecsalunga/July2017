import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { AccessInfo } from '../../data/models';

@Component({
  selector: 'access-detail',
  templateUrl: './access-detail.component.html',
  styleUrls: ['./access-detail.component.css']
})
export class AccessDetailComponent implements OnInit {
  model: AccessInfo;
  
  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    if (this.DL.Access)
      this.model = Object.assign({}, this.DL.Access);
    else
      this.model = new AccessInfo();
  }

  IsSaveDisabled() : boolean {
    return (!this.DL.UserAccess.AccessEdit && !(!this.model.key)) || (!this.DL.UserAccess.AccessAdd && !this.model.key);
  }

  Save() {
    this.DA.AccessSave(this.model);
    this.LoadList();
    this.DL.Display("Access Details", "Saved!");
  }

  LoadList() {
    this.DL.LoadFromLink("access-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Access Details";
  }
}

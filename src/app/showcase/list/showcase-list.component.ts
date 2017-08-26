import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataLayer } from '../../data';
import { ShowcaseInfo } from '../../models';

@Component({
  selector: 'showcase-list',
  templateUrl: './showcase-list.component.html',
  styleUrls: ['./showcase-list.component.css']
})
export class ShowcaseListComponent implements OnInit {

  constructor(private core: Core, private DL: DataLayer) {}

  SelectShowcase(showcase: ShowcaseInfo) {
    this.DL.Showcase = showcase;
    this.DL.LoadFromLink("showcase-detail");
  }

  AddItem() {
    this.DL.Showcase = null;
    this.DL.LoadFromLink("showcase-detail");
  }

  ngOnInit() {
    this.DL.TITLE = "Showcase List";
  }
}

import { Component, OnInit } from '@angular/core';
import { DataLayer, DataAccess } from '../../data';

@Component({
  selector: 'showcase-widget',
  templateUrl: './showcase-widget.component.html',
  styleUrls: ['./showcase-widget.component.css']
})
export class ShowcaseWidgetComponent implements OnInit {

  constructor(private DL: DataLayer, private DA: DataAccess) { }

  ngOnInit() {
    
  }
}

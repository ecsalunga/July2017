import { Component, OnInit } from '@angular/core';
import { DataLayer } from '../data';

@Component({
  selector: 'app-tester',
  templateUrl: './tester.component.html',
  styleUrls: ['./tester.component.css']
})
export class TesterComponent implements OnInit {

  constructor(public DL: DataLayer) 
  {

  }

  ngOnInit() {
  }

}

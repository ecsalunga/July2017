import { Component, OnInit } from '@angular/core';
import { Data } from '../data';

@Component({
  selector: 'app-tester',
  templateUrl: './tester.component.html',
  styleUrls: ['./tester.component.css']
})
export class TesterComponent implements OnInit {

  constructor(public data: Data) 
  {

  }

  ngOnInit() {
  }

}

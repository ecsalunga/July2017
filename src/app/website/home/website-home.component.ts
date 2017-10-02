import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataLayer, DataAccess } from '../../data';
import { Core } from '../../core';

@Component({
  selector: 'website-home',
  templateUrl: './website-home.component.html',
  styleUrls: ['./website-home.component.css']
})
export class WebsiteHomeComponent implements OnInit {
  @ViewChild('Content') dataContent: ElementRef;

  constructor(private core: Core, public DL: DataLayer, private DA: DataAccess) {
    this.DL.Articles.forEach(item => {
      if(item.key == this.DL.ModuleSetting.HomeArticleKey)
        this.DL.Article = item;
    });
  }
  
  LoadList() {
    this.DL.LoadFromLink("website-article");
  }

  GetDate(actionDate: number): Date {
    return this.core.numberToDate(actionDate);
  }

  ngOnInit() {
    this.DL.TITLE = this.DL.ModuleSetting.HomeTitle;
    this.dataContent.nativeElement.innerHTML = this.DL.Article.Content;
  }
}

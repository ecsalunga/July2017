import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataLayer, DataAccess } from '../../data';
import { ArticleInfo } from '../../data/models';
import { Core } from '../../core';

@Component({
  selector: 'website-article-full',
  templateUrl: './website-article-full.component.html',
  styleUrls: ['./website-article-full.component.css']
})
export class WebsiteArticleFullComponent implements OnInit {
  @ViewChild('Content') dataContent: ElementRef;

  constructor(private core: Core, public DL: DataLayer, private DA: DataAccess) { }

  LoadList() {
    this.DL.LoadFromLink("website-article");
  }

  GetDate(actionDate: number): Date {
    return this.core.numberToDate(actionDate);
  }

  ngOnInit() {
    this.DL.TITLE = this.DL.Article.Title;
    this.dataContent.nativeElement.innerHTML = this.DL.Article.Content;
  }
}

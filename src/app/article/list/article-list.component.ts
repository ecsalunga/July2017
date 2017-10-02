import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataLayer } from '../../data';
import { ArticleInfo } from '../../data/models';

@Component({
  selector: 'article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {

  constructor(private core: Core, public DL: DataLayer) {}

  GetDate(actionDate: number): Date {
    return this.core.numberToDate(actionDate);
  }

  SelectItem(item: ArticleInfo) {
    this.DL.Article = item;
    this.DL.LoadFromLink("article-detail");
  }

  AddItem(){
    this.DL.Article = null;
    this.DL.LoadFromLink("article-detail");
  }

  ngOnInit() { 
    this.DL.TITLE = "Article List";
  }
}

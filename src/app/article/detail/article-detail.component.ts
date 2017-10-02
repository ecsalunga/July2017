import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ArticleInfo } from '../../data/models';

@Component({
  selector: 'article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  model: ArticleInfo;

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    if (this.DL.Article)
      this.model = Object.assign({}, this.DL.Article);
    else
      this.model = new ArticleInfo();
  }

  CanSave(): boolean {
    if(!this.model.Title || !this.model.Blurb)
      return false;

    if(this.model.key && !this.DL.UserAccess.ArticleEdit)
      return false;

    if(!this.model.key && !this.DL.UserAccess.ArticleAdd)
      return false;

    return true;
  }

  Save() {
    this.model.ActionDate = this.DL.GetActionDate();
    this.DA.ArticleSave(this.model);
    this.LoadList();
    this.DL.Display("Article Details", "Saved!");
  }

  LoadList() {
    this.DL.LoadFromLink("article-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Article Details";
  }
}
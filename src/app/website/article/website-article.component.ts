import { Component, OnInit} from '@angular/core';
import { DataLayer, DataAccess } from '../../data';
import { ArticleInfo } from '../../data/models';

@Component({
  selector: 'website-article',
  templateUrl: './website-article.component.html',
  styleUrls: ['./website-article.component.css']
})
export class WebsiteArticleComponent implements OnInit {

  constructor(public DL: DataLayer, private DA: DataAccess) {}
  
  View(item: ArticleInfo) {
    this.DL.Article = item;
    this.DL.LoadFromLink("website-article-full");
  }

  ngOnInit() {
    this.DL.TITLE = "Publications";
  }
}
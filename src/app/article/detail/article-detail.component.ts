import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ArticleInfo } from '../../data/models';

@Component({
  selector: 'article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  model: ArticleInfo;
  editorBlurb: any;
  editorContent: any;

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

  ngAfterViewInit() {
    tinymce.init({
      selector: '#txtBlurb',
      branding: false,
      menubar: false,
      plugins: ['code'],
      toolbar: 'code undo redo formatselect | bold removeformat',
      skin_url: 'assets/skins/lightgray',
      height : 100,
      setup: editor => {
        this.editorBlurb = editor;
        editor.on('change', () => {
          this.model.Blurb = editor.getContent();
        });
      },
    });
    tinymce.activeEditor.setContent(this.model.Blurb);

    tinymce.init({
      selector: '#txtContent',
      branding: false,
      menubar: false,
      plugins: ['textcolor', 'table', 'code', 'lists'],
      toolbar: 'code undo redo formatselect | fontselect fontsizeselect | bold italic underline forecolor backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table removeformat',
      skin_url: 'assets/skins/lightgray',
      height : 250,
      setup: editor => {
        this.editorContent = editor;
        editor.on('change', () => {
          this.model.Content = editor.getContent();
        });
      },
    });
    tinymce.activeEditor.setContent(this.model.Content);
  }

  ngOnDestroy() {
    tinymce.remove(this.editorBlurb);
    tinymce.remove(this.editorContent);
  }

  ngOnInit() {
    this.DL.TITLE = "Article Details";
  }
}
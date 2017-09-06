import { Component, OnInit, ViewChild, ViewContainerRef, Renderer } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ShowcaseInfo } from '../../models';

@Component({
  selector: 'showcase-detail',
  templateUrl: './showcase-detail.component.html',
  styleUrls: ['./showcase-detail.component.css']
})
export class ShowcaseDetailComponent implements OnInit {
  @ViewChild('fileSelector', {read: ViewContainerRef })
  fileSelector: ViewContainerRef;
  model: ShowcaseInfo;
  isLoaded: boolean = false;

  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer, private renderer: Renderer) {
    if (this.DL.Showcase)
      this.model = Object.assign({}, this.DL.Showcase);
    else
      this.model = new ShowcaseInfo();
  }

  selectFile() {
    this.fileSelector.element.nativeElement.click();
  }

  Save() {
    this.DA.ShowcaseSave(this.model);
    this.LoadList();
    this.DL.Display("Showcase Details", "Saved!");
  }

  upload() {
    this.isLoaded = false;
    let selectedFile = (<HTMLInputElement>this.fileSelector.element.nativeElement).files[0];
    let fRef = this.DA.StorageRef.child("images/" + selectedFile.name);
    fRef.put(selectedFile).then(snapshot => {
        this.model.ImageURL = snapshot.downloadURL;
    });
  }

  imageLoaded() {
    this.isLoaded = true;
  }

  LoadList() {
    this.DL.LoadFromLink("showcase-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Showcase Details";

    this.renderer.listen(this.fileSelector.element.nativeElement, 'change', (event) => {
      this.upload();
    });
  }
}

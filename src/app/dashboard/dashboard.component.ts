import { Component, OnInit, ViewChild, ViewContainerRef, Renderer } from '@angular/core';
import { DataLayer } from '../data';
import * as firebase from 'firebase/app';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('fileSelector', {read: ViewContainerRef })
  fileSelector: ViewContainerRef ;

  imageURL: string;
  storageRef: firebase.storage.Reference = firebase.storage().ref();
  constructor(private DL: DataLayer, private renderer: Renderer) {
    
  }

  selectFile() {
    this.fileSelector.element.nativeElement.click();
  }

  upload() {
      let selectedFile = (<HTMLInputElement>this.fileSelector.element.nativeElement).files[0];
      let fRef = this.storageRef.child("images/" + selectedFile.name);
      fRef.put(selectedFile).then(snapshot => {
          this.imageURL = snapshot.downloadURL;
      });
  }

  ngOnInit() {
    this.DL.TITLE = "Dashboard";

    let fRef = this.storageRef.child('images/image.png');
    fRef.getDownloadURL().then(url => this.imageURL = url);
    this.renderer.listen(this.fileSelector.element.nativeElement, 'change', (event) => {
      this.upload();
    });
  }
}

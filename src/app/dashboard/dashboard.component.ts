import { Component, OnInit } from '@angular/core';
import { DataLayer } from '../data';
import * as firebase from 'firebase/app';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  imageURL: string;
  storageRef: firebase.storage.Reference = firebase.storage().ref();

  constructor(private DL: DataLayer) {}

  upload() {
      let selectedFile = (<HTMLInputElement>document.getElementById('file')).files[0];
        let fRef = this.storageRef.child("images/" + selectedFile.name);
        fRef.put(selectedFile).then(snapshot => {
            this.imageURL = snapshot.downloadURL;
        });
  }

  ngOnInit() {
    this.DL.TITLE = "Dashboard";

    let fRef = this.storageRef.child('images/image.png');
    fRef.getDownloadURL().then(url => this.imageURL = url);
  }
}

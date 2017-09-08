import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DataAccess, DataLayer } from '../../data';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css']
})
export class UserSignupComponent implements OnInit {
  email: string;
  password: string;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(EMAIL_REGEX)]);
  passwordFormControl = new FormControl('', [Validators.required]);

  constructor(private DA: DataAccess, private DL: DataLayer) { }

  Save() {
    this.DA.Signup(this.email, this.password);
  }

  ngOnInit() {
    this.DL.TITLE = "Create Account";
  }
}

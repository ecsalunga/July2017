import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DataAccess, DataLayer } from '../../data';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  email: string;
  password: string;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(EMAIL_REGEX)]);
  passwordFormControl = new FormControl('', [Validators.required]);

  constructor(private DA: DataAccess, private DL: DataLayer) { }

  Login() {
    this.DA.LogIn(this.email, this.password);
  }

  Signup() {
    this.DL.LoadFromLink('user-signup');
  }

  ngOnInit() {
    this.DL.TITLE = "Log In";
  }
}

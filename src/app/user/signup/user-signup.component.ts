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
  name: string;
  email: string;
  password: string;
  confirm: string;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(EMAIL_REGEX)]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  confirmFormControl = new FormControl('', [Validators.required, this.PasswordsMatch.bind(this)]);
  nameFormControl = new FormControl('', [Validators.required]);
  constructor(private DA: DataAccess, public DL: DataLayer) { }

  NotifyConfirm() {
    this.confirmFormControl.updateValueAndValidity();
  }

  PasswordsMatch() {
    if(this.password != this.confirm)
      return { 'PasswordMismatch': true };
  }

  Save() {
    this.DL.SignupName = this.name;
    this.DA.Signup(this.email, this.password);
  }

  ngOnInit() {
    this.DL.TITLE = "Create Account";
  }
}

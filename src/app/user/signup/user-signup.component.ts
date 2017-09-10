import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, AbstractControl } from '@angular/forms';
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
  confirm: string;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(EMAIL_REGEX)]);
  passwordFormControl = new FormControl('', [Validators.required]);
  confirmFormControl = new FormControl('', [Validators.required, this.passwordsMatch.bind(this)]);

  constructor(private DA: DataAccess, private DL: DataLayer) { }

  notifyConfirm() {
    //any.select();
    this.confirmFormControl.updateValueAndValidity();
  }

  public passwordsMatch() {
    if(this.password != this.confirm)
      return { 'passwordMismatch': true };
  }

  Save() {
    this.DA.Signup(this.email, this.password);
  }

  ngOnInit() {
    this.DL.TITLE = "Create Account";
  }
}
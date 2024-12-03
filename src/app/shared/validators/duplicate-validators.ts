import {AbstractControl, Validators} from '@angular/forms';
import {AuthHttpService} from "@services/auth";
import {map} from "rxjs/operators";

export class DuplicateValidators {
 static verifyContent(content : any[]){
  // return (control: AbstractControl) => {
  //   const value = control.value;
  //   return (content.length < 1)? null : content.some((context) => content == value)

  // };

  // check if value is valid or not
  const isValid = 'HOLA'// ...some logic here

  // returns null if value is valid, or an error message otherwise
  return isValid ? null : { 'myCustomError': 'This value is invalid' };

 }
}

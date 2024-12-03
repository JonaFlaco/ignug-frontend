import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()
export class AutenticationService {
  constructor(
    private iRouter: Router
  ){}

  get _jwt(): string | undefined{
    return localStorage.getItem("access_token");
  }

  set _jwt(_value: string){
    localStorage.setItem("access_token", _value);
  }

  get _oUser(){
    return JSON.parse(localStorage.getItem("oUserInfo") || JSON.stringify({}));
  }

  set _oUser(_value: any){
    localStorage.setItem("oUserInfo", JSON.stringify(_value))
  }

  isLogin(): Promise<boolean>{
    return new Promise((resolve, reject) => {
      if(Object.keys(this._oUser).length > 0 || typeof this._jwt === "string"){
        resolve(true);
      } else {
        this.iRouter.navigateByUrl("auth/authentication/login")
        resolve(false);
      }
    });
  }

  getCurrentUser(): Promise<any | null>{
    return new Promise((resolve, reject) => {
      this.isLogin().then((isLogin) => {
        if(isLogin){
          resolve(this._oUser)
        } else {
          resolve(null)
        }
      }).catch(() => {})
    });
  }

  logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}

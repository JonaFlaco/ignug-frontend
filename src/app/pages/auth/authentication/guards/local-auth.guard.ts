import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { OnExitInterface } from '@shared/interfaces';
import { Observable } from 'rxjs';
import { AutenticationService } from '../services/AutenticationService.service';

@Injectable({
  providedIn: 'root'
})
export class LocalAuthGuard implements CanActivate, CanDeactivate<unknown>  {
  constructor(
    private iAutenticationService: AutenticationService
  ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.iAutenticationService.isLogin();
  }

  canDeactivate(
    component: OnExitInterface,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return component.onExit() ? component.onExit() : true;
  }

}

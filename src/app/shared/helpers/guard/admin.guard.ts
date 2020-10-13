import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { SessionStorageService } from './../../../shared/services/session.service';
import { Observable } from 'rxjs';
import { AccountService } from '../../services/account.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AccountService,
    private sessionStorageservice: SessionStorageService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    console.log(
      'auth',
      this.sessionStorageservice.isAuthenticated() ||
        this.authService.isAuthenticated()
    );
    return (
      this.sessionStorageservice.isAuthenticated() ||
      this.authService.isAuthenticated()
    );
  }
}

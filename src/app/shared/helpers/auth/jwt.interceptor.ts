import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { AccountService } from '../../services/account.service';
import { SessionStorageService } from './../../../shared/services/session.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private accountService: AccountService,
    private sessionStorageService: SessionStorageService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to the api url
    const user = this.accountService.subjUser$;
    const token = this.sessionStorageService.getToken();
    const isLoggedIn = this.sessionStorageService.getToken();
    const isApiUrl = request.url.startsWith(environment.urlServer);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request);
  }
}

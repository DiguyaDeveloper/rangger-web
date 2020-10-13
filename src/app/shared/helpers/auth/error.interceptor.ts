import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccountService } from './../../../shared/services/account.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (
          [400, 401, 403].includes(err.status) &&
          this.accountService.subjUser$.value
        ) {
          // auto logout if 401 or 403 response returned from api
          this.accountService.logout();
        }
        console.log('errorint', err);
        const error = {
          message: err.error.message,
          status: err.status,
          id: err.error && err.error.id ? err.error.id : '',
        };
        return throwError(error);
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { AccountService } from '../../services/account.service';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpParams,
} from '@angular/common/http';
import { exhaustMap, take } from 'rxjs/operators';
import { SessionStorageService } from './../../../shared/services/session.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AccountService,
    private sessionStorageService: SessionStorageService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    return this.authService.subjUser$.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) {
          return next.handle(req);
        }
        const modifeReq = req.clone({
          params: new HttpParams().set(
            'auth',
            user.stoken || this.sessionStorageService.getToken()
          ),
        });
        return next.handle(modifeReq);
      })
    );
  }
}

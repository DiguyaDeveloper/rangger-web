import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NewUser } from '../models/new-user';
import {
  RegisterResponse,
  AuthResponse,
} from '../interfaces/auth-response.interface';
import { Usuario } from '../models/usuario';
import { SessionStorageService } from './session.service';
import { UsuarioInfo } from '../models/UserInfo';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private REST_API_SERVER = environment.urlServer;

  public subjUser$: BehaviorSubject<Usuario> = new BehaviorSubject(null);
  private subjLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(null);

  constructor(
    private httpClient: HttpClient,
    private route: Router,
    private sessionStorageService: SessionStorageService
  ) { }

  handleError(error: HttpErrorResponse): any {
    let errorMessage = 'Unknown error!';
    console.log('error', error);
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(error);
  }

  public postEditUser(newUser: UsuarioInfo, file): any {
    const data = new FormData();

    const body: UsuarioInfo = {
      name: newUser.name,
      lastname: newUser.lastname,
      email: newUser.email,
      document: newUser.document,
    };

    data.append('name', body.name);
    data.append('lastname', body.lastname);
    data.append('email', body.email);
    data.append('document', body.document);
    data.append('picture', file);

    return this.httpClient
      .put<RegisterResponse>(this.REST_API_SERVER + 'users', data)
      .pipe(
        tap((resData: RegisterResponse) => {
          console.log('resdataput', resData);
          if (resData.userStatus === 1) {
          }
        }),
        catchError(this.handleError)
      );
  }

  public isAuthenticated(): Observable<boolean> {
    return this.subjLoggedIn$.asObservable();
  }

  public getUserLogged(): Observable<Usuario> {
    return this.subjUser$.asObservable();
  }
}

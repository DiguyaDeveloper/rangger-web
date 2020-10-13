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
export class AccountService {
  private REST_API_SERVER = environment.urlServer;

  public subjUser$: BehaviorSubject<Usuario> = new BehaviorSubject(null);
  private subjLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(null);

  constructor(
    private httpClient: HttpClient,
    private route: Router,
    private sessionStorageService: SessionStorageService
  ) {}

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

  public postLogin(email: string, password: string): any {
    const body = { email, password };

    return this.httpClient
      .post<AuthResponse>(this.REST_API_SERVER + 'users/authenticate', body)
      .pipe(
        catchError(this.handleError),
        tap((resData: AuthResponse) => {
          console.log('resData', resData);
          this.handleAuthentication(
            resData.id,
            resData.idToken,
            +resData.expiresIn,
            resData.user
          );
        })
      );
  }

  logout(): void {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.subjUser$.next(null);
    this.route.navigate(['/auth/login']);
  }

  public postNewUser(newUser: NewUser, file): any {
    const data = new FormData();

    const body: NewUser = {
      fullname: newUser.fullname,
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      state: newUser.state,
      country: newUser.country,
      help: newUser.help,
      acceptTerm: newUser.acceptTerm,
    };

    data.append('fullname', body.fullname);
    data.append('username', body.username);
    data.append('email', body.email);
    data.append('password', body.password);
    data.append('state', body.state);
    data.append('country', body.country);
    data.append('help', body.help);
    data.append('acceptTerm', body.acceptTerm);
    data.append('picture', file);

    return this.httpClient
      .post<RegisterResponse>(this.REST_API_SERVER + 'users/v2', data)
      .pipe(
        tap((resData: RegisterResponse) => {
          if (resData.userStatus === 1) {
            this.handleRegister(resData.id, resData.user);
          }
        }),
        catchError(this.handleError)
      );
  }

  public postVerifyCode(token: string, idUser: string): any {
    const body = { user_id: idUser, codigo: token };

    return this.httpClient
      .post(this.REST_API_SERVER + 'users/update_accountStatus_code', body)
      .pipe(catchError(this.handleError));
  }

  private handleAuthentication(
    userId: string,
    token: string,
    expiresIn: number,
    usuario: Usuario
  ): void {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new Usuario(
      userId,
      usuario.email,
      usuario.name,
      usuario.sobrenome,
      token,
      expirationDate
    );

    this.sessionStorageService.saveUser(user);
    this.sessionStorageService.saveToken(token);
    this.sessionStorageService.hasLogged();
    this.subjLoggedIn$.next(true);
    this.subjUser$.next(user);
    this.route.navigateByUrl('/admin/user');
  }

  private handleRegister(id: string, usuario: UsuarioInfo): void {
    const user = new Usuario(
      id,
      usuario.email,
      usuario.username,
      usuario.fullname,
      null,
      null
    );

    const userInfo = usuario;

    this.subjUser$.next(user);
    this.route.navigateByUrl('/admin/user');
  }

  public isAuthenticated(): Observable<boolean> {
    return this.subjLoggedIn$.asObservable();
  }

  public getUserLogged(): Observable<Usuario> {
    return this.subjUser$.asObservable();
  }

  public loggout(): void {
    this.sessionStorageService.signOut();
    this.subjUser$.next(null);
    this.subjLoggedIn$.next(false);
    this.route.navigateByUrl('/auth/login');
  }
}

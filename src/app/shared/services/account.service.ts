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
      .post<AuthResponse>(this.REST_API_SERVER + 'authenticate/login', body)
      .pipe(
        catchError(this.handleError),
        tap((resData: AuthResponse) => {
          this.handleAuthentication(
            resData.id,
            resData.accessToken,
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
      name: newUser.name,
      lastName: newUser.lastName,
      email: newUser.email,
      password: newUser.password,
      acceptTerm: newUser.acceptTerm,
      document: newUser.document.replace('.', '').replace('-', ''),
    };

    data.append('name', body.name);
    data.append('lastName', body.lastName);
    data.append('email', body.email);
    data.append('password', body.password);
    data.append('termsAndConditions', body.acceptTerm);
    data.append('document', body.document);
    // data.append('file', file);

    return this.httpClient
      .post<RegisterResponse>(this.REST_API_SERVER + 'usuarios', data)
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
      usuario.lastName,
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

  private handleRegister(id: string, usuario: Usuario): void {
    const user = new Usuario(
      id,
      usuario.email,
      usuario.name,
      usuario.lastName,
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

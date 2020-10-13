import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const LOGGED_KEY = 'isAuth';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  constructor() {}

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public hasLogged(): void {
    window.sessionStorage.removeItem(LOGGED_KEY);
    window.sessionStorage.setItem(LOGGED_KEY, 'isAuth');
  }

  public getUser(): any {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  }

  public isAuthenticated(): boolean {
    return sessionStorage.getItem(LOGGED_KEY) === 'isAuth';
  }
}

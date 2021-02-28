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
    window.localStorage.clear();
  }

  public saveToken(token: string): void {
    this.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return this.getItem(TOKEN_KEY);
  }

  public saveUser(user): void {
    this.setItem(USER_KEY, JSON.stringify(user));
  }

  public hasLogged(): void {
    this.setItem(LOGGED_KEY, 'isAuth');
  }

  public getUser(): any {
    return JSON.parse(this.getItem(USER_KEY));
  }

  public isAuthenticated(): boolean {
    return this.getItem(LOGGED_KEY) === 'isAuth';
  }

  public removeItem(key: string): void {
    window.sessionStorage.removeItem(key);
    window.localStorage.removeItem(key);
  }

  private setItem(key: string, value: any): void {
    this.removeItem(key);
    window.sessionStorage.setItem(key, value);
    window.localStorage.setItem(key, value);
  }

  private getItem(key: string): any {
    if (window.sessionStorage.getItem(key)) {
      return window.sessionStorage.getItem(key);
    }
    return window.localStorage.getItem(key);
  }
}

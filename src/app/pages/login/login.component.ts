import { Component, OnInit } from '@angular/core';
import { TypeLoginShow } from './../../shared/types';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../../shared/services/account.service';
import { Usuario } from './../../shared/models/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  authenticated$: Observable<boolean>;
  user$: Observable<Usuario>;
  showView: TypeLoginShow = 'login';
  idUser: string;

  constructor(private router: Router, private authService: AccountService) {
    this.authenticated$ = this.authService.isAuthenticated();
    this.user$ = this.authService.getUserLogged();
  }

  ngOnInit(): void {}

  setIdUser(value): void {
    this.idUser = value;
  }

  ngNavigateToRegister(): void {
    this.router.navigateByUrl('/auth/register');
  }

  ngShowView(event: TypeLoginShow): void {
    this.showView = event;
  }
}

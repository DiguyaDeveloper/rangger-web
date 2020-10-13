import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from '../../shared/services/account.service';
import { Usuario } from './../../shared/models/usuario';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  authenticated$: Observable<boolean>;
  user$: Observable<Usuario>;

  constructor(private authService: AccountService) {
    this.authenticated$ = this.authService.isAuthenticated();
    this.user$ = this.authService.getUserLogged();
  }

  ngOnInit(): void {}

  loggout(): void {
    this.authService.loggout();
  }
}

import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from './../../shared/services/session.service';
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
  user: Usuario;

  constructor(private authService: AccountService, private sessionStorageService: SessionStorageService) {
    this.authenticated$ = this.authService.isAuthenticated();
    this.user$ = this.authService.getUserLogged();
  }

  ngOnInit(): void {
    this.user$.subscribe((value) => {
      this.user = value;
    });

    if (!this.user) {
      this.user = this.sessionStorageService.getUser();
    }
  }

  loggout(): void {
    this.authService.loggout();
  }
}

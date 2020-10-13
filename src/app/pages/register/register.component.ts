import { Component, OnInit, OnDestroy } from '@angular/core';
import { TypeRegisterShow } from './../../shared/types';
import { AccountService } from '../../shared/services/account.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  showView: TypeRegisterShow = 'register';

  products = [];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private authService: AccountService, private router: Router) { }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    // this.authService
    //   .sendGetRequest()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((data: any[]) => {
    //     console.log(data);
    //     this.products = data;
    //   });
  }

  ngShowView(event: TypeRegisterShow): void {
    this.showView = event;
  }

  ngNavigateToLogin(): void {
    this.router.navigateByUrl('/auth/login');
  }
}

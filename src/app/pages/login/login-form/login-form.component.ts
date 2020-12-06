import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from './../../../shared/components/toasts/toast/toast.service';
import { AccountService } from './../../../shared/services/account.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TypeLoginShow } from './../../../shared/types';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit, OnDestroy {
  @Output() showView = new EventEmitter<TypeLoginShow>();
  @Output() idUser = new EventEmitter<string>();
  form: FormGroup;
  submitted = false;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private toaster: ToasterService,
    private router: Router,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.ngCreateForm();
  }

  get f(): any {
    return this.form.controls;
  }

  ngCreateForm(): void {
    this.form = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const email = this.form.controls.email.value;

    const password = this.form.controls.password.value;

    this.accountService
      .postLogin(email, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resData) => {
          console.log('rez', resData);
          this.toaster.show('success', 'Sucesso!', 'Login realizado');
          this.showView.emit('login');
        },
        (error) => {
          console.log(error);
          if (error.status === 500) {
            this.toaster.show('error', 'Falha!', 'Erro interno de servidor');
            return;
          }
          if (error.status === 400 && typeof error.id === 'string') {
            this.showView.emit('emailconfirmation');
            this.idUser.emit(error.id);
            return;
          } else if (error.status === 400 && !error.id) {
            this.toaster.show('warning', 'Alerta!', 'Houve um erro genérico');
          } else {
            this.toaster.show('error', 'Falha!', error.error.erro);
          }
        }
      );

    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.form.value, null, 4));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

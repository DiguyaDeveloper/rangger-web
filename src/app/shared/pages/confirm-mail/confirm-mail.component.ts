import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Usuario } from './../../../shared/models/usuario';
import { AccountService } from './../../../shared/services/account.service';
import { ToasterService } from './../../../shared/components/toasts/toast/toast.service';

@Component({
  selector: 'app-confirm-mail',
  templateUrl: './confirm-mail.component.html',
  styleUrls: ['./confirm-mail.component.scss'],
})
export class ConfirmMailComponent implements OnInit {
  @Output() showView = new EventEmitter<string>();
  @Input() screenView: number;
  @Input() authenticated$: Observable<boolean>;
  @Input() user$: Observable<Usuario>;
  @Input() idUser: string;

  destroy$: Subject<boolean> = new Subject<boolean>();
  submitted = false;
  isInvalid = false;
  verifyCode: string;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AccountService,
    private toaster: ToasterService
  ) {}

  get userId(): Usuario {
    let value;
    this.user$.subscribe((user) => {
      value = user;
    });
    return value;
  }

  ngOnInit(): void {
    this.ngForm();
  }

  ngForm(): void {
    this.form = this.fb.group({});
  }

  // this called every time when user changed the code
  onCodeChanged(code: string): void {
    this.verifyCode = code;
  }

  // this called only if user entered full code
  onCodeCompleted(code: string): void {}

  onSubmit(): void {
    this.submitted = true;

    if (!this.verifyCode || this.verifyCode.length < 6) {
      this.isInvalid = true;
      return;
    }

    this.isInvalid = false;

    this.authService
      .postVerifyCode(this.verifyCode, this.idUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.toaster.show(
            'success',
            'Sucesso!',
            'Email confirmado com sucesso.'
          );
          this.showView.emit('login');
        },
        (erro) => {
          if (erro.status === 500) {
            this.toaster.show('error', 'Falha!', 'Erro interno de servidor');
          } else {
            this.toaster.show('error', 'Falha!', erro.error);
          }
        }
      );
  }
}

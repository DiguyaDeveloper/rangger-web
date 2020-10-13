import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Estado } from './../../../shared/models/estados';
import { AccountService } from './../../../shared/services/account.service';
import { MustMatch } from './../../../shared/validators/password.validator';
import { NewUser } from './../../../shared/models/new-user';
import { ToasterService } from './../../../shared/components/toasts/toast/toast.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent implements OnInit, OnDestroy {
  @Output() showView = new EventEmitter<string>();
  destroy$: Subject<boolean> = new Subject<boolean>();
  form: FormGroup;
  submitted = false;
  estados = Estado;
  fileToUpload: File;
  fieldTextType = false;
  faEyeSlash = faEyeSlash;
  faEye = faEye;

  constructor(
    private fb: FormBuilder,
    private authService: AccountService,
    private toaster: ToasterService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  toggleFieldTextType(): void {
    this.fieldTextType = !this.fieldTextType;
  }

  ngOnInit(): void {
    this.ngCreateForm();
  }

  get f(): any {
    return this.form.controls;
  }

  ngCreateForm(): void {
    this.form = this.fb.group(
      {
        name: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$')]],
        confirmPassword: ['', Validators.required],
        picture: ['', Validators.required],
        acceptTerm: [false, Validators.requiredTrue],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );
  }

  changeFile(file: FileList): void {
    if (file !== undefined && file.length) {
      if (this.validateFile(file[0].name)) {
        this.fileToUpload = file.item(0);
        this.f.picture.value = file[0].name;
      } else {
        this.f.picture.value = '';
        this.f.picture.errors = { required: true };
        this.fileToUpload = this.fileToUpload;
      }
    }
  }

  onPasswordStrengthChanged(strength) {
    console.log('====================================');
    console.log('onPasswordStrengthChanged', strength);
    console.log('====================================');
  }

  validateFile(name: string): boolean {
    const ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() === 'jpg' || ext.toLowerCase() === 'png') {
      return true;
    } else {
      this.toaster.show('warning', 'Atenção!', 'Formato do arquivo inválido');
      return false;
    }
  }

  onSubmit(): void {
    console.log(this.form.controls.acceptTerm)
    this.submitted = true;

    if (this.form.invalid) {
      // this.toaster.show(
      //   'warning',
      //   'Atenção!',
      //   'Preencha os campos obrigatórios'
      // );
      this.toastr.success('Hello world!', 'Toastr fun!');
      return;
    }

    const body: NewUser = {
      fullname: this.f.fullname.value,
      username: this.f.username.value,
      email: this.f.email.value,
      password: this.f.password.value,
      state: this.f.state.value,
      country: this.f.country.value,
      help: this.f.help.value === 0 ? 'true' : 'false',
      acceptTerm: this.f.acceptTerm.value ? 'true' : 'false',
    };

    const file = this.fileToUpload;

    this.authService
      .postNewUser(body, file)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resData) => {
          console.log('rez', resData);
          this.toaster.show(
            'success',
            'Sucesso!',
            'E-mail de confirmação enviado para seu email'
          );
          this.showView.emit('emailconfirmation');
        },
        (error) => {
          if (error.status === 500) {
            this.toaster.show('error', 'Falha!', 'Erro interno de servidor');
            return;
          }
          if (error.status === 400 && error.id === 1) {
            this.toaster.show(
              'warning',
              'Alerta!',
              'E-mail já cadastrado, verifique seu email'
            );
            this.router.navigateByUrl('auth/login');
          } else if (error.status === 400 && !error.id) {
            this.toaster.show('warning', 'Alerta!', 'Houve um erro genérico');
          } else {
            this.toaster.show('error', 'Falha!', error.error.erro);
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

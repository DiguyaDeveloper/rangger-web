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
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  faEyeSlash,
  faEye,
  faAddressCard,
} from '@fortawesome/free-solid-svg-icons';
import { Estado } from './../../../../../shared/models/estados';
import { UsuarioInfo } from './../../../../../shared/models/UserInfo';
import { MascaraUtil } from './../../../../../shared/masks/mask.util';
import { AccountService } from './../../../../../shared/services/account.service';
import { ToasterService } from './../../../../../shared/components/toasts/toast/toast.service';
import { MustMatch } from './../../../../../shared/validators/password.validator';
import { NewUser } from './../../../../../shared/models/new-user';

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
  faAddressCard = faAddressCard;
  usuario = new UsuarioInfo();
  mascaraCpf = MascaraUtil.mascaraCpf;

  constructor(
    private fb: FormBuilder,
    private authService: AccountService,
    private toaster: ToasterService,
    private router: Router,
    private toastr: ToastrService
  ) {}

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
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        picture: ['', Validators.required],
        acceptTerm: [false, Validators.requiredTrue],
        document: ['', Validators.required],
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

  public onPasswordStrengthChanged(strength): void {
    console.log('====================================');
    console.log('onPasswordStrengthChanged', strength);
    console.log('====================================');
  }

  validateFile(name: string): boolean {
    const ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() === 'jpg' || ext.toLowerCase() === 'png') {
      return true;
    } else {
      this.toastr.info('Formato do arquivo inválido', 'Atenção');
      return false;
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.toastr.info('Formulário inválido!', 'Preencha os campos obrigatórios');
      return;
    }

    const body: NewUser = {
      name: this.f.name.value,
      lastName: this.f.lastName.value,
      email: this.f.email.value,
      password: this.f.password.value,
      acceptTerm: this.f.acceptTerm.value ? '1' : '0',
      document: this.f.document.value,
    };

    const file = this.fileToUpload;

    this.authService
      .postNewUser(body, file)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resData) => {
          console.log('rez', resData);
          this.toastr.success('E-mail de confirmação enviado para seu email', 'Sucesso');
          this.showView.emit('emailconfirmation');
        },
        (error) => {
          if (error.status === 500) {
            this.toastr.error('Tente novamente mais tarde', 'Sistema indisponível');
            return;
          }
          if (error.status === 400 && error.id === 1) {
            this.toastr.info('E-mail já cadastrado, verifique seu email', 'Alerta');
            this.router.navigateByUrl('auth/login');
          } else if (error.status === 400 && !error.id) {
            this.toastr.error('Tente novamente mais tarde', 'Sistema indisponível');
          } else {
            this.toastr.error(error.error.erro, 'Erro');
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

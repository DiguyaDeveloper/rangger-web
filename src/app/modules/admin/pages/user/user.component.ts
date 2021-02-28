import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from './../../../../shared/components/toasts/toast/toast.service';
import { Estado } from './../../../../shared/models/estados';
import { UsuarioInfo } from './../../../../shared/models/UserInfo';
import { Usuario } from './../../../../shared/models/usuario';
import { AccountService } from './../../../../shared/services/account.service';
import { SessionStorageService } from './../../../../shared/services/session.service';
import { UsuarioService } from './../../../../shared/services/user.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  estados = Estado;
  fileToUpload: File;
  destroy$: Subject<boolean> = new Subject<boolean>();
  usuario: Usuario;
  getUserSubscribe: Observable<Usuario>;

  constructor(
    private fb: FormBuilder,
    private toaster: ToasterService,
    private router: Router,
    private userService: UsuarioService,
    private accountService: AccountService,
    private sessionStorageService: SessionStorageService
  ) {}

  get f(): any {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.ngCreateForm();
    this.getUsuario();
  }

  ngCreateForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      state: ['', Validators.required],
      country: [{ value: 'Brasil', disabled: true }, Validators.required],
      picture: ['', Validators.required],
    });
  }

  setUsuario(user): void {
    this.f.name.value = user.name;
    this.f.lastName.value = user.lastName;
    this.f.email.value = user.email;
    this.f.state.value = user.state;
    this.f.country.value = user.country;
  }

  getUsuario(): void {
    this.getUserSubscribe = this.accountService.getUserLogged();
    this.getUserSubscribe.subscribe((user) => {
      this.usuario = user;
    });
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
    this.submitted = true;
    if (this.form.invalid) {
      this.toaster.show(
        'warning',
        'Atenção!',
        'Preencha os campos obrigatórios'
      );
      return;
    }

    const body: UsuarioInfo = {
      name: this.f.name.value,
      lastName: this.f.lastName.value,
      email: this.f.email.value,
      document: this.f.document.value,
    };

    const file = this.fileToUpload;

    this.userService
      .postEditUser(body, file)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resData) => {
          console.log('rez', resData);
          this.toaster.show(
            'success',
            'Sucesso!',
            'E-mail de confirmação enviado para seu email'
          );
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
}

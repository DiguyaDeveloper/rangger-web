import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CodeInputModule } from 'angular-code-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForbiddenErrorComponent } from './components/errors/forbidden-error/forbidden-error.component';
import { InternalErrorComponent } from './components/errors/internal-error/internal-error.component';
import { UnauthorizedErrorComponent } from './components/errors/unauthorized-error/unauthorized-error.component';
import { ErrorComponent } from './components/errors/error/error.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { AuthNavbarComponent } from './layout/navbar/auth-navbar/auth-navbar.component';
import { RecoveryPasswordComponent } from './pages/recovery-password/recovery-password.component';
import { ConfirmMailComponent } from './pages/confirm-mail/confirm-mail.component';
import { ToastComponent } from './components/toasts/toast/toast.component';
import { ToastsComponent } from './components/toasts/toasts.component';
import { PasswordStrengthMeterComponent } from './components/password-strength-meter/password-strength-meter.component';

@NgModule({
  imports: [RouterModule, CommonModule, CodeInputModule, ReactiveFormsModule, FormsModule],
  declarations: [
    FooterComponent,
    SidebarComponent,
    NavbarComponent,
    AuthNavbarComponent,
    RecoveryPasswordComponent,
    ConfirmMailComponent,
    ToastComponent,
    ToastsComponent,
    ForbiddenErrorComponent,
    InternalErrorComponent,
    UnauthorizedErrorComponent,
    ErrorComponent,
    LoadingSpinnerComponent,
    PasswordStrengthMeterComponent
  ],
  exports: [
    FooterComponent,
    SidebarComponent,
    NavbarComponent,
    AuthNavbarComponent,
    RecoveryPasswordComponent,
    PasswordStrengthMeterComponent,
    ConfirmMailComponent,
    ToastComponent,
    ToastsComponent,
  ],
})
export class SharedModule { }

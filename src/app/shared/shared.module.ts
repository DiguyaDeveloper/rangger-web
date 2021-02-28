import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CodeInputModule } from 'angular-code-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastComponent } from './components/toasts/toast/toast.component';
import { ToastsComponent } from './components/toasts/toasts.component';
import { PasswordStrengthMeterComponent } from './components/password-strength-meter/password-strength-meter.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { AuthNavbarComponent } from './components/layout/navbar/auth-navbar/auth-navbar.component';
import { RecoveryPasswordComponent } from './../modules/auth/components/recovery-password/recovery-password.component';
import { ConfirmMailComponent } from './../modules/auth/components/confirm-mail/confirm-mail.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    CodeInputModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [
    FooterComponent,
    SidebarComponent,
    NavbarComponent,
    AuthNavbarComponent,
    RecoveryPasswordComponent,
    ConfirmMailComponent,
    ToastComponent,
    ToastsComponent,
    PasswordStrengthMeterComponent,
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
export class SharedModule {}

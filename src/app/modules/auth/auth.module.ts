import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthLayoutRoutes } from './auth.routing';
import { SharedModule } from './../../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginFormComponent } from './pages/login/login-form/login-form.component';
import { RegisterFormComponent } from './pages/register/register-form/register-form.component';

const maskConfigFunction: () => Partial<IConfig> = () => {
  return {
    validation: false,
  };
};

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgxMaskModule.forRoot(maskConfigFunction),
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    LoginFormComponent,
    RegisterFormComponent,
  ],
})
export class AuthModule {}

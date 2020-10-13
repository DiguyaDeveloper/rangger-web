import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AdminComponent } from './layouts/admin/admin.component';
import { SharedModule } from './shared/shared.module';
import { RouterModule } from '@angular/router';
import { AppRoutes } from './app-routing.module';
import { AuthComponent } from './layouts/auth/auth.component';
import { CodeInputModule } from 'angular-code-input';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NotFoundComponent } from './layouts/not-found/not-found.component';
import { AuthInterceptorService } from './shared/helpers/auth/auth.interceptor';
import { JwtInterceptor } from './shared/helpers/auth/jwt.interceptor';
import { ErrorInterceptor } from './shared/helpers/auth/error.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    AuthComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes, {
      useHash: true,
    }),
    ToastrModule.forRoot(),
    SharedModule,
    CodeInputModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

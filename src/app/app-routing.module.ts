import { Routes } from '@angular/router';
import { PathResolveService } from './shared/services/path-resolve.service';
import { AdminGuard } from './shared/helpers/guard/admin.guard';
import { AdminComponent } from './modules/admin/admin.component';
import { AuthComponent } from './modules/auth/auth.component';
import { NotFoundComponent } from './modules/not-found/not-found.component';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        canActivate: [AdminGuard],
        path: '',
        loadChildren: () =>
          import('./modules/admin/admin.module').then((m) => m.AdminModule),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/auth/auth.module').then((m) => m.AuthModule),
      },
    ],
  },
  {
    path: '**',
    resolve: {
      path: PathResolveService,
    },
    component: NotFoundComponent,
  },
];

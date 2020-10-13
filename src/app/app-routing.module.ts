import { Routes } from '@angular/router';
import { AdminComponent } from './layouts/admin/admin.component';
import { AuthComponent } from './layouts/auth/auth.component';
import { PathResolveService } from './shared/services/path-resolve.service';
import { NotFoundComponent } from './layouts/not-found/not-found.component';
import { AdminGuard } from './shared/helpers/guard/admin.guard';

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
          import('./layouts/admin/admin.module').then((m) => m.AdminModule),
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
          import('./layouts/auth/auth.module').then((m) => m.AuthModule),
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

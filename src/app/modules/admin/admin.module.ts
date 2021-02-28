import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin.routing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserComponent } from './pages/user/user.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  declarations: [UserComponent],
})
export class AdminModule {}

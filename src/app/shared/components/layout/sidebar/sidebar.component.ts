import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Usuario } from './../../../../shared/models/usuario';
import { Observable } from 'rxjs';

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/admin/user', title: 'Profile', icon: 'nc-bank', class: '' },
  {
    path: '/admin/pedidos/novo',
    title: 'Novo Pedido',
    icon: 'nc-bank',
    class: '',
  },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Output() loggout: EventEmitter<boolean> = new EventEmitter();
  @Input() authenticated$: Observable<boolean>;
  @Input() user: Usuario;

  public menuItems: any[];

  constructor() {}

  ngOnInit(): void {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }

  ngLoggout(): void {
    this.loggout.emit(true);
  }
}

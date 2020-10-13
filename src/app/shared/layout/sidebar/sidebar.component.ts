import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from './../../../shared/models/usuario';

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
  { path: '/admin/pedidos', title: 'Pedido', icon: 'nc-bank', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Output() loggout: EventEmitter<boolean> = new EventEmitter();
  @Input() authenticated$: Observable<boolean>;
  @Input() user$: Observable<Usuario>;

  public menuItems: any[];
  public menuLoggout: any[];
  constructor() {}

  ngOnInit(): void {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }

  ngLoggout(): void {
    this.loggout.emit(true);
  }
}

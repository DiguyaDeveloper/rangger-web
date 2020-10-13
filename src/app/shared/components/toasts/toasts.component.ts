import { Component, OnInit } from '@angular/core';
import { ToasterService } from './toast/toast.service';
import { Toast } from './toast/toast.interface';

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.component.html',
  styleUrls: ['./toasts.component.scss'],
})
export class ToastsComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toaster: ToasterService) {}

  ngOnInit(): void {
    this.toaster.toast$.subscribe((toast) => {
      this.toasts = [toast, ...this.toasts];
      setTimeout(() => this.toasts.pop(), toast.delay || 6000);
    });
  }

  remove(index: number): void {
    this.toasts = this.toasts.filter((v, i) => i !== index);
  }
}

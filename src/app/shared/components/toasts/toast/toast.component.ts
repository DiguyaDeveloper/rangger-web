import {
  Component,
  Input,
  Output,
  EventEmitter,
  Renderer2,
  ViewChild,
  ElementRef,
  AfterContentChecked,
} from '@angular/core';
import { Toast } from './toast.interface';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements AfterContentChecked {
  @Input() toast: Toast;
  @Input() i: number;

  @Output() remove = new EventEmitter<number>();

  @ViewChild('elementtoast') elementtoast: ElementRef;

  height: string;

  constructor(private renderer: Renderer2) {}

  ngAfterContentChecked(): void {
    let h = 0;
    if (this.i > 0) {
      const toasters = Array.from(document.querySelectorAll('#toast'));
      toasters.forEach((element: HTMLElement) => {
        element.style.bottom = String(h) + 'px';
        h = Number(h) + Number(element.clientHeight + 10);
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
  path: string;

  constructor(private route: Router) {}

  ngOnInit(): void {}

  navigateByUrl(value): void {
    this.route.navigateByUrl(value);
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Usuario } from './../../../shared/models/usuario';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.scss'],
})
export class RecoveryPasswordComponent implements OnInit {
  @Input() authenticated$: Observable<boolean>;
  @Input() user$: Observable<Usuario>;

  form: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.ngCreateForm();
  }

  get f(): any {
    return this.form.controls;
  }

  ngCreateForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.form.value, null, 4));
  }
}

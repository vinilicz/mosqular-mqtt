import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-form-footer',
  imports: [ButtonModule, TranslatePipe],
  templateUrl: './form-footer.html',
  styleUrl: './form-footer.scss',
})
export class FormFooter {
  saveDisabled = input();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  onCancel = output();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  onSave = output();

  save() {
    if (this.saveDisabled()) this.onSave.emit();
  }
}

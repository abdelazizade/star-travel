import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  whatsappNumber = '201009770064';
  whatsappUrl = `https://wa.me/${this.whatsappNumber}`;
  phoneNumber = '+201009770064';
}


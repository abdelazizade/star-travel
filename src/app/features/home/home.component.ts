import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  whatsappNumber = '201009770064';
  whatsappUrl = `https://wa.me/${this.whatsappNumber}`;

  constructor(private translate: TranslateService) {}

  getWhatsAppUrl(key: string): string {
    let message = '';
    this.translate.get(key).subscribe((text: string) => {
      message = text;
    });
    return `${this.whatsappUrl}?text=${encodeURIComponent(message)}`;
  }
}


import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TourService } from '../../core/services/tour.service';
import { Subject, take, takeUntil, tap } from 'rxjs';



interface About{
  id:string,
  description: string,
  title: string,
  images: any[]
}

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

  tours: any[] = [];

  private readonly _translate = inject(TranslateService);
  private readonly _tourService = inject(TourService); // inject the tour service
  private readonly _destroy$ = new Subject<void>();


  getWhatsAppUrl(key: string): string {
    let message = '';
    this._translate.get(key).subscribe((text: string) => {
      message = text;
    });
    return `${this.whatsappUrl}?text=${encodeURIComponent(message)}`;
  }

  homeData: any;
  slider: any[] = [];
  travel: any[] = [];
  about: any = null;

  ngOnInit(): void {
    this.loadHomeData();
  }

  loadHomeData() {
    this._tourService.getAllTours().subscribe((res: any) => {
      console.log(res);
      this.homeData = res;
      this.slider = res.data.slider || [];
      this.travel = res.data.travel || [];
      this.about = res.data.about?.[0] || null;
    });
  }

  getCurrentLang() {
    return this._translate.currentLang || 'en';
  }

  getLocalizedText(field: any): string {
    if (!field) {
      return '';
    }
    if (typeof field === 'string') {
      return field;
    }
    const lang = this.getCurrentLang();
    return field[lang] || field['en'] || Object.values(field)[0] || '';
  }

  getSlideBackground(index: number): string {
    const images = [
      "url('assets/images/1.jpeg')",
      "url('assets/images/2.jpeg')",
      "url('assets/images/3.jpeg')",
      "url('assets/images/4.jpeg')",
      "url('assets/images/5.jpeg')",
      "url('assets/images/6.jpeg')",
    ];
    const image = images[index % images.length];
    return `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), ${image}`;
  }
}

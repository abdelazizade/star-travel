import { Component, HostListener, inject } from '@angular/core';
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

  private readonly heroFallbackImages = [
    'assets/images/Property 1=Default.png',
    'assets/images/Property 1=Variant2.png',
    'assets/images/Property 1=Variant3.png',
    'assets/images/Property 1=Variant4.png',
  ];

  getHeroFallback(index: number): string {
    return this.heroFallbackImages[index % this.heroFallbackImages.length];
  }

  private readonly aboutFallbackImages = [
    'assets/images/1ffd0a97a8416bebbda5c479b887be72f392954f (1).jpg',
    'assets/images/3a8243b7b76183e1687edf02f9ce9be31e5b73cc.jpg',
    'assets/images/06c6d6fc0e0807368a9c47c7af2f9b2a.jpg.jpeg',
    'assets/images/d37cb58a7d83e1e24d34906f45f79653696f08e6.jpg',
  ];

  getAboutImage(index: number): string {
    if (this.about?.images?.length && this.about.images[index]) {
      return this.about.images[index];
    }
    return this.aboutFallbackImages[index] ?? this.aboutFallbackImages[0];
  }

  readonly journeySteps = [
    { number: '01', titleKey: 'howItWorks.step1Title', descKey: 'howItWorks.step1Desc' },
    { number: '02', titleKey: 'howItWorks.step2Title', descKey: 'howItWorks.step2Desc' },
    { number: '03', titleKey: 'howItWorks.step3Title', descKey: 'howItWorks.step3Desc' },
    { number: '04', titleKey: 'howItWorks.step4Title', descKey: 'howItWorks.step4Desc' },
  ];

  // ---- Tour card image + truncation + detail dialog ----
  getTourImage(item: any): string {
    return item?.images?.length ? item.images[0] : 'assets/images/airport.jpeg';
  }

  truncate(text: string, limit: number = 100): string {
    const value = text || '';
    return value.length > limit ? value.slice(0, limit).trimEnd() + '…' : value;
  }

  isTruncated(text: string, limit: number = 100): boolean {
    return (text || '').length > limit;
  }

  selectedTour: any = null;

  openTourDialog(item: any): void {
    this.selectedTour = item;
  }

  closeTourDialog(): void {
    this.selectedTour = null;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.selectedTour) {
      this.closeTourDialog();
    }
  }
}

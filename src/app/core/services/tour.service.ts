import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TourService {
  private readonly http = inject(HttpClient);
  private apiUrl = 'https://repository.star-travel.io/api/v1/cards';

  
  getAllTours(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}





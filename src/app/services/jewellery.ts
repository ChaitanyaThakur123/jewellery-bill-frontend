import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ItemDTO {
  id: string;
  description: string;
  weight: number;
  type: 'gold' | 'silver';
}

@Injectable({
  providedIn: 'root',
})
export class Jewellery {

  baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getItems(): Observable<ItemDTO[]> {
    return this.http.get<ItemDTO[]>(`${this.baseUrl}/items`);
  }

  // ✅ FIX: replace this.api with baseUrl
  getDailyRate(metal: string, date: string) {
    return this.http.get<any>(`${this.baseUrl}/api/daily-rate/get-rate/${metal}/${date}`);

  }

    getLatestGoldRate() {
    return this.http.get("http://localhost:3000/api/gold/latest");
  }

  setDailyRate(metal: string, rate: number, date: string) {
    return this.http.post<any>(`${this.baseUrl}/api/daily-rate/set-rate`, {
      metal, rate, date
    });
  }

  addItem(item: ItemDTO) {
    return this.http.post(`${this.baseUrl}/items`, item);
  }
}

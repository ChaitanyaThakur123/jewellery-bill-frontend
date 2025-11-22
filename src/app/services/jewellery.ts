import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';


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

  api = environment.api;   // ✅ Use ONLY this

  constructor(private http: HttpClient) {}

  // ============================================================
  // ITEMS
  // ============================================================
  getItems(): Observable<ItemDTO[]> {
    return this.http.get<ItemDTO[]>(`${this.api}/items`);
  }

  addItem(item: ItemDTO) {
    return this.http.post(`${this.api}/items`, item);
  }

  // ============================================================
  // DAILY RATES
  // ============================================================
  getDailyRate(metal: string, date: string) {
    return this.http.get<any>(`${this.api}/daily-rate/get-rate/${metal}/${date}`);
  }

  setDailyRate(metal: string, rate: number, date: string) {
    return this.http.post<any>(`${this.api}/daily-rate/set-rate`, { metal, rate, date });
  }

  getLatestGoldRate() {
    return this.http.get(`${this.api}/gold/latest`);
  }
}

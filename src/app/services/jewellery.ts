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
export class JewelleryService {

  api = environment.api;  // ONLY BACKEND URL

  constructor(private http: HttpClient) {}

  // GET ALL ITEMS
  getItems(): Observable<ItemDTO[]> {
    return this.http.get<ItemDTO[]>(`${this.api}/items`);
  }

  // DAILY RATE
  getDailyRate(metal: string, date: string) {
    return this.http.get(`${this.api}/daily-rate/get-rate/${metal}/${date}`);
  }

  setDailyRate(metal: string, rate: number, date: string) {
    return this.http.post(`${this.api}/daily-rate/set-rate`, { metal, rate, date });
  }

  // LATEST GOLD RATE
  getLatestGoldRate() {
    return this.http.get(`${this.api}/gold/latest`);
  }

  // ADD ITEM
  addItem(item: ItemDTO) {
    return this.http.post(`${this.api}/items`, item);
  }
}

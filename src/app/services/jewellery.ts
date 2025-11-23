import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  api = environment.api;  // backend base URL

  constructor(private http: HttpClient) {}

  // ------------------------------------------------------------
  // GET ALL ITEMS
  // Backend: GET /api/items/list
  // ------------------------------------------------------------
  getItems(): Observable<ItemDTO[]> {
    return this.http.get<ItemDTO[]>(`${this.api}/items/list`);
  }

  // ------------------------------------------------------------
  // GET DAILY RATE
  // Backend: GET /api/daily-rate/list
  // ------------------------------------------------------------
  getDailyRate(metal: string, date: string): Observable<number | null> {
    return this.http.get<any[]>(`${this.api}/daily-rate/list`).pipe(
      map((list) => {
        if (!Array.isArray(list)) return null;

        const target = new Date(date);
        target.setHours(0, 0, 0, 0);

        const found = list.find((r) => {
          if (!r.metal_type || !r.date) return false;
          const d = new Date(r.date);
          d.setHours(0, 0, 0, 0);

          return (
            r.metal_type.toLowerCase() === metal.toLowerCase() &&
            d.getTime() === target.getTime()
          );
        });

        return found ? Number(found.rate) : null;
      })
    );
  }

  // ------------------------------------------------------------
  // ADD DAILY RATE
  // Backend: POST /api/daily-rate/add
  // ------------------------------------------------------------
  setDailyRate(metal: string, rate: number, date: string) {
    return this.http.post(`${this.api}/daily-rate/add`, {
      metal_type: metal,
      rate,
      date,
    });
  }

  // ------------------------------------------------------------
  // GET LATEST GOLD RATE
  // Backend: GET /api/gold-rate/list
  // ------------------------------------------------------------
  getLatestGoldRate(): Observable<number | null> {
    return this.http.get<any[]>(`${this.api}/gold-rate/list`).pipe(
      map((list) => {
        if (!Array.isArray(list) || list.length === 0) return null;
        const first = list[0];
        return first?.price ? Number(first.price) : null;
      })
    );
  }

  // ------------------------------------------------------------
  // ADD ITEM
  // Backend: POST /api/items/add
  // ------------------------------------------------------------
  addItem(item: ItemDTO) {
    return this.http.post(`${this.api}/items/add`, item);
  }
}

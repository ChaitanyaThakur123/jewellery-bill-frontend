import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Jewellery, ItemDTO } from '../services/jewellery';

interface SilverRow {
  uid: string;
  itemId: string;
  description: string;
  weight: number | null;
  rate: number | null;
  amount: number;
  making: number;   // manually entered
  total: number;
}

@Component({
  selector: 'app-silver-bill',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './silver-bill.html',
  styleUrls: ['./silver-bill.css']
})
export class SilverBillComponent implements OnInit {
  items: ItemDTO[] = [];
  rows: SilverRow[] = [];

  constructor(private svc: Jewellery) {}

  ngOnInit(): void {
    this.loadItems();
    this.addRow();
  }

  loadItems() {
    this.svc.getItems().subscribe(res => this.items = res);
  }

  uid() { return Math.random().toString(36).substring(2,9); }

  customer = {
  name: '',
  address: '',
  mobile: '',
  date: new Date().toISOString().substring(0, 10)
};


  addRow() {
    this.rows.push({ uid: this.uid(), itemId: '', description: '', weight: null, rate: null, amount: 0, making: 0, total: 0 });
  }

  printBill() {
  window.print();
}

  removeRow(id: string) {
    this.rows = this.rows.filter(r => r.uid !== id);
  }

  onItemIdChange(r: SilverRow) {
    const f = this.items.find(i => i.id === r.itemId);
    if (!f) return;
    r.description = f.description;
    r.weight = f.weight;
    this.recalc(r);
  }

  onRateChange(r: SilverRow) {
    this.recalc(r);
  }

  onMakingChange(r: SilverRow) {
    this.recalc(r);
  }

  recalc(r: SilverRow) {
    if (r.rate != null && r.weight != null) {
      r.amount = r.rate * r.weight;
      r.total = r.amount + r.making;
    }
  }

  get subTotal(): number {
    return this.rows.reduce((s, r) => s + r.total, 0);
  }
}



import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JewelleryService, ItemDTO } from '../services/jewellery';

interface SilverRow {
  uid: string;
  itemId: string;    // using Item.id (G001 etc)
  description: string;
  weight: number | null;
  rate: number | null;
  amount: number;
  making: number;   // manual
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

  constructor(private svc: JewelleryService) {}

  ngOnInit(): void {
    this.loadItems();
    this.addRow();
  }

  loadItems() {
    this.svc.getItems().subscribe((res: ItemDTO[]) => this.items = res || []);
  }

  uid(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  // Customer Inputs
  customer = {
    name: '',
    address: '',
    mobile: '',
    date: new Date().toISOString().substring(0, 10),
  };

  addRow() {
    this.rows.push({
      uid: this.uid(),
      itemId: '',
      description: '',
      weight: null,
      rate: null,
      amount: 0,
      making: 0,
      total: 0
    });
  }

  removeRow(id: string) {
    this.rows = this.rows.filter(r => r.uid !== id);
  }

  printBill() {
    window.print();
  }

  // --------------------------------------------------------
  onItemIdChange(row: SilverRow) {
    const f = this.items.find(i => i.id === row.itemId);
    if (!f) return;

    row.description = f.description;
    row.weight = f.weight;
    this.recalc(row);
  }

  onRateChange(row: SilverRow) {
    this.recalc(row);
  }

  onMakingChange(row: SilverRow) {
    this.recalc(row);
  }

  recalc(row: SilverRow) {
    if (row.rate != null && row.weight != null) {
      row.amount = row.rate * row.weight;
      row.total = row.amount + row.making;
    } else {
      row.amount = 0;
      row.total = row.making;
    }
  }

  get subTotal(): number {
    return this.rows.reduce((s, r) => s + r.total, 0);
  }
}

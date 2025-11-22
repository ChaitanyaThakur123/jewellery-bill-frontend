import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JewelleryService, ItemDTO } from '../services/jewellery';
import { jsPDF } from 'jspdf';
import * as html2canvas from 'html2canvas';
import { HttpClient } from '@angular/common/http';   // ✅ ADDED

interface GoldRow {
  uid: string;
  itemId: string;
  description: string;
  weight: number | null;
  rate: number | null;
  amount: number;
  making: number;
  total: number;
}

@Component({
  selector: 'app-gold-bill',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gold-bill.html',
  styleUrls: ['./gold-bill.css']
})
export class GoldBillComponent implements OnInit {

  items: ItemDTO[] = [];
  rows: GoldRow[] = [];

  dailyGoldRate: number | null = null;

  constructor(private svc: JewelleryService, private http: HttpClient) {}   // ✅ ADDED HttpClient

  ngOnInit(): void {
    this.loadItems();
    this.addRow();
  
    this.checkDailyRate();     // existing
  }

 

  // =========================================
  loadItems() {
    this.svc.getItems().subscribe(res => this.items = res);
  }

  uid(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  customer = {
    name: '',
    address: '',
    mobile: '',
    date: new Date().toISOString().substring(0, 10),
  };

  checkDailyRate() {
    const d = this.customer.date;

    this.svc.getDailyRate("gold", d).subscribe((res: any) => {
      if (res.found) {
        this.dailyGoldRate = res.rate;

        this.rows.forEach(r => {
          r.rate = this.dailyGoldRate!;
          this.recalculate(r);
        });
      }
    });
  }

  addRow() {
    this.rows.push({
      uid: this.uid(),
      itemId: '',
      description: '',
      weight: null,
      rate: this.dailyGoldRate ?? 
      null,  // ✅ use live if available
      amount: 0,
      making: 0,
      total: 0
    });
  }

  printBill() {
    window.print();
  }

  removeRow(id: string) {
    this.rows = this.rows.filter(r => r.uid !== id);
  }

  onItemIdChange(row: GoldRow) {
    const found = this.items.find(i => i.id === row.itemId);
    if (!found) return;

    row.description = found.description;
    row.weight = found.weight;
    this.recalculate(row);
  }

  onRateChange(r: GoldRow) {
    this.recalculate(r);

    if (!this.dailyGoldRate && r.rate && r.rate > 0) {
      this.dailyGoldRate = r.rate;

      this.svc.setDailyRate("gold", r.rate, this.customer.date).subscribe();

      this.rows.forEach(row => {
        row.rate = r.rate!;
        this.recalculate(row);
      });
    }
  }

  recalculate(row: GoldRow) {
    if (row.rate != null && row.weight != null) {
      row.amount = row.rate * row.weight;
      row.making = row.amount * 0.12;
      row.total = row.amount + row.making;
    } else {
      row.amount = 0;
      row.making = 0;
      row.total = 0;
    }
  }

  get subTotal(): number {
    return this.rows.reduce((total, r) => total + r.total, 0);
  }

  async downloadPdf() {
    const element = document.getElementById('gold-bill');
    if (!element) return;

    const canvas = await html2canvas.default(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save('gold-bill.pdf');
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JewelleryService, ItemDTO } from '../services/jewellery';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface GoldRow {
  uid: string;
  itemId: string;        // using Item.id (business id like G001)
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

  constructor(private svc: JewelleryService) {}

  ngOnInit(): void {
    this.loadItems();
    this.addRow();
    this.checkDailyRate();
  }

  // -------------------------------------------------------
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

  // -------------------------------------------------------
  checkDailyRate() {
    const d = this.customer.date;

    this.svc.getDailyRate("gold", d).subscribe((rate) => {
      if (rate !== null) {
        this.dailyGoldRate = rate;

        this.rows.forEach(r => {
          r.rate = this.dailyGoldRate!;
          this.recalculate(r);
        });
      } else {
        // no rate set for this date — leave null
        this.dailyGoldRate = null;
      }
    });
  }

  addRow() {
    this.rows.push({
      uid: this.uid(),
      itemId: '',
      description: '',
      weight: null,
      rate: this.dailyGoldRate ?? null,
      amount: 0,
      making: 0,
      total: 0
    });
  }

  removeRow(id: string) {
    this.rows = this.rows.filter(r => r.uid !== id);
  }

  // -------------------------------------------------------
  onItemIdChange(row: GoldRow) {
    const found = this.items.find(i => i.id === row.itemId);
    if (!found) return;

    row.description = found.description;
    row.weight = found.weight;
    this.recalculate(row);
  }

  onRateChange(r: GoldRow) {
    this.recalculate(r);

    // If rate is entered first time → Save as daily rate
    if ((this.dailyGoldRate === null || this.dailyGoldRate === undefined) && r.rate && r.rate > 0) {
      this.dailyGoldRate = r.rate;
      this.svc.setDailyRate("gold", r.rate, this.customer.date).subscribe({
        next: () => {
          // confirm saved, update rows
          this.rows.forEach(row => {
            row.rate = r.rate!;
            this.recalculate(row);
          });
        },
        error: () => {
          // handle error silently or show toast
          console.error('Failed to save daily rate');
        }
      });
    }
  }

  // -------------------------------------------------------
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

  // -------------------------------------------------------
  printBill() {
    window.print();
  }

  async downloadPdf() {
    const element = document.getElementById('gold-bill');
    if (!element) return;

    const canvas = await html2canvas(element);
    const pdf = new jsPDF('p', 'mm', 'a4');

    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, width, height);
    pdf.save('gold-bill.pdf');
  }
}

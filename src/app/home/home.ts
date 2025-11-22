import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],   // ★ REQUIRED ★
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  constructor(private router: Router) {}

  goGold() { 
    this.router.navigate(['/gold-bill']); 
  }
  goSilver() { 
    this.router.navigate(['/silver-bill']); 
  }
}

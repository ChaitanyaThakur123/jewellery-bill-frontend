import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { GoldBillComponent } from './gold-bill/gold-bill';
import { SilverBillComponent } from './silver-bill/silver-bill';


export const routes: Routes = [
{ path: '', component: HomeComponent },
{ path: 'gold-bill', component: GoldBillComponent },
{ path: 'silver-bill', component: SilverBillComponent }
];

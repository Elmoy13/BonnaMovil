import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SellersService } from '../services/sellers.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.page.html',
  styleUrls: ['./balance.page.scss'],
})
export class BalancePage implements OnInit {
  ventas: any[] = [];
  codAgen: string;
  balanceTotal: number = 0;
  selectedDate: string = this.getTodayDate(); // Default to today
  filteredVentas: any[] = [];
  meta: number = 14500; // Define your goal here
  progressPercentage: number = 0;

  constructor(
    private route: ActivatedRoute,
    private sellersService: SellersService
  ) {}

  ngOnInit() {
    this.codAgen = this.route.snapshot.paramMap.get('codAgen');
    this.loadVentas(this.codAgen);
  }

  getTodayDate(): string {
    const today = new Date().toLocaleDateString('es-MX', {
      timeZone: 'America/Mexico_City',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return today.split('/').reverse().join('-'); // Format as YYYY-MM-DD
  }

  loadVentas(codAgen: string) {
    this.sellersService.getVentas(codAgen).subscribe(
      data => {
        this.ventas = data;
        this.filterVentasByDate(this.selectedDate);
        this.calculateBalanceTotal();
      },
      error => {
        console.error(error);
      }
    );
  }

  filterVentasByDate(date: string) {
    const selectedDateStr = date.split('T')[0]; // Format date as YYYY-MM-DD
    this.filteredVentas = this.ventas.filter(venta => {
      const ventaDate = venta.Fecha.split(' ')[0]; // Extract date part
      return ventaDate === selectedDateStr;
    });
    this.calculateBalanceTotal();
  }

  calculateBalanceTotal() {
    this.balanceTotal = this.filteredVentas.reduce((total, venta) => total + parseFloat(venta.TotalImporte), 0);
    this.updateProgressPercentage();
  }

  updateProgressPercentage() {
    this.progressPercentage = (this.balanceTotal / this.meta) * 100;
  }

  onDateChange() {
    this.filterVentasByDate(this.selectedDate);
  }

  getProgressBarColor(): string {
    if (this.progressPercentage >= 100) {
      return 'green';
    } else if (this.progressPercentage > 95) {
      return 'yellow';
    } else {
      return 'red';
    }
  }
}

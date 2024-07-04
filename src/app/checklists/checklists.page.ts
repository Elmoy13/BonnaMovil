// checklists.page.ts
import { Component, OnInit } from '@angular/core';
import { SellersService } from '../services/sellers.service';  // Asegúrate de tener la ruta correcta
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-checklists',
  templateUrl: './checklists.page.html',
  styleUrls: ['./checklists.page.scss'],
})
export class ChecklistsPage implements OnInit {
  checklists: any[] = [];
  codigoAgente: number;

  constructor(private sellersService: SellersService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.codigoAgente = +params['codigoAgente'];  // Asegúrate de que el nombre del parámetro coincida con el de la ruta
      this.loadChecklists();
    });
  }

  loadChecklists() {
    this.sellersService.getChecklistsByCodigoAgente(this.codigoAgente).subscribe(
      (data: any[]) => {
        this.checklists = data;
      },
      (error) => {
        console.error('Error fetching checklists', error);
      }
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { ChecklistService } from '../services/checklist.service';
import { SellersService } from '../services/sellers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-check',
  templateUrl: './check.page.html',
  styleUrls: ['./check.page.scss'],
})
export class CheckPage implements OnInit {
  checklist = {
    chofer: '',
    fecha: '',
    unidad: '',
    placas: '',
    kmInicial: 0,
    kmFinal: 0,
    combustibleFoto: '',
    acMotor: '',
    acTransm: '',
    acDireccion: '',
    pos1: '',
    pos2: '',
    pos3: '',
    pos4: '',
    refaccion: '',
    espejoLatIzq: '',
    espejoLatDer: '',
    retrovisor: '',
    placasTransporte: '',
    tarjetaC: '',
    licencia: '',
    limpiabrisas: '',
    gato: '',
    claxon: '',
    exteriores: '',
    interiores: '',
    termoking: '',
    combustible: '',
    CodigoAgente: '',
  };

  constructor(
    private checklistService: ChecklistService,
    private sellersService: SellersService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const codAgen = params.get('codAgen');
      if (codAgen) {
        this.checklist.CodigoAgente = codAgen;
      }
    });
  }

  async submitChecklist() {
    const loading = await this.loadingController.create({
      message: 'Enviando...',
      spinner: 'crescent'
    });
    await loading.present();

    this.sellersService.createChecklist(this.checklist).subscribe(
      async response => {
        console.log('Checklist creado exitosamente:', response);
        await loading.dismiss();
        this.router.navigate(['/lista']);
      },
      async error => {
        console.error('Error al crear el checklist:', error);
        await loading.dismiss();
      }
    );
  }
}

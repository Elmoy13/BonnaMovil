import { Component, OnInit } from '@angular/core';
import { SellersService } from '../services/sellers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { SellerDetailModalComponent } from '../seller-detail-modal/seller-detail-modal.component';

@Component({
  selector: 'app-route-assignment',
  templateUrl: './route-assignment.page.html',
  styleUrls: ['./route-assignment.page.scss'],
})
export class RouteAssignmentPage implements OnInit {
  sellers: any[] = [];
  selectedSeller: any;
  clients!: any[];
  seller: any;
  private ruta: string;
  sellerDay: any;
  noClientsMessage: string = "No hay clientes para el día seleccionado.";
  filteredClients: any[] = [];
  clientesDia!: any[];
  clientsToShow: any[] = [];
  filterState: 'asignado' | 'visitado' | 'noVisitado' = 'asignado';
  selectedDay: string = "Lunes";
  private loading: HTMLIonLoadingElement;
  searchTerm: string = '';

  constructor(
    private sellersService: SellersService,
    private route: ActivatedRoute,
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const codAgen = params['codAgen'];
      this.ruta = params['codAgen'];
      this.loadClients(codAgen);
      this.loadClientsDay(codAgen);
    });
  }

  private loadClientsDay(codAgen: string) {
    this.sellersService.getallClientesInfoByDay(codAgen).subscribe(
      (data) => {
        this.clientesDia = data.clientes;
        this.filteredClients = this.clientesDia.filter(cliente => cliente.Lunes !== '0');
      },
      (error) => {
        console.error('Error al obtener clientes', error);
      }
    );
  }

  filterClients(day: string, status: string) {
    if (status === 'asignado' || status === 'visitado' || status === 'noVisitado') {
      this.filterState = status as "asignado" | "visitado" | "noVisitado";
    } else {
      console.error('Estado no válido:', status);
    }
    switch (status) {
      case 'asignado':
        this.filteredClients = this.clientesDia.filter(cliente => cliente[day] === '1');
        break;
      case 'visitado':
        this.filteredClients = this.clientesDia.filter(cliente => cliente[day] === '2');
        break;
      case 'noVisitado':
        this.filteredClients = this.clientesDia.filter(cliente => cliente[day] === '3');
        break;
      default:
        this.filteredClients = this.clientesDia;
        break;
    }
  }

  filterClientsByName() {
    const term = this.searchTerm.toLowerCase();
    this.filteredClients = this.clients.filter(client => 
      client.RazonSocial.toLowerCase().includes(term)
    );
  }

  async openClientDetailsModal(client: any) {
    const modal = await this.modalController.create({
      component: SellerDetailModalComponent,
      componentProps: {
        client: client,
      },
    });
    await modal.present();
  }

  irAMapa(client: any) {
    this.openClientDetailsModal(client);
  }

  private loadClients(codAgen: string) {
    this.sellersService.getClientsBySeller(codAgen).subscribe(
      (data) => {
        this.clients = data.clients;
        this.seller = data.seller;
        this.filteredClients = this.clients;
      },
      (error) => {
        console.error('Error al obtener clientes', error);
      }
    );
  }

  async onDeleteClientesByRuta() {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de eliminar las rutas de la semana?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            this.presentLoading();
            try {
              await this.sellersService.deleteClientesByRuta(this.ruta).toPromise();
              this.dismissLoading();
              this.presentAlert('Clientes eliminados exitosamente');
              this.router.navigate(['/sellers']);
            } catch (error) {
              this.dismissLoading();
              this.presentAlert('Error al eliminar clientes');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Eliminando rutas...',
      spinner: 'crescent',
    });
    await this.loading.present();
  }

  async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }

  irACliente() {
    this.router.navigate(['/add-client-route', this.ruta]);
  }
}

import { Component, OnInit } from '@angular/core';
import { SellersService } from '../services/sellers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { SellerDetailModalComponent } from '../seller-detail-modal/seller-detail-modal.component';

@Component({
  selector: 'app-sellers-clients',
  templateUrl: './sellers-clients.page.html',
  styleUrls: ['./sellers-clients.page.scss'],
})
export class SellersClientsPage implements OnInit {
  sellers: any[] = []; // arreglo que contendrá los vendedores
  selectedSeller: any; // vendedor seleccionado
  clients!: any[]; // arreglo que contendrá los clientes asociados al vendedor seleccionado
  seller: any;
  private ruta: string;
  sellerDay: any;
  noClientsMessage: string = "No hay clientes para el día seleccionado.";
  filteredClientes: any[] = [];
  clientesDia!: any[];
  clientsToShow: any[] = []; // Propiedad para almacenar los clientes que se mostrarán
  filterState: 'asignado' | 'visitado' | 'noVisitado' = 'asignado'; // Estado actual del filtro
  selectedDay: string = "Lunes";
  private loading: HTMLIonLoadingElement;
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
      const codAgen = params['codAgen']; // Obtén el valor de codAgen de los parámetros de la ruta
      this.ruta = params['codAgen'];
      this.loadClients(codAgen);
      this.loadClientsDay(codAgen);

    });
  }

  private loadClientsDay(codAgen: string) {
    this.sellersService.getallClientesInfoByDay(codAgen).subscribe(
      (data) => {
        this.clientesDia = data.clientes; // Asigna los clientes asociados al vendedor seleccionado
        console.log("Somos los clientes ", this.clientesDia)
        this.filteredClientes = this.clientesDia.filter(cliente => cliente.Lunes !== '0');
      },
      (error) => {
        console.error('Error al obtener clientes', error);
      }
    );
  }
  
  filterClients(day: string, status: string) {
    if (status === 'asignado' || status === 'visitado' || status === 'noVisitado') {
      this.filterState = status as "asignado" | "visitado" | "noVisitado"; // Usa la aserción de tipo
    } else {
      console.error('Estado no válido:', status);
    }
    switch (status) {
      case 'asignado':
        this.filteredClientes = this.clientesDia.filter(cliente => cliente[day] === '1');
        break;
      case 'visitado':
        this.filteredClientes = this.clientesDia.filter(cliente => cliente[day] === '2');
        break;
      case 'noVisitado':
        this.filteredClientes = this.clientesDia.filter(cliente => cliente[day] === '3');
        break;
      default:
        this.filteredClientes = this.clientesDia;
        break;
    }
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
        this.clients = data.clients; // Asigna los clientes asociados al vendedor seleccionado
        this.seller = data.seller;
        console.log(this.clients);
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
            this.presentLoading(); // Mostrar el loader antes de la eliminación
            try {
              await this.sellersService.deleteClientesByRuta(this.ruta).toPromise();
              this.dismissLoading(); // Ocultar el loader después de la eliminación
              this.presentAlert('Clientes eliminados exitosamente');
              this.router.navigate(['/sellers']);
            } catch (error) {
              this.dismissLoading(); // Ocultar el loader en caso de error
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
}

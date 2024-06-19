import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AlertController, ModalController } from '@ionic/angular';
import { SellersService } from '../services/sellers.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})
export class ListaPage implements OnInit {
  userInfo: any;
  employee_number: string | undefined;
  name: string | undefined;
  name2: string | undefined;
  arrayCustomers: Array<any> = [];
  daySelected: string | undefined;
  currentDay: string | undefined;
  currentWeekday: any;
  currentVisit: any;
  arrayWeekdays: Array<any> = [];
  itsRouteStarted: string = 'not-started';
  longitude: any;
  latitude: any;
  userData: any;
  email: string | undefined;
  form: FormGroup | undefined;
  clientes: Array<any> = [];
  clientesDia!: any[];
  clientsToShow: any[] = [];
  filterState: 'asignado' | 'visitado' | 'noVisitado' = 'asignado';
  selectedDay: string = "Lunes";
  product: any;
  products: any[] = [];
  filteredProducts: any[] = [];
  ruta!: string;
  hayClientes: boolean = false;
  filteredClientes: any[] = [];
  days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    private productService: ProductService,
    private sellersService: SellersService,
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private alertController: AlertController
  ) {
    this.formInit();
    this.userInfo = localStorage.getItem('userData');
    this.userInfo = JSON.parse(this.userInfo);
    console.log(this.userInfo);
    this.name2 = this.userInfo.name;
    this.ruta = this.userInfo.id_cedis;

    console.log(this.name2);
    console.log(this.ruta);

    this.getLocation();
  }

  ionViewDidEnter() {
    this.employee_number = localStorage.getItem('employee_number') || undefined;
    this.obtenerClientes();
    this.presentLoader();
    this.loadClientsDay(this.ruta);
    this.productService.getAllProducts().subscribe(
      (data) => {
        this.products = data || [];
        console.log(this.products);
        this.dismissLoader();
      },
      (error) => {
        console.error('Error al obtener datos de la API de productos', error);
        this.dismissLoader();
      }
    );
  }

  private loadClientsDay(codAgen: string) {
    this.sellersService.getallClientesInfoByDay(codAgen + '.0').subscribe(
      (data) => {
        this.clientesDia = data.clientes || [];
        console.log("Clientes:", this.clientesDia);
        this.filterClients(this.selectedDay, this.filterState);
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
    this.filteredClientes = this.clientesDia.filter(cliente => cliente[day] !== '0');
  }
  selectDay(day: string) {
    this.selectedDay = day;
    this.filterClients(day, this.filterState);
  }
  getColorClass(cliente: any): string {
    const dayStatus = cliente[this.selectedDay];
    console.log(`Cliente: ${cliente.RazonSocial}, DayStatus: ${dayStatus}`); // Añadir este log
    switch (dayStatus) {
      case '1':
        return 'asignado';
      case '2':
        return 'visitado';
      case '3':
        return 'noVisitado';
      default:
        return '';
    }
  }
  goToBalance() {
    const codAgen = this.ruta; // Reemplaza esto con el valor real que deseas pasar
    this.router.navigate([`/balance/${codAgen}`]);
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.longitude = position.coords.longitude;
        this.latitude = position.coords.latitude;
      });
    } else {
      console.log('No support for geolocation');
    }
  }

  formInit() {
    this.form = this.formBuilder.group({
      employee_number: ['', [Validators.required, Validators.minLength(1)]],
      name: ['', [Validators.required]],
      email: [
        '',
        [Validators.required, Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')],
      ],
    });
  }

  irAMapa(cliente: any) {
    this.router.navigate(['/mapa'], {
      state: { cliente: cliente }
    });
  }

  ngOnInit() {}

  doRefresh(event: any): void {
    this.presentLoader2();
    this.obtenerClientes();
    setTimeout(() => {
      this.dismissLoader2();
      event.target.complete();
    }, 1000);
  }

  private async presentLoader2(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Recargando...',
    });
    await loading.present();
  }

  private async dismissLoader2(): Promise<void> {
    if (this.loadingController) {
      await this.loadingController.dismiss();
    }
  }

  private async presentLoader(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Cargando Clientes...'
    });
    await loading.present();
  }

  private async dismissLoader(): Promise<void> {
    if (this.loadingController) {
      await this.loadingController.dismiss();
    }
  }

  obtenerClientes() {
    this.sellersService.getClientesInfoByDay(this.ruta + '.0').subscribe(
      (data) => {
        console.log(data);
        this.clientes = data.clientes || [];
        this.hayClientes = this.clientes.length > 0;
      },
      (error) => {
        console.error('Error al obtener datos de la API', error);
        this.hayClientes = false;
      }
    );
  }

  goToLogin() {
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  irCliente(codAgen: string) {
    this.router.navigate(['/route-assignment', codAgen]);
  }
}

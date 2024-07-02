import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ProductService } from '../services/product.service';
import { HttpClient } from '@angular/common/http';
import { SellersService } from '../services/sellers.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements AfterViewInit {

  @ViewChild('mapdiv') mapdivElement!: ElementRef;
  @ViewChild('kgInput') kgInputElement!: ElementRef;
  @ViewChild('volumenInput') volumenInputElement!: ElementRef;

  kgValue: number;
  volumenValue: number;
  ventas: { id: any; kg: number; precio: any; precioTotal: number }[] = [];
  totalPrecioTotal: number = 0;
  cliente: any;
  product: any;
  id: any;
  private numeroPedido: number = 0;

  products: any[] = [];
  filteredProducts: any[] = [];
  scannedData: any = {};
  nuevosKilogramos: number | undefined;
  empleado: any;
  userInfo: any;
  CodCliente: any;
  idCliente: any;

  constructor(
    private route: ActivatedRoute,
    private loadingController: LoadingController, 
    private productService: ProductService,
    private sellersService: SellersService,
    private alertController: AlertController,
    private httpClient: HttpClient,
    private router: Router
  ) {
    this.kgValue = 0;
    this.volumenValue = 0;
    this.scannedData = {};
  }

  ngAfterViewInit(): void {}

  ngOnInit() {
    this.userInfo = localStorage.getItem('userData');
    this.userInfo = JSON.parse(this.userInfo);
    this.empleado = this.userInfo.id_cedis;

    console.log(this.empleado);
    this.cliente = history.state.cliente;
    console.log(this.cliente);
    this.idCliente = history.state.cliente.id;
    console.log(this.idCliente);

    this.CodCliente = history.state.cliente.CodCliente;
    console.log(this.CodCliente);

    this.presentLoader();

    this.productService.getAllProducts().subscribe(
      (response) => {
        const data = response.data;
        if (Array.isArray(data)) {
          this.products = data;
          console.log(this.products);
        } else {
          console.error('La propiedad "data" en la respuesta de la API de productos no es un arreglo', response);
        }
        this.dismissLoader();
      },
      (error) => {
        console.error('Error al obtener datos de la API de productos', error);
        this.dismissLoader();
      }
    );
  }

  private async presentLoader(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();
  }

  private async dismissLoader(): Promise<void> {
    if (this.loadingController) {
      await this.loadingController.dismiss();
    }
  }

  onSearchChange(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredProducts = this.products.filter(
      (product) =>
        product.Descripcion.toLowerCase().includes(searchTerm) ||
        product.CodProd.toLowerCase().includes(searchTerm)
    );
  }

  selectProduct(product: any) {
    this.scannedData.Descripcion = product.Descripcion;
    this.filteredProducts = [];
  }

  async mostrarRazonesNoEntrega() {
    const razones = [
      'Dirección incorrecta',
      'Cliente ausente',
      'No hay acceso al edificio',
      'Otra razón',
    ];

    const alert = await this.alertController.create({
      header: 'Seleccione la razón',
      inputs: razones.map((razon, index) => ({
        name: `razon-${index}`,
        type: 'radio',
        label: razon,
        value: razon,
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Aceptar',
          handler: (data) => {
            this.registrarVisita();
            this.enviarRazonNoEntrega(data);
          },
        },
      ],
    });

    await alert.present();
  }

  async enviarRazonNoEntrega(razon: string) {
    try {
      const idCliente = this.cliente.id;

      const response = await this.sellersService.editarNoVisitado(idCliente, { NoVisitado: razon }).toPromise();

      this.mostrarAlerta('Éxito', response.message);
      this.router.navigate(['/lista']);

    } catch (error) {
      this.mostrarAlerta('Error', 'Hubo un problema al enviar la razón de no entrega.');
    }
  }

  registrarVisita() {
    const fechaActual = new Date();
    const data = {
      fecha: fechaActual.toISOString(),
      empleado: this.empleado,
      cliente: this.CodCliente,
      noVenta: null
    };

    this.sellersService.registrarVisita(data).subscribe(
      response => {
        console.log('Registro de visita exitoso', response);
      },
      error => {
        console.error('Error al registrar visita', error);
      }
    );
  }

  agregarVenta() {
    if (this.scannedData.Descripcion && this.nuevosKilogramos) {
      const productoSeleccionado = this.products.find(
        (product) => product.Descripcion === this.scannedData.Descripcion
      );

      if (productoSeleccionado) {
        const precioTotal = productoSeleccionado.Publico * this.nuevosKilogramos;

        this.ventas.push({
          id: productoSeleccionado.CodProd,
          kg: this.nuevosKilogramos,
          precio: productoSeleccionado.Publico,
          precioTotal: precioTotal
        });
        this.scannedData.Descripcion = '';
        this.nuevosKilogramos = 0;
        this.actualizarTotalPrecioTotal();
      } else {
        this.mostrarAlerta('Producto no encontrado', 'Por favor, selecciona un producto válido.');
      }
    } else {
      this.mostrarAlerta('Error', 'Por favor, selecciona un producto y proporciona la cantidad de kilogramos.');
    }
  }

  async realizarVenta() {
    if (this.ventas.length > 0) {
      const loader = await this.presentLoader2();
      const data = {
        Fecha: new Date().toISOString(),
        CodCte: this.CodCliente,
        CodAgen: this.empleado,
        TotalPzs: this.getTotalKilos(),
        Importe: this.totalPrecioTotal,
        Referencia: 'Referencia',
        ParaCliente: true,
        productos: this.ventas.map((venta, index) => ({
          NoRenglon: index + 1,
          CodProd: venta.id,
          Piezas: venta.kg,
          Kgs: venta.kg,
          PrecioUnit: venta.precio,
        })),
      };

      console.log('Datos a enviar en el POST:', data);

      this.sellersService.createVentaCompleta(data).subscribe(
        (response) => {
          loader.dismiss(); 
          this.mostrarAlerta('Éxito', response.messages);
          this.ventas = [];
          this.actualizarTotalPrecioTotal();

          this.sellersService.editarVisitado(this.idCliente).subscribe(
            (editResponse) => {
              console.log('Edición de visitado exitosa:', editResponse);
            },
            (editError) => {
              console.error('Error al editar visitado:', editError);
            }
          );

          this.router.navigate(['/lista']);
        },
        (error) => {
          this.mostrarAlerta('Error', 'Hubo un problema al realizar la venta.');
        }
      );
    } else {
      this.mostrarAlerta('Error', 'No hay ventas para realizar.');
    }
  }

  private getTotalKilos(): number {
    return this.ventas.reduce((total, venta) => total + venta.kg, 0);
  }

  private actualizarTotalPrecioTotal() {
    this.totalPrecioTotal = this.ventas.reduce((total, venta) => total + venta.precioTotal, 0);
  }

  private async presentLoader2(): Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingController.create({
      message: 'Realizando venta...',
    });
    await loading.present();
    return loading;
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  eliminarVenta(index: number) {
    this.ventas.splice(index, 1);
    this.actualizarTotalPrecioTotal();
  }

  actualizarPrecioTotal(venta: any, index: number) {
    const productoSeleccionado = this.products.find(
      (product) => product.CodProd === venta.id
    );

    if (productoSeleccionado) {
      venta.precioTotal = productoSeleccionado.Publico * venta.kg;
      this.actualizarTotalPrecioTotal();
    } else {
      this.mostrarAlerta('Producto no encontrado', 'Por favor, selecciona un producto válido.');
    }
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-add-client-route',
  templateUrl: './add-client-route.page.html',
  styleUrls: ['./add-client-route.page.scss'],
})
export class AddClientRoutePage implements OnInit {
  formData = {
    RazonSocial: '',
    Domicilio: '',
    NoExterior: '',
    Ruta: '',
    Colonia: '',
    Poblacion: '',
    Estado: '',
    Telefono: '',
    CodPostal: '',
    RFC: 'XAXX010101111', // Valor predeterminado
    Email: '',
    EnviadoTaz: false, // Valor predeterminado
    FormaPago: '01', // Valor predeterminado
    UsoCFDI: 'G01' // Valor predeterminado
  };

  isFormValid = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const codAgen = params.get('codAgen');
      if (codAgen) {
        this.formData.Ruta = codAgen;
      }
    });
  }

  
  


  async submitForm() {
    // Establecer valores predeterminados si no se ingresan
    if (!this.formData.Email) {
      this.formData.Email = 'bonna@gmail.com';
    }

    // Mostrar el loader
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });
    await loading.present();

    // Enviar los datos al servidor
    this.http.post('http://201.159.34.30:9295/bonnacarne-api/public/api/alta-clientes-ruta', this.formData)
      .subscribe(
        async (response: any) => {
          console.log('Respuesta del servidor:', response);
          // Ocultar el loader
          await loading.dismiss();
          // Mostrar la alerta de éxito
          this.presentAlert('Éxito', 'El servicio se ejecutó correctamente.');
          this.goToSellers();
          // Puedes manejar la respuesta del servidor aquí
        },
        async error => {
          console.error('Error al enviar la solicitud:', error);
          // Ocultar el loader
          await loading.dismiss();
          // Mostrar la alerta de error
          this.presentAlert('Error', 'Hubo un problema al ejecutar el servicio. Por favor, inténtalo de nuevo.');
          // Puedes manejar errores aquí
        }
      );
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  goToSellers() {
    this.router.navigate(['/lista']);
  }
}

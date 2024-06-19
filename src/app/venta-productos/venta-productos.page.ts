import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SellersService } from '../services/sellers.service'; 
import { ProductService } from '../services/product.service'; // Importa el servicio de productos

@Component({
  selector: 'app-venta-productos',
  templateUrl: './venta-productos.page.html',
  styleUrls: ['./venta-productos.page.scss'],
})
export class VentaProductosPage implements OnInit {
  noVenta: string;
  detalleVenta: any;
  movimientos: any[] = [];
  productos: any[] = []; // Array para almacenar los detalles de productos

  constructor(
    private route: ActivatedRoute, 
    private sellersService: SellersService,
    private productService: ProductService // Inyecta el servicio de productos
  ) { }

  ngOnInit() {
    this.noVenta = this.route.snapshot.paramMap.get('NoVenta');
    this.getDetalleVenta();
  }

  getDetalleVenta() {
    this.sellersService.getDetalleVentas(this.noVenta).subscribe(data => {
      this.detalleVenta = data;
      if (this.detalleVenta && this.detalleVenta.movimientos) {
        this.movimientos = this.detalleVenta.movimientos;
        this.loadProductDetails();
      }
    });
  }

  loadProductDetails() {
    this.movimientos.forEach(movimiento => {
      this.productService.getProductByCodeImg(movimiento.CodProd).subscribe(productData => {
        const combinedData = {
          ...movimiento,
          ...productData.data // Combina los detalles del movimiento con los detalles del producto
        };
        this.productos.push(combinedData);

        // Añadir console.log aquí
        console.log(`Datos combinados: `, combinedData);
      }, error => {
        // En caso de error al obtener el producto, se añade solo el movimiento
        this.productos.push(movimiento);
        console.log(`No se pudo obtener detalles del producto para CodProd: ${movimiento.CodProd}`);
      });
    });
  }
}

// sellers.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SellersService {
  apiUrl: string = env.API;

  constructor(private http: HttpClient) { }

  getAllSellers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}sellers/all`);
  }
  registrarVisita(data: any): Observable<any> {
    const url = `${this.apiUrl}registrar-visita`;
    return this.http.post<any>(url, data);
  }

  getClientsBySeller(codAgen: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}sellers/${codAgen}`);
  }
  createClienteInfo(data: any): Observable<any> {
    const url = `${this.apiUrl}crear-cliente-info`;

    return this.http.post<any>(url, data);
  }
  getClientesInfoByDay(ruta: string): Observable<any> {
    const url = `${this.apiUrl}getClientesInfoByDay/${ruta}`;
    return this.http.get<any>(url);
  }
  editarNoVisitado(idCliente: string, data: any): Observable<any> {
    const url = `${this.apiUrl}clientes/${idCliente}/editar-no-visitado`;
    return this.http.put<any>(url, data);
  }
  getallClientesInfoByDay(ruta: string): Observable<any> {
    const url = `${this.apiUrl}getAllClientesInfoByDay/${ruta}`;
    return this.http.get<any>(url);
  }

  createVentaCompleta(data: any): Observable<any> {
    const url = `${this.apiUrl}create-venta`;
    return this.http.post<any>(url, data);
  }
  editarVisitado(idCliente: string): Observable<any> {
    const url = `${this.apiUrl}clientes/${idCliente}/editar-visitado`;
    const data = {};
    return this.http.put<any>(url, data);
}
deleteClientesByRuta(ruta: string): Observable<any> {
  const url = `${this.apiUrl}delete-cliente-ruta`;

  return this.http.post<any>(url, { Ruta: ruta });
}
getVentas(codAgen: string): Observable<any> {
  const url = `${this.apiUrl}ventas/${codAgen}`;
  return this.http.get<any>(url);
}
getDetalleVentas(noVenta: string): Observable<any> {
  const url = `${this.apiUrl}venta/${noVenta}`;
  return this.http.get<any>(url);
}
getGoalDay(codAgen: string): Observable<any> {
  const codAgenNumber = Number(codAgen); // Convert to number here
  const url = `${this.apiUrl}users/${codAgenNumber}/goalDay`;
  return this.http.get<any>(url);
}
updateGoalDay(codAgen: string, goalDay: number): Observable<any> {
  const codAgenNumber = Number(codAgen); // Convert to number here
  const url = `${this.apiUrl}users/${codAgenNumber}/goalDay`;
  return this.http.put<any>(url, { goalDay });
}
createChecklist(checklistData: any): Observable<any> {
  const url = `${this.apiUrl}checklist`;
  return this.http.post<any>(url, checklistData);
}

// Método para obtener todos los checklists
getAllChecklists(): Observable<any[]> {
  const url = `${this.apiUrl}checklist`;
  return this.http.get<any[]>(url);
}
getChecklistsByCodigoAgente(codigoAgente: number): Observable<any[]> {
  const url = `${this.apiUrl}checklists/${codigoAgente}`;
  return this.http.get<any[]>(url);
}
}

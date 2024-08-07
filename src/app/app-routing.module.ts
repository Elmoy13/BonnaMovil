import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'lista',
    loadChildren: () => import('./lista/lista.module').then( m => m.ListaPageModule)
  },
  {
    path: 'mapa',
    loadChildren: () => import('./mapa/mapa.module').then( m => m.MapaPageModule)
  },
  {
    path: 'create-users',
    loadChildren: () => import('./create-users/create-users.module').then( m => m.CreateUsersPageModule)
  },
  {
    path: 'sellers',
    loadChildren: () => import('./sellers/sellers.module').then( m => m.SellersPageModule)
  },
  {
    path: 'sellers-clients/:codAgen', 
    loadChildren: () => import('./sellers-clients/sellers-clients.module').then(m => m.SellersClientsPageModule)
  },
  {
    path: 'alta-cliente',
    loadChildren: () => import('./alta-cliente/alta-cliente.module').then( m => m.AltaClientePageModule)
  },
  {
    path: 'route-assignment/:codAgen',
    loadChildren: () => import('./route-assignment/route-assignment.module').then( m => m.RouteAssignmentPageModule)
  },
  {
    path: 'add-client-route/:codAgen',
    loadChildren: () => import('./add-client-route/add-client-route.module').then( m => m.AddClientRoutePageModule)
  },
  {
    path: 'balance/:codAgen',
    loadChildren: () => import('./balance/balance.module').then( m => m.BalancePageModule)
  },
  {
    path: 'venta-productos/:NoVenta',
    loadChildren: () => import('./venta-productos/venta-productos.module').then( m => m.VentaProductosPageModule)
  },
  
  {
    path: 'check/:codAgen',
    loadChildren: () => import('./check/check.module').then( m => m.CheckPageModule)
  },
  {
    path: 'checklists/:codigoAgente',
    loadChildren: () => import('./checklists/checklists.module').then(m => m.ChecklistsPageModule)
  }





  



  
          
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

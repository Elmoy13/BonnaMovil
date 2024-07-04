import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {
  private dbPath = 'checklist';

  constructor(
    private db: AngularFirestore,
    private loadingController: LoadingController
  ) {}

  async createChecklist(checklist: any): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Enviando checklist...'
    });
    await loading.present();

    this.db.collection(this.dbPath).add(checklist)
      .then(() => {
        console.log('Checklist creado exitosamente');
        loading.dismiss();
      })
      .catch(error => {
        console.error('Error al crear el checklist:', error);
        loading.dismiss();
      });
  }
}

import { Injectable } from '@angular/core';
import { StorageService } from 'src/app/services/storageService';
import { AlertController } from '@ionic/angular';

import { v4 as uuid } from 'uuid';

export interface treino {
    nome: string;
    id: string;
}

@Injectable({
    providedIn: 'root'
})

export class TreinosService {
    private storageKey:string = 'treinos'

    constructor(
        private alertController: AlertController,
        private storageService: StorageService,
    ) {
    }


    async getTreinos() {
        const treinoList = await this.storageService.get(this.storageKey)
        return treinoList
    }

    async addTreino() {
        const { data: { values: { nome } } } = await this.presentAlertPrompt()
        if(!nome){
            return
        }

        const novoTreino: treino = {
            nome: nome,
            id: uuid()
        }

        let treinoList = await this.storageService.get(this.storageKey)
        if (!treinoList) {
            treinoList = []
        }

        treinoList.push(novoTreino)
        await this.storageService.set(this.storageKey, treinoList)
        this.getTreinos()
    }

    async presentAlertPrompt() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Novo Treino',
            inputs: [
                {
                    name: 'nome',
                    type: 'text',
                    placeholder: 'Nome do Treino'
                }
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    cssClass: 'secondary',
                }, {
                    text: 'Adicionar',
                }
            ]
        });

        await alert.present();
        return alert.onDidDismiss()
    }

    async removerTreino(treino_id: string) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Remover Treino?',
            buttons: [
                {
                    text: 'Cancelar',
                    cssClass: 'secondary',
                }, {
                    text: 'Remover',
                    cssClass: 'danger',
                    handler: async () => {
                        const treinosList = await this.storageService.get(this.storageKey)
                        const index = treinosList.findIndex(x => x.id === treino_id)
                        treinosList.splice(index, 1)
                        this.storageService.set(this.storageKey, treinosList)
                    }
                }
            ]
        })

        await alert.present();
        
        return alert.onDidDismiss()
    }
}
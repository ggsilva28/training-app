import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { StorageService } from 'src/app/services/storageService';
import { TreinosService } from './treinoService';

import { v4 as uuid } from 'uuid';

export interface exercicio {
    id: string;
    treino_id: string;
    nome: string;
    series: number;
    repeticoes: number;
}

@Injectable({
    providedIn: 'root'
})

export class ExerciciosService {

    private storageKey: string = 'exercicios'

    constructor(
        private alertController: AlertController,
        private storageService: StorageService,
    ) { }

    async getExercicio(treino_id: string) {
        const treinos = await this.storageService.get(this.storageKey)
        const treinoList = []
        if (treinos) {

            treinos.find(x => {
                if (x.treino_id === treino_id)
                    treinoList.push(x)
            })

            return treinoList
        }else{
            return []
        }
    }

    async addExercicio(treino_id: string) {
        const { data: { values } } = await this.presentAlertPrompt()
        if (!values.nome && !values.series && !values.repeticoes) {
            return
        }

        let exercicioList = await this.storageService.get(this.storageKey)
        if (!exercicioList) {
            exercicioList = []
        }

        const novoExercicio: exercicio = {
            id: uuid(),
            treino_id: treino_id,
            nome: values.nome,
            series: values.series,
            repeticoes: values.repeticoes,
        }

        exercicioList.push(novoExercicio)
        return await this.storageService.set(this.storageKey, exercicioList)
    }

    async presentAlertPrompt() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Novo Exercício',
            inputs: [
                {
                    name: 'nome',
                    type: 'text',
                    placeholder: 'Nome do Treino'
                },
                {
                    name: 'series',
                    type: 'number',
                    placeholder: 'Número de Séries'
                },
                {
                    name: 'repeticoes',
                    type: 'number',
                    placeholder: 'Número de Repetições'
                },
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


    async removerExercicio(exercicio_id: string) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Remover Exercício?',
            buttons: [
                {
                    text: 'Cancelar',
                    cssClass: 'secondary',
                }, {
                    text: 'Remover',
                    cssClass: 'danger',
                    handler: async () => {
                        const exerciciosList = await this.storageService.get(this.storageKey)
                        const index = exerciciosList.findIndex(x => x.id === exercicio_id)
                        exerciciosList.splice(index, 1)
                        this.storageService.set(this.storageKey, exerciciosList)
                    }
                }
            ]
        })

        await alert.present();

        return alert.onDidDismiss()
    }
}
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { StorageService } from 'src/app/services/storageService';
import { EventsService } from './events.service';

import { v4 as uuid } from 'uuid';

export interface exercicio {
    id: string;
    treino_id: string;
    nome: string;
    series: number;
    peso?: string;
    repeticoes: number;
    concluido?: boolean;
}

@Injectable({
    providedIn: 'root'
})

export class ExerciciosService {

    private storageKey: string = 'exercicios'

    constructor(
        private alertController: AlertController,
        private storageService: StorageService,
        private eventsService: EventsService,
    ) { }

    async getExercicio(treino_id: string) {
        const exercicios = await this.storageService.get(this.storageKey)
        const exerciciosList = []
        if (exercicios) {

            exercicios.find(x => {
                if (x.treino_id === treino_id)
                    exerciciosList.push(x)
            })

            return exerciciosList
        } else {
            return []
        }
    }

    async addExercicio(treino_id: string) {
        const { data } = await this.presentAlertPrompt()
        if (!data) {
            return false
        }
        const values = data.values

        if (!values.nome && !values.series && !values.repeticoes) {
            return false
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
            peso: values.peso,
            repeticoes: values.repeticoes,
            concluido: false
        }

        exercicioList.push(novoExercicio)
        return await this.storageService.set(this.storageKey, exercicioList)
    }

    async editExercicio(exercicio_id: string) {
        const exerciciosList = await this.storageService.get(this.storageKey)
        const exercicio = exerciciosList.find(x => x.id == exercicio_id)
        if (!exercicio) {
            return false
        }

        const { data } = await this.presentAlertPrompt(exercicio)
        if (!data) {
            return false
        }

        const values = data.values
        if (!values.nome && !values.series && !values.repeticoes) {
            return false
        }

        let exercicioList = await this.storageService.get(this.storageKey)
        const novoExercicio: exercicio = {
            id: exercicio.id,
            treino_id: exercicio.treino_id,
            nome: values.nome,
            series: values.series,
            peso: values.peso,
            repeticoes: values.repeticoes,
            concluido: false
        }

        const index = exercicioList.findIndex(x => x.id == exercicio_id)
        exercicioList[index] = novoExercicio

        return await this.storageService.set(this.storageKey, exercicioList)
    }

    async removerExercicio(exercicio_id: string) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Remover Exercício?',
            mode: 'ios',
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

    async presentAlertPrompt(values: any = {}) {
        const title = (values.id) ? 'Editar Exercício' : 'Novo Exercício'
        let buttons: any = [
            {
                text: 'Cancelar',
                cssClass: 'secondary',
                handler: () => {
                    this.eventsService.publish('getExercicios')
                }
            }, {
                text: 'Adicionar',
                cssClass: 'primary',
                handler: () => {
                    this.eventsService.publish('getExercicios')
                }
            }
        ]

        if (values.id) {
            buttons = [
                {
                    text: 'Remover',
                    cssClass: 'danger',
                    handler: async () => {
                        await this.removerExercicio(values.id)
                        this.eventsService.publish('getExercicios')
                    }
                },
                {
                    text: 'Salvar',
                    cssClass: 'primary',
                    handler: () => {
                        this.eventsService.publish('getExercicios')
                    }
                }
            ]
        }

        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: title,
            mode: 'ios',
            inputs: [
                {
                    name: 'nome',
                    type: 'text',
                    placeholder: 'Nome do Treino',
                    value: values?.nome
                },
                {
                    name: 'series',
                    type: 'number',
                    placeholder: 'Número de Séries',
                    value: values?.series
                },
                {
                    name: 'repeticoes',
                    type: 'number',
                    placeholder: 'Número de Repetições',
                    value: values?.repeticoes
                },
                {
                    name: 'peso',
                    type: 'text',
                    placeholder: 'Peso',
                    value: values?.peso
                },
            ],
            buttons: buttons
        });

        await alert.present();
        return alert.onDidDismiss()
    }

}
import { Component } from '@angular/core';

import { TreinosService, treino } from '../services/treinoService';
import { ExerciciosService, exercicio } from '../services/exercicioService';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  public treinos: Partial<treino[]> = []
  public treinoSelected: treino
  public exercicios: Partial<exercicio[]> = []

  constructor(
    private treinosService: TreinosService,
    private exerciciosService: ExerciciosService,
  ) {
  }

  async ionViewDidEnter() {
    await this.getTreinos()
    this.treinoSelected = (this.treinos.length) ? this.treinos[0] : null
    if (this.treinoSelected) {
      this.getExercicios(this.treinoSelected.id)
    }
  }

  async getTreinos() {
    return this.treinos = await this.treinosService.getTreinos()
  }

  async addTreino() {
    await this.treinosService.addTreino()
    this.getTreinos()
  }

  async removeTreino(treino_id: string) {
    await this.treinosService.removerTreino(treino_id)
    this.getTreinos()
  }

  async getExercicios(treino_id: string) {
    return this.exercicios = await this.exerciciosService.getExercicio(treino_id)
  }

  async addExercicio() {
    await this.exerciciosService.addExercicio(this.treinoSelected.id)
    this.getExercicios(this.treinoSelected.id)
  }

  async removeExercicio(exercicio_id: string) {
    await this.exerciciosService.removerExercicio(exercicio_id)
    this.getExercicios(this.treinoSelected.id)
  }

  async segmentChanged(e) {
    const id = e.detail.value
    this.treinoSelected = this.treinos.find(x => x.id == id)
    if (this.treinoSelected) {
      this.getExercicios(this.treinoSelected.id)
    }
  }
}
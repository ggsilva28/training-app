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
  public modoTreino: boolean = false

  constructor(
    private treinosService: TreinosService,
  ) {
  }

  async ionViewDidEnter() {
    await this.getTreinos()
    this.treinoSelected = (this.treinos.length) ? this.treinos[0] : null
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

  async segmentChanged(e) {
    const id = e.detail.value
    this.treinoSelected = this.treinos.find(x => x.id == id)
  }

  alternarModoTreino(){
    this.modoTreino = !this.modoTreino
  }
}
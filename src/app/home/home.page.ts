import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

import { TreinosService, treino } from '../services/treinoService';
import { ExerciciosService, exercicio } from '../services/exercicioService';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  @ViewChild("header") header: HTMLElement;

  public treinos: Partial<treino[]> = []
  public treinoSelected: treino
  public modoTreino: boolean = false

  constructor(
    private treinosService: TreinosService,
    public element: ElementRef, 
    public renderer: Renderer2
  ) {
  }

  ionViewWillEnter(){
    this.renderer.setStyle(this.header['el'], 'webkitTransition', 'top 150ms');
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

  onContentScroll(event) {
    if (event.detail.scrollTop >= 50) {
      this.renderer.setStyle(this.header['el'], 'top', '-120px');
    } else {
      this.renderer.setStyle(this.header['el'], 'top', '0px');
    }
  }
}
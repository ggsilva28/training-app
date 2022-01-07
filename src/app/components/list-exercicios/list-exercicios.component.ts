import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

import { ExerciciosService, exercicio } from 'src/app/services/exercicioService';
import { treino } from 'src/app/services/treinoService';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'list-exercicios',
  templateUrl: './list-exercicios.component.html',
  styleUrls: ['./list-exercicios.component.scss'],
})

export class ListExerciciosComponent implements OnInit {

  @Input() exercicios: Partial<exercicio[]> = []
  @Input() treino: treino
  @Input() showList: boolean = false
  @Input() modoTreino: boolean = false

  constructor(
    private exerciciosService: ExerciciosService,
    private eventsService: EventsService,
  ) { 
    this.eventsService.subscribe('getExercicios', () => {
      setTimeout(() => {
        this.getExercicios()
      }, 300)
    })
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['treino']) {
      this.getExercicios()
    }
  }

  async getExercicios() {
    if (!this.treino) {
      return []
    }
    return this.exercicios = await this.exerciciosService.getExercicio(this.treino.id)
  }

  async addExercicio() {
    await this.exerciciosService.addExercicio(this.treino.id)
  }

  async removeExercicio(exercicio_id: string) {
    await this.exerciciosService.removerExercicio(exercicio_id)
  }

  async editExercicio(exercicio_id: string) {
    await this.exerciciosService.editExercicio(exercicio_id)
  }

  alternarConcluido(exercicio_id: string) {
    const index = this.exercicios.findIndex(x => x.id == exercicio_id)
    this.exercicios[index].concluido = !this.exercicios[index].concluido;
  }

  acaoItem(exercicio_id: string) {
    if (this.modoTreino) {
      this.alternarConcluido(exercicio_id)
    } else {
      this.editExercicio(exercicio_id)
    }
  }
}

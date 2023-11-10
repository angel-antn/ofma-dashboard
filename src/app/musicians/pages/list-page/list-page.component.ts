import { Component, OnInit, ViewChild } from '@angular/core';
import { Musician } from '../../interfaces/muscian-response.inteface';
import { MusiciansService } from '../../services/musicians.service';
import { Table } from 'primeng/table';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: [],
})
export class ListPageComponent implements OnInit {
  constructor(private musiciansService: MusiciansService) {}

  musicians: Musician[] = [];
  musiciansQty: number = 0;

  //info message
  messages: Message[] = [
    {
      severity: 'info',
      summary: 'Info',
      detail:
        'Esta sección del dashboard permite gestionar a los músicos de la orquesta',
    },
  ];

  //highlighted chart
  highlightedQty: number = 0;
  nonHighlightedQty: number = 0;

  highlightedChartData: any;
  highlightedChartOptions = {
    maintainAspectRatio: false,
  };

  private initializeHighlightedChartData() {
    this.highlightedQty = this.musicians.filter(
      (musician) => musician.isHighlighted
    ).length;
    this.nonHighlightedQty = this.musiciansQty - this.highlightedQty;
    this.highlightedChartData = {
      labels: ['Destacdos', 'No destacados'],
      datasets: [
        {
          data: [this.highlightedQty, this.nonHighlightedQty],
          backgroundColor: [
            'rgba(77, 158, 88, 0.2)',
            'rgba(245, 158, 11, 0.2)',
          ],
          borderColor: ['rgb(77, 158, 88)', 'rgb(245, 158, 11)'],
          borderWidth: 1,
        },
      ],
    };
  }

  //gender chart
  maleQty: number = 0;
  femaleQty: number = 0;
  otherQty: number = 0;

  genderChartData: any;
  genderChartOptions = {
    maintainAspectRatio: false,
  };

  private initializeGenderChartData() {
    this.maleQty = this.musicians.filter(
      (musician) => musician.gender == 'hombre'
    ).length;
    this.femaleQty = this.musicians.filter(
      (musician) => musician.gender == 'mujer'
    ).length;
    this.otherQty = this.musiciansQty - (this.maleQty + this.femaleQty);

    this.genderChartData = {
      labels: ['Hombres', 'Mujeres', 'Otros'],
      datasets: [
        {
          data: [this.maleQty, this.femaleQty, this.otherQty],
          backgroundColor: [
            'rgba(0, 149, 255, 0.2)',
            'rgba(234, 75, 90, 0.2)',
            'rgba(77, 158, 88, 0.2)',
          ],
          borderColor: [
            'rgb(0, 149, 255)',
            'rgb(234, 75, 90)',
            'rgb(77, 158, 88)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }

  //table
  @ViewChild('musicianTable') musicianTable: Table | undefined;
  applyFilterGlobal($event: any) {
    this.musicianTable?.filterGlobal(
      ($event.target as HTMLInputElement).value,
      'contains'
    );
  }

  //onInit
  ngOnInit(): void {
    this.musiciansService.getMusicians().subscribe((musiciansResponse) => {
      this.musicians = musiciansResponse.result;
      this.musiciansQty = this.musicians.length;
      this.initializeHighlightedChartData();
      this.initializeGenderChartData();
    });
  }
}

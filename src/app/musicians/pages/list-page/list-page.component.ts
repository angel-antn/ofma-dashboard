import { Component, OnInit, ViewChild } from '@angular/core';
import { Musician } from '../../interfaces/muscian-response.inteface';
import { MusiciansService } from '../../services/musicians.service';
import { Table } from 'primeng/table';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: [],
  providers: [MessageService, ConfirmationService],
})
export class ListPageComponent implements OnInit {
  constructor(
    private musiciansService: MusiciansService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  dialogVisible = false;
  @ViewChild('musicianTable') musicianTable: Table | undefined;

  musicians: Musician[] = [];
  musiciansQty: number = 0;

  //toast
  generateToast(severity: 'Error' | 'Success', detail: string) {
    this.messageService.add({
      key: 'toast',
      summary: severity,
      severity: severity.toLowerCase(),
      detail: detail,
      life: 3000,
    });
  }

  //form
  file?: File;
  MusicianForm = new FormGroup({
    name: new FormControl<string>(''),
    lastname: new FormControl<string>(''),
    email: new FormControl<string>(''),
    fullname: new FormControl<string>(''),
    birthdate: new FormControl<Date | undefined>(undefined),
    startDate: new FormControl<Date | undefined>(undefined),
    description: new FormControl<string>(''),
    isHighlighted: new FormControl<boolean>(false),
    gender: new FormControl<string | undefined>(undefined),
  });

  onSubmit() {
    const regex = new RegExp(
      '^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
    );

    if (
      this.MusicianForm.invalid ||
      !this.MusicianForm.value.birthdate ||
      !this.MusicianForm.value.startDate ||
      !this.MusicianForm.value.gender
    ) {
      this.generateToast('Error', 'Hay campos obligatorios sin rellenar');
      return;
    }

    if (!regex.test(this.MusicianForm.value.email ?? '')) {
      this.generateToast('Error', 'Email no valido');
      return;
    }

    if (!this.file) {
      this.generateToast('Error', 'La imagen del músico es obligatoria');
      return;
    }

    this.musiciansService
      .createMusician(this.MusicianForm.value as Musician, this.file)
      .subscribe((res) => {
        if (res === 'unknow_err') {
          this.generateToast('Error', 'Ha ocurrido un error inesperado');
        } else if (res === 'email_err') {
          this.generateToast(
            'Error',
            'Otro músico ya tiene ese email registrado'
          );
        } else {
          this.generateToast('Success', 'Se ha creado al músico con exito');

          this.MusicianForm.reset();
          this.file = undefined;
          this.musiciansQty++;
          this.musicians.push(res as Musician);
          this.initializeHighlightedChartData();
          this.initializeGenderChartData();
          this.musicianTable?.reset();
        }
      });
  }

  //info message
  message: Message = {
    severity: 'info',
    summary: 'Info',
    detail:
      'Esta sección del dashboard permite gestionar a los músicos de la orquesta',
    closable: false,
  };

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
      labels: ['Destacados', 'No destacados'],
      datasets: [
        {
          data: [this.highlightedQty, this.nonHighlightedQty],
          backgroundColor: [
            'rgba(77, 158, 88, 0.3)',
            'rgba(245, 158, 11, 0.3)',
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
            'rgba(0, 149, 255, 0.3)',
            'rgba(234, 75, 90, 0.3)',
            'rgba(77, 158, 88, 0.3)',
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
  applyFilterGlobal($event: any) {
    this.musicianTable?.filterGlobal(
      ($event.target as HTMLInputElement).value,
      'contains'
    );
  }

  //delete
  confirmDelete(id: string) {
    this.confirmationService.confirm({
      message: '¿Esta seguro que desea borrar al músico?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.musiciansService.deleteMusician(id).subscribe((res) => {
          if (!res) {
            this.generateToast('Error', 'Ha ocurrido un error inesperado');
          } else {
            this.generateToast(
              'Success',
              'Se ha eliminado al músico con exito'
            );
            this.musicians = this.musicians.filter(
              (musician) => musician.id != id
            );
            this.musiciansQty--;
            this.initializeHighlightedChartData();
            this.initializeGenderChartData();
            this.musicianTable?.reset();
          }
        });
      },
    });
  }

  //upload webp
  uploadFile(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      if (fileList[0].type != 'image/webp') {
        this.generateToast(
          'Error',
          'Solo se pueden subir imagenes con formato WEBP'
        );
        return;
      }
      this.file = fileList[0];
    }
  }

  //onInit
  ngOnInit(): void {
    this.musiciansService.getMusicians().subscribe((musiciansResponse) => {
      this.musicians = musiciansResponse.result;
      this.musicians = this.musicians.map((musician) => {
        return {
          ...musician,
          imageUrl: `${musician.imageUrl}?${new Date().getTime()}`,
        };
      });
      this.musiciansQty = this.musicians.length;
      this.initializeHighlightedChartData();
      this.initializeGenderChartData();
    });
  }
}

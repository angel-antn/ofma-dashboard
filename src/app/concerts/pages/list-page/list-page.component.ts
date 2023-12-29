import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ConcertService } from '../../services/concerts.service';
import { Concert } from '../../interfaces/concert-response.interface';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: [],
  providers: [MessageService, ConfirmationService],
})
export class ListPageComponent {
  constructor(
    private concertService: ConcertService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  dialogVisible = false;
  @ViewChild('endedConcertTable') endedConcertTable: Table | undefined;
  @ViewChild('concertTable') concertTable: Table | undefined;

  concerts: Concert[] = [];
  endedConcerts: Concert[] = [];
  concertsQty: number = 0;
  endedConcertsQty: number = 0;

  stringToDate(str: string) {
    let date = new Date();
    let hoursFragments = str.split(':');

    date.setHours(
      hoursFragments[0] as any,
      hoursFragments[1] as any,
      hoursFragments[2] as any
    );

    return date;
  }

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
  ConcertForm = new FormGroup({
    name: new FormControl<string>(''),
    address: new FormControl<string>(''),
    startAtHour: new FormControl<Date | undefined>(undefined),
    startDate: new FormControl<Date | undefined>(undefined),
    entriesQty: new FormControl<number | undefined>(undefined),
    pricePerEntry: new FormControl<number | undefined>(undefined),
    description: new FormControl<string>(''),
  });

  onSubmit() {
    if (
      this.ConcertForm.invalid ||
      !this.ConcertForm.value.entriesQty ||
      !this.ConcertForm.value.pricePerEntry ||
      !this.ConcertForm.value.startAtHour ||
      !this.ConcertForm.value.startDate
    ) {
      this.generateToast('Error', 'Hay campos obligatorios sin rellenar');
      return;
    }

    if (!this.file) {
      this.generateToast('Error', 'La imagen del músico es obligatoria');
      return;
    }

    let startAtHour: string = `${
      this.ConcertForm.value.startAtHour.getHours() < 10 ? '0' : ''
    }${this.ConcertForm.value.startAtHour.getHours()}:${
      this.ConcertForm.value.startAtHour.getMinutes() < 10 ? '0' : ''
    }${this.ConcertForm.value.startAtHour.getMinutes()}`;

    this.concertService
      .createConcert(
        { ...this.ConcertForm.value, startAtHour } as Concert,
        this.file
      )
      .subscribe((res) => {
        if (res === 'unknow_err') {
          this.generateToast('Error', 'Ha ocurrido un error inesperado');
        } else {
          this.generateToast('Success', 'Se ha creado el concierto con exito');

          this.ConcertForm.reset();
          this.file = undefined;
          this.concertsQty++;
          this.concerts.push({
            ...(res as object),
            startAtHour: `${startAtHour}:00`,
          } as Concert);
        }
      });
  }

  //info message
  message: Message = {
    severity: 'info',
    summary: 'Info',
    detail:
      'Esta sección del dashboard permite gestionar los conciertos de la orquesta',
    closable: false,
  };

  //status charts
  openQty: number = 0;
  closedQty: number = 0;

  statusChartData: any;
  statusChartOptions = {
    maintainAspectRatio: false,
  };

  private initializeStatusChartData() {
    this.openQty = this.concerts.filter((concert) => concert.isOpen).length;
    this.closedQty = Math.abs(this.concerts.length - this.openQty);

    this.statusChartData = {
      labels: ['Activos', 'Cerrados', 'Finalizados'],
      datasets: [
        {
          data: [this.openQty, this.closedQty, this.endedConcertsQty],
          backgroundColor: [
            'rgba(77, 158, 88, 0.3)',
            'rgba(234, 75, 90, 0.3)',
            'rgba(0, 149, 255, 0.3)',
          ],
          borderColor: [
            'rgb(77, 158, 88)',
            'rgb(234, 75, 90)',
            'rgb(0, 149, 255)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }

  //table
  applyFilterGlobal($event: any) {
    this.concertTable?.filterGlobal(
      ($event.target as HTMLInputElement).value,
      'contains'
    );
  }

  applyFilterGlobalEnded($event: any) {
    this.endedConcertTable?.filterGlobal(
      ($event.target as HTMLInputElement).value,
      'contains'
    );
  }

  //delete
  confirmDelete(id: string) {
    this.confirmationService.confirm({
      message: '¿Esta seguro que desea borrar el concierto?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.concertService.deleteConcert(id).subscribe((res) => {
          if (!res) {
            this.generateToast('Error', 'Ha ocurrido un error inesperado');
          } else {
            this.generateToast(
              'Success',
              'Se ha eliminado el concierto con exito'
            );
            this.concerts = this.concerts.filter((concert) => concert.id != id);
            this.concertsQty--;
            this.endedConcertTable?.reset();
          }
        });
      },
    });
  }

  openConcert(id: string) {
    this.confirmationService.confirm({
      message: '¿Esta seguro que desea reabrir la boleteria?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.concertService.openConcert(id).subscribe((res) => {
          for (let concert of this.concerts) {
            if (concert.id === id) {
              concert.isOpen = true;
              this.closedQty--;
              this.openQty++;
              this.initializeStatusChartData();
            }
          }
        });
      },
    });
  }

  closeConcert(id: string) {
    this.confirmationService.confirm({
      message: '¿Esta seguro que desea cerrar la boleteria?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.concertService.closeConcert(id).subscribe((res) => {
          for (let concert of this.concerts) {
            if (concert.id === id) {
              concert.isOpen = false;
              this.closedQty++;
              this.openQty--;
              this.initializeStatusChartData();
            }
          }
        });
      },
    });
  }

  finishConcert(id: string) {
    this.confirmationService.confirm({
      message:
        '¿Esta seguro que quiere finalizar el concierto?, No podra deshacer esta acción',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.concertService.endConcert(id).subscribe((res) => {
          this.concerts = this.concerts.filter((concert) => {
            if (concert.id === id) {
              this.concertsQty--;
              this.endedConcerts.push(concert);
              this.endedConcertsQty++;
              this.closedQty--;
              return false;
            }
            return true;
          });
          this.initializeStatusChartData();
          this.concertTable?.reset();
          this.endedConcertTable?.reset();
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
    this.concertService.getConcerts().subscribe((concertResponse) => {
      this.concerts = concertResponse.result;
      this.concerts = this.concerts.map((concert) => {
        return {
          ...concert,
          imageUrl: `${concert.imageUrl}?${new Date().getTime()}`,
        };
      });
      this.concerts = this.concerts.filter((concert) => {
        if (concert.hasFinish) {
          this.endedConcerts.push(concert);
        }
        return !concert.hasFinish;
      });
      this.concertsQty = this.concerts.length;
      this.endedConcertsQty = this.endedConcerts.length;
      this.initializeStatusChartData();
      this.concertTable?.reset();
      this.endedConcertTable?.reset();
    });
  }
}

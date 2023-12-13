import { Component, ViewChild } from '@angular/core';
import { ConcertService } from '../../services/concerts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Concert } from '../../interfaces/concert-response.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { switchMap } from 'rxjs';
import { Table } from 'primeng/table';
import { Musician } from 'src/app/musicians/interfaces/muscian-response.inteface';
import { MusiciansService } from 'src/app/musicians/services/musicians.service';

@Component({
  selector: 'app-concert-page',
  templateUrl: './concert-page.component.html',
  styles: [],
  providers: [MessageService, ConfirmationService],
})
export class ConcertPageComponent {
  constructor(
    private concertService: ConcertService,
    private musiciansService: MusiciansService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  public concert?: Concert;
  public musicians: Musician[] = [];

  editConcertDialogVisible = false;
  addMusicianDialogVisible = false;

  @ViewChild('concertMusicianTable') concertMusicianTable: Table | undefined;

  applyFilterGlobal($event: any) {
    this.concertMusicianTable?.filterGlobal(
      ($event.target as HTMLInputElement).value,
      'contains'
    );
  }

  getMusicianFullname(id: string | null | undefined) {
    let fullname = '';
    this.musicians.forEach((musician) => {
      if (musician.id === id) {
        fullname = musician?.fullname ?? '';
      }
    });
    return fullname;
  }

  //info message
  message: Message = {
    severity: 'info',
    summary: 'Info',
    detail:
      'Esta sección del dashboard permite gestionar la informacion de un concierto de la orquesta',
    closable: false,
  };

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

  MusicianForm = new FormGroup({
    role: new FormControl<string>(''),
    musician: new FormControl<Musician | undefined>(undefined),
  });

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

    let startAtHour: string = `${
      this.ConcertForm.value.startAtHour.getHours() < 10 ? '0' : ''
    }${this.ConcertForm.value.startAtHour.getHours()}:${
      this.ConcertForm.value.startAtHour.getMinutes() < 10 ? '0' : ''
    }${this.ConcertForm.value.startAtHour.getMinutes()}`;

    this.concertService
      .editConcert(
        {
          ...this.ConcertForm.value,
          startAtHour,
          id: this.concert?.id,
        } as Concert,
        this.file
      )
      .subscribe((res) => {
        if (res === 'unknow_err') {
          this.generateToast('Error', 'Ha ocurrido un error inesperado');
        } else {
          this.concert = res as Concert;
          this.concert.imageUrl = `${
            this.concert.imageUrl
          }?${new Date().getTime()}`;
          this.generateToast('Success', 'Se ha editado el concierto con exito');
          this.file = undefined;
        }
      });
  }

  onConcertMusicianSubmit() {
    if (this.MusicianForm.invalid || !this.MusicianForm.value.musician) {
      this.generateToast('Error', 'Hay campos obligatorios sin rellenar');
      return;
    }

    this.concertService
      .addMusician(
        this.MusicianForm.value.musician.id ?? '',
        this.concert?.id ?? '',
        this.MusicianForm.value.role ?? ''
      )
      .subscribe((res) => {
        if (!res) {
          this.generateToast('Error', 'Ha ocurrido un error inesperado');
        } else {
          this.concert?.concertMusician.push({
            id: res.id,
            fullname: this.MusicianForm.value.musician?.fullname ?? '',
            imageUrl: this.MusicianForm.value.musician?.imageUrl ?? '',
            lastname: this.MusicianForm.value.musician?.lastname ?? '',
            name: this.MusicianForm.value.musician?.name ?? '',
            musicianId: this.MusicianForm.value.musician?.id ?? '',
            role: this.MusicianForm.value.role ?? '',
          });
          this.generateToast(
            'Success',
            'Se ha un músico al concierto con exito'
          );
          this.MusicianForm.reset();
        }
      });
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.concertService.getConcertById(id)))
      .subscribe((concert) => {
        if (!concert) return this.router.navigate(['/admin/concerts/list']);
        const startAtHour = new Date();
        const hourArray = concert.startAtHour.split(':');
        startAtHour.setHours(Number(hourArray[0]), Number(hourArray[1]));
        this.ConcertForm.reset({
          name: concert.name,
          address: concert.address,
          description: concert.description,
          entriesQty: concert.entriesQty,
          pricePerEntry: concert.pricePerEntry,
          startAtHour,
          startDate: new Date(concert.startDate),
        });
        return (this.concert = concert);
      });

    this.musiciansService.getMusicians().subscribe((musiciansResponse) => {
      this.musicians = musiciansResponse.result;
      this.musicians = this.musicians.map((musician) => musician);
    });
  }
}

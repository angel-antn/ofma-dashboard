import { Component, OnInit } from '@angular/core';
import { MusiciansService } from '../../services/musicians.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Musician } from '../../interfaces/muscian-response.inteface';
import { Message, MessageService } from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-musician-page',
  templateUrl: './musician-page.component.html',
  styles: [],
  providers: [MessageService],
})
export class MusicianPageComponent implements OnInit {
  constructor(
    private musiciansService: MusiciansService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  public musician?: Musician;

  dialogVisible = false;

  //info message
  message: Message = {
    severity: 'info',
    summary: 'Info',
    detail:
      'Esta sección del dashboard permite gestionar la informacion de un músico de la orquesta',
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

    this.musiciansService
      .editMusician(
        {
          ...this.MusicianForm.value,
          id: this.musician?.id,
        } as Musician,
        this.file
      )
      .subscribe((res) => {
        if (res === 'unknow_err') {
          this.generateToast('Error', 'Ha ocurrido un error inesperado');
        } else if (res === 'email_err') {
          this.generateToast(
            'Error',
            'Otro músico ya tiene ese email registrado'
          );
        } else {
          this.musician = res as Musician;
          this.musician.imageUrl = `${
            this.musician.imageUrl
          }?${new Date().getTime()}`;
          this.generateToast('Success', 'Se ha editado al músico con exito');
          this.file = undefined;
        }
      });
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.musiciansService.getMusicianById(id)))
      .subscribe((musician) => {
        if (!musician) return this.router.navigate(['/admin/musicians/list']);
        this.MusicianForm.reset({
          name: musician.name,
          lastname: musician.lastname,
          email: musician.email,
          description: musician.description,
          gender: musician.gender,
          isHighlighted: musician.isHighlighted,
          birthdate: new Date(musician.birthdate),
          startDate: new Date(musician.startDate),
        });
        return (this.musician = musician);
      });
  }
}

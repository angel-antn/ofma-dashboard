import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { switchMap } from 'rxjs';
import { ContentService } from '../../services/content.service';
import { MusiciansService } from 'src/app/musicians/services/musicians.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Content } from '../../interfaces/content-response.interface';
import { Musician } from 'src/app/musicians/interfaces/muscian-response.inteface';
import { Table } from 'primeng/table';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-content-page',
  templateUrl: './content-page.component.html',
  styleUrls: [],
  providers: [MessageService, ConfirmationService],
})
export class ContentPageComponent {
  constructor(
    private contentService: ContentService,
    private musiciansService: MusiciansService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  public content?: Content;
  public musicians: Musician[] = [];

  editContentDialogVisible = false;
  addMusicianDialogVisible = false;
  editMusicianDialogVisible = false;
  playVideoDialogVisible = false;

  selectedMusicianToEdit = '';

  @ViewChild('contentMusicianTable') contentMusicianTable: Table | undefined;

  applyFilterGlobal($event: any) {
    this.contentMusicianTable?.filterGlobal(
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
      'Esta sección del dashboard permite gestionar la información de un contenido exclusivo de la orquesta',
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
  ContentForm = new FormGroup({
    name: new FormControl<string>(''),
    category: new FormControl<string | undefined>(undefined),
    isHighlighted: new FormControl<boolean>(false),
    description: new FormControl<string>(''),
  });

  MusicianForm = new FormGroup({
    role: new FormControl<string>(''),
    musician: new FormControl<Musician | undefined>(undefined),
  });

  EditMusicianForm = new FormGroup({
    role: new FormControl<string>(''),
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

  onEditConcertSubmit() {
    if (this.ContentForm.invalid || !this.ContentForm.value.category) {
      this.generateToast('Error', 'Hay campos obligatorios sin rellenar');
      return;
    }

    this.contentService
      .editContent(
        { ...this.ContentForm.value, id: this.content?.id } as Content,
        this.file
      )
      .subscribe((res) => {
        if (res === 'unknow_err') {
          this.generateToast('Error', 'Ha ocurrido un error inesperado');
        } else {
          this.content = res as Content;
          this.content.imageUrl = `${
            this.content.imageUrl
          }?${new Date().getTime()}`;
          this.generateToast('Success', 'Se ha editado el contenido con exito');
          this.file = undefined;
        }
      });
  }

  onConcertMusicianSubmit() {
    if (this.MusicianForm.invalid || !this.MusicianForm.value.musician) {
      this.generateToast('Error', 'Hay campos obligatorios sin rellenar');
      return;
    }

    this.contentService
      .addMusician(
        this.MusicianForm.value.musician.id ?? '',
        this.content?.id ?? '',
        this.MusicianForm.value.role ?? ''
      )
      .subscribe((res) => {
        if (!res) {
          this.generateToast('Error', 'Ha ocurrido un error inesperado');
        } else {
          this.content?.exclusiveContentMusician.push({
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

  prepareToShowEditMusianDialog(id: string, role: string) {
    this.selectedMusicianToEdit = id;
    this.EditMusicianForm.reset({ role });
    this.editMusicianDialogVisible = true;
  }

  onConcertMusicianEditSubmit() {
    if (this.EditMusicianForm.invalid) {
      this.generateToast('Error', 'Hay campos obligatorios sin rellenar');
      return;
    }

    this.contentService
      .editMusician(
        this.selectedMusicianToEdit,
        this.EditMusicianForm.value.role ?? ''
      )
      .subscribe((res) => {
        if (!res) {
          this.generateToast('Error', 'Ha ocurrido un error inesperado');
        } else {
          this.content!.exclusiveContentMusician =
            this.content!.exclusiveContentMusician.map((musician) => {
              if (this.selectedMusicianToEdit === musician.id) {
                musician.role = this.EditMusicianForm.value.role ?? '';
                return musician;
              } else {
                return musician;
              }
            });

          this.generateToast(
            'Success',
            'Se ha un músico al concierto con exito'
          );
          this.EditMusicianForm.reset();
          this.selectedMusicianToEdit = '';
          this.editMusicianDialogVisible = false;
        }
      });
  }

  confirmMusicianDelete(id: string) {
    this.confirmationService.confirm({
      message: '¿Esta seguro que desea borrar al músico del concierto?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.contentService.deleteMusician(id).subscribe((res) => {
          if (!res) {
            this.generateToast('Error', 'Ha ocurrido un error inesperado');
          } else {
            this.generateToast(
              'Success',
              'Se ha eliminado el concierto con exito'
            );
            this.content!.exclusiveContentMusician =
              this.content!.exclusiveContentMusician.filter(
                (musician) => musician.id != id
              );
            this.contentMusicianTable?.reset();
          }
        });
      },
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.contentService.getContentById(id)))
      .subscribe((content) => {
        if (!content) return this.router.navigate(['/admin/concerts/list']);
        this.ContentForm.reset({
          category: content.category,
          description: content?.description,
          isHighlighted: content?.isHighlighted,
          name: content.name,
        });
        return (this.content = content);
      });

    this.musiciansService.getMusicians().subscribe((musiciansResponse) => {
      this.musicians = musiciansResponse.result;
      this.musicians = this.musicians.map((musician) => musician);
    });
  }
}

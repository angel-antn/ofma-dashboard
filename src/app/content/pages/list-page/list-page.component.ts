import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { ContentService } from '../../services/content.service';
import { Table } from 'primeng/table';
import { Content } from '../../interfaces/content-response.interface';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: [],
  providers: [MessageService, ConfirmationService],
})
export class ListPageComponent {
  constructor(
    private contentService: ContentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  dialogVisible = false;
  videoUploadDialogVisible = false;

  toPublishId: string = '';

  @ViewChild('draftContentTable') draftContentTable: Table | undefined;
  @ViewChild('contentTable') contentTable: Table | undefined;

  allContent: Content[] = [];
  allContentQty = 0;

  publishedContent: Content[] = [];
  publishedContentQty: number = 0;

  draftContent: Content[] = [];
  draftContentQty: number = 0;

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

  fileVideo?: File;

  //form
  file?: File;
  ContentForm = new FormGroup({
    name: new FormControl<string>(''),
    category: new FormControl<string | undefined>(undefined),
    isHighlighted: new FormControl<boolean>(false),
    description: new FormControl<string>(''),
  });

  changeShownStatus(id: string, isShown: boolean) {
    this.contentService.changeShownStatus(id, isShown).subscribe((res) => {
      if (res === 'unknow_err') {
        this.generateToast('Error', 'Ha ocurrido un error inesperado');
      } else {
        this.generateToast(
          'Success',
          isShown
            ? 'Se ha publicado el contenido con exito'
            : 'Se ha ocultado el contenido con exito'
        );

        this.publishedContent = this.publishedContent.map((content) => {
          if (content.id == id) {
            content.isShown = isShown;
            return content;
          }
          return content;
        });

        this.initializeCategoryChartData();
        this.initializeStatusChartData();
        this.initializeHighlighteChartData();
        this.initializeShownChartData();

        this.contentTable?.reset();
      }
    });
  }

  publishVideo() {
    if (!this.fileVideo) {
      this.generateToast(
        'Error',
        'Debe seleccionar el video que desea publicar'
      );
      return;
    }

    this.contentService
      .publishVideo(this.toPublishId, this.fileVideo)
      .subscribe((res) => {
        if (res === 'unknow_err') {
          this.generateToast('Error', 'Ha ocurrido un error inesperado');
        } else {
          this.generateToast(
            'Success',
            'Se ha publicado el contenido con exito'
          );

          this.fileVideo = undefined;
          this.draftContentQty--;
          this.publishedContentQty++;

          this.draftContent = this.draftContent.filter((content) => {
            if (content.id == this.toPublishId) {
              this.publishedContent.push(content);
              return false;
            }
            return true;
          });

          this.initializeCategoryChartData();
          this.initializeStatusChartData();
          this.initializeHighlighteChartData();
          this.initializeShownChartData();

          this.contentTable?.reset();
          this.draftContentTable?.reset();
        }
      });
  }

  onSubmit() {
    if (this.ContentForm.invalid || !this.ContentForm.value.category) {
      this.generateToast('Error', 'Hay campos obligatorios sin rellenar');
      return;
    }

    if (!this.file) {
      this.generateToast('Error', 'La imagen del contenido es obligatoria');
      return;
    }

    this.contentService
      .createContent(this.ContentForm.value as Content, this.file)
      .subscribe((res) => {
        if (res === 'unknow_err') {
          this.generateToast('Error', 'Ha ocurrido un error inesperado');
        } else {
          this.generateToast('Success', 'Se ha creado el contenido con exito');

          this.ContentForm.reset();
          this.file = undefined;
          this.draftContentQty++;
          this.draftContent.push(res as Content);
          this.allContent.push(res as Content);
          this.allContentQty++;

          this.initializeCategoryChartData();
          this.initializeStatusChartData();
          this.initializeHighlighteChartData();
          this.initializeShownChartData();

          this.contentTable?.reset();
          this.draftContentTable?.reset();
        }
      });
  }

  //info message
  message: Message = {
    severity: 'info',
    summary: 'Info',
    detail:
      'Esta sección del dashboard permite gestionar el contenido exclusivo de la orquesta',
    closable: false,
  };

  statusChartData: any;
  statusChartOptions = {
    maintainAspectRatio: false,
  };

  private initializeStatusChartData() {
    this.statusChartData = {
      labels: ['Publicados', 'Borradores'],
      datasets: [
        {
          data: [this.publishedContent.length, this.draftContent.length],
          backgroundColor: ['rgba(77, 158, 88, 0.3)', 'rgba(0, 149, 255, 0.3)'],
          borderColor: ['rgb(77, 158, 88)', 'rgb(0, 149, 255)'],
          borderWidth: 1,
        },
      ],
    };
  }

  categoryChartData: any;
  categoryChartOptions = {
    maintainAspectRatio: false,
  };

  private initializeCategoryChartData() {
    const interviewQty = this.allContent.filter((content) => {
      if (content.category == 'entrevista') return true;
      return false;
    }).length;
    const concertQty = Math.abs(interviewQty - this.allContentQty);
    this.categoryChartData = {
      labels: ['Conciertos', 'Entrevistas'],
      datasets: [
        {
          data: [concertQty, interviewQty],
          backgroundColor: [
            'rgba(0, 149, 255, 0.3)',
            'rgba(245, 158, 11, 0.3)',
          ],
          borderColor: ['rgb(0, 149, 255)', 'rgb(245, 158, 11)'],
          borderWidth: 1,
        },
      ],
    };
  }

  highlighteChartData: any;
  highlighteChartOptions = {
    maintainAspectRatio: false,
  };

  private initializeHighlighteChartData() {
    const highlighteQty = this.allContent.filter(
      (content) => content.isHighlighted
    ).length;
    const nonHighlighteQty = Math.abs(highlighteQty - this.allContentQty);
    this.highlighteChartData = {
      labels: ['Destacados', 'No destacados'],
      datasets: [
        {
          data: [highlighteQty, nonHighlighteQty],
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

  shownChartData: any;
  shownChartOptions = {
    maintainAspectRatio: false,
  };

  private initializeShownChartData() {
    const shownQty = this.publishedContent.filter(
      (content) => content.isShown
    ).length;
    const nonShownQty = Math.abs(shownQty - this.publishedContentQty);
    this.shownChartData = {
      labels: ['Visibles', 'No visibles'],
      datasets: [
        {
          data: [shownQty, nonShownQty],
          backgroundColor: ['rgba(0, 149, 255, 0.3)', 'rgba(234, 75, 90, 0.3)'],
          borderColor: ['rgb(0, 149, 255)', 'rgb(234, 75, 90)'],
          borderWidth: 1,
        },
      ],
    };
  }

  //table
  applyFilterGlobalDraft($event: any) {
    this.draftContentTable?.filterGlobal(
      ($event.target as HTMLInputElement).value,
      'contains'
    );
  }

  applyFilterGlobal($event: any) {
    this.contentTable?.filterGlobal(
      ($event.target as HTMLInputElement).value,
      'contains'
    );
  }

  //delete
  confirmDelete(id: string, table: 'draft' | 'published') {
    this.confirmationService.confirm({
      message: '¿Esta seguro que desea borrar el contenido?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.contentService.deleteContent(id).subscribe((res) => {
          if (!res) {
            this.generateToast('Error', 'Ha ocurrido un error inesperado');
          } else {
            this.generateToast(
              'Success',
              'Se ha eliminado al músico con exito'
            );

            if (table == 'draft') {
              this.draftContent = this.draftContent.filter(
                (content) => content.id != id
              );
              this.draftContentQty--;
            } else {
              this.publishedContent = this.publishedContent.filter(
                (content) => content.id != id
              );
              this.publishedContentQty--;
            }

            this.initializeStatusChartData();
            this.initializeCategoryChartData();
            this.initializeHighlighteChartData();
            this.initializeShownChartData();

            this.contentTable?.reset();
            this.draftContentTable?.reset();
          }
        });
      },
    });
  }

  prepareToPublish(id: string) {
    this.videoUploadDialogVisible = true;
    this.toPublishId = id;
    console.log(this.toPublishId);
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

  //upload webp
  uploadVideo(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      if (fileList[0].type != 'video/mp4') {
        this.generateToast(
          'Error',
          'Solo se pueden subir videos con formato MP4'
        );
        return;
      }
      this.fileVideo = fileList[0];
      console.log(this.fileVideo.name);
    }
  }

  //onInit
  ngOnInit(): void {
    this.contentService.getContent().subscribe((contentResponse) => {
      this.allContent = contentResponse.result;
      this.allContentQty = this.allContent.length;
      this.publishedContent = this.allContent.map((content) => {
        return {
          ...content,
          imageUrl: `${content.imageUrl}?${new Date().getTime()}`,
        };
      });
      this.publishedContent = this.publishedContent.filter((content) => {
        if (content.isDraft) {
          this.draftContent.push(content);
        }
        return !content.isDraft;
      });
      this.publishedContentQty = this.publishedContent.length;
      this.draftContentQty = this.draftContent.length;

      this.initializeStatusChartData();
      this.initializeCategoryChartData();
      this.initializeHighlighteChartData();
      this.initializeShownChartData();

      this.draftContentTable?.reset();
      this.contentTable?.reset();
    });
  }
}

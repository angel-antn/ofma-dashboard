import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Collaborator } from '../../interfaces/collaborator-response.interface';
import { CollaboratorService } from '../../services/collaborator.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: [],
  providers: [MessageService, ConfirmationService],
})
export class ListPageComponent {
  constructor(
    private collaboratorService: CollaboratorService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  dialogVisible = false;
  @ViewChild('collaboratorTable') collaboratorTable: Table | undefined;

  collaborators: Collaborator[] = [];

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
  CollaboratorForm = new FormGroup({
    email: new FormControl<string>(''),
  });

  onSubmit() {
    const regex = new RegExp(
      '^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
    );

    if (this.CollaboratorForm.invalid) {
      this.generateToast('Error', 'Hay campos obligatorios sin rellenar');
      return;
    }

    if (!regex.test(this.CollaboratorForm.value.email ?? '')) {
      this.generateToast('Error', 'Email no valido');
      return;
    }

    this.collaboratorService
      .createCollaborator(this.CollaboratorForm.value.email ?? '')
      .subscribe((res) => {
        if (res === 'unknow_err') {
          this.generateToast('Error', 'Ha ocurrido un error inesperado');
        } else if (res === 'unknow_user') {
          this.generateToast(
            'Error',
            'No hay ningun usuario con ese email registrado'
          );
        } else {
          this.generateToast('Success', 'Se ha creado al músico con exito');

          this.collaboratorService
            .getCollaborators()
            .subscribe((collaboratorsResponse) => {
              this.collaborators = collaboratorsResponse.result;
              this.CollaboratorForm.reset();
              this.collaboratorTable?.reset();
            });
        }
      });
  }

  //info message
  message: Message = {
    severity: 'info',
    summary: 'Info',
    detail:
      'Esta sección del dashboard permite gestionar a los colaboradores de la orquesta',
    closable: false,
  };

  //table
  applyFilterGlobal($event: any) {
    this.collaboratorTable?.filterGlobal(
      ($event.target as HTMLInputElement).value,
      'contains'
    );
  }

  //delete
  confirmDelete(email: string) {
    this.confirmationService.confirm({
      message: '¿Esta seguro que desea borrar al colaborador?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.collaboratorService.deleteCollaborator(email).subscribe((res) => {
          if (!res) {
            this.generateToast('Error', 'Ha ocurrido un error inesperado');
          } else {
            this.generateToast(
              'Success',
              'Se ha eliminado al colaborador con exito'
            );
            this.collaborators = this.collaborators.filter(
              (collaborator) => collaborator.email != email
            );
            this.collaboratorTable?.reset();
          }
        });
      },
    });
  }

  //onInit
  ngOnInit(): void {
    this.collaboratorService
      .getCollaborators()
      .subscribe((collaboratorsResponse) => {
        this.collaborators = collaboratorsResponse.result;
      });
  }
}

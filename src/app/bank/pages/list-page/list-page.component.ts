import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { BankAccountService } from '../../services/bank-account.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: [],
  providers: [MessageService, ConfirmationService],
})
export class ListPageComponent {
  constructor(
    private bankService: BankAccountService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  dialogVisible = false;

  @ViewChild('transferTable') transferTable: Table | undefined;
  @ViewChild('mobilePayTable') mobilePayTable: Table | undefined;
  @ViewChild('zelleTable') zelleTable: Table | undefined;

  //collaborators: Collaborator[] = [];

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

  //info message
  message: Message = {
    severity: 'info',
    summary: 'Info',
    detail:
      'Esta sección del dashboard permite gestionar a las cuentas bancarias de la orquesta',
    closable: false,
  };

  //table
  applyFilterGlobal($event: any) {
    this.transferTable?.filterGlobal(
      ($event.target as HTMLInputElement).value,
      'contains'
    );
  }

  //onInit
  ngOnInit(): void {
    // this.collaboratorService
    //   .getCollaborators()
    //   .subscribe((collaboratorsResponse) => {
    //     this.collaborators = collaboratorsResponse.result;
    //   });
  }
}

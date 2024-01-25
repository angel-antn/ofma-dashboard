import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { BankAccountService } from '../../services/bank-account.service';
import { BankService } from '../../services/bank.service';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { forkJoin } from 'rxjs';
import { BankAccountResponse } from '../../interfaces/bank-account-response.interface';
import { BankResponse } from '../../interfaces/bank-reponse.interface';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: [],
  providers: [MessageService, ConfirmationService],
})
export class ListPageComponent {
  constructor(
    private bankAccountService: BankAccountService,
    private bankService: BankService,
    private exchangeRateService: ExchangeRateService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  dialogVisible = false;

  bankAccounts?: BankAccountResponse;
  banks?: BankResponse;
  exchangeRate: any = [];

  @ViewChild('transferTable') transferTable: Table | undefined;
  @ViewChild('mobilePayTable') mobilePayTable: Table | undefined;
  @ViewChild('zelleTable') zelleTable: Table | undefined;

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

  accountsChartData: any;
  accountsChartOptions = {
    maintainAspectRatio: false,
  };

  private initializeAccountsChartData() {
    this.accountsChartData = {
      labels: ['Transferencia', 'Pago móvil', 'Zelle'],
      datasets: [
        {
          data: [
            this.bankAccounts?.transferBankAccounts.result.length,
            this.bankAccounts?.mobilePayBankAccounts.result.length,
            this.bankAccounts?.zelleBankAccounts.result.length,
          ],
          backgroundColor: [
            'rgba(77, 158, 88, 0.3)',
            'rgba(0, 149, 255, 0.3)',
            'rgba(234, 75, 90, 0.3)',
          ],
          borderColor: [
            'rgb(77, 158, 88)',
            'rgb(0, 149, 255)',
            'rgb(234, 75, 90)',
          ],
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
    let shownQty = 0;
    let nonShownQty = 0;
    this.bankAccounts?.transferBankAccounts.result.forEach((bankAccount) => {
      if (bankAccount.isShown == true) {
        shownQty++;
      }
      nonShownQty++;
    });
    this.bankAccounts?.mobilePayBankAccounts.result.forEach((bankAccount) => {
      if (bankAccount.isShown == true) {
        shownQty++;
      }
      nonShownQty++;
    });
    this.bankAccounts?.zelleBankAccounts.result.forEach((bankAccount) => {
      if (bankAccount.isShown == true) {
        shownQty++;
      }
      nonShownQty++;
    });
    nonShownQty = Math.abs(shownQty - nonShownQty);
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
  applyFilterGlobal($event: any) {
    this.transferTable?.filterGlobal(
      ($event.target as HTMLInputElement).value,
      'contains'
    );
  }

  //onInit
  ngOnInit(): void {
    forkJoin({
      bankAccounts: this.bankAccountService.getBankAccounts(),
      exchangeRate: this.exchangeRateService.getLastExchangeRate(),
      banks: this.bankService.getBanks(),
    }).subscribe(({ bankAccounts, exchangeRate, banks }) => {
      this.bankAccounts = bankAccounts;
      // this.exchangeRate = exchangeRate.result;
      this.banks = banks.result;
      this.initializeAccountsChartData();
      this.initializeShownChartData();
    });
  }
}

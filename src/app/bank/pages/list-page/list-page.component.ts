import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { BankAccountService } from '../../services/bank-account.service';
import { BankService } from '../../services/bank.service';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { forkJoin } from 'rxjs';
import {
  BankAccountResponse,
  MobilePayBankAccountsResult,
  TransferBankAccountsResult,
  ZelleBankAccountsResult,
} from '../../interfaces/bank-account-response.interface';
import { BankResponse } from '../../interfaces/bank-reponse.interface';
import { ExchangeRateResponse } from '../../interfaces/exchange-rate-response.interface';

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

  numericOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  dialogTransferVisible = false;
  dialogMobilePayVisible = false;
  dialogZelleVisible = false;
  dialogExchangeRateVisible = false;

  dialogAliasTransferVisible = false;
  dialogAliasMobilePayVisible = false;
  dialogAliasZelleVisible = false;

  bankAccounts?: BankAccountResponse;
  banks?: BankResponse;
  exchangeRate?: ExchangeRateResponse;

  selectedId: string | undefined;

  bankOptions: String[] = [];
  bankCodes: String[] = [];

  @ViewChild('transferTable') transferTable: Table | undefined;
  @ViewChild('mobilePayTable') mobilePayTable: Table | undefined;
  @ViewChild('zelleTable') zelleTable: Table | undefined;

  prepareUpdateAlias(type: 'zelle' | 'transfer' | 'mobile-pay', id: string) {
    this.selectedId = id;
    switch (type) {
      case 'transfer':
        this.dialogAliasTransferVisible = true;
        break;
      case 'mobile-pay':
        this.dialogAliasMobilePayVisible = true;
        break;
      case 'zelle':
        this.dialogAliasZelleVisible = true;
        break;
    }
  }

  updateShownAccount(
    type: 'zelle' | 'transfer' | 'mobile-pay',
    bankAccount:
      | TransferBankAccountsResult
      | MobilePayBankAccountsResult
      | ZelleBankAccountsResult,
    isShown: boolean | undefined
  ) {
    this.confirmationService.confirm({
      message: `Seguro desea ${isShown ? 'mostrar' : 'ocultar'} la cuenta`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.bankAccountService
          .updateBankAccount(bankAccount.id, type, undefined, isShown)
          .subscribe((res) => {
            if (res === 'unknow_err') {
              this.generateToast('Error', 'Ha ocurrido un error inesperado');
            } else {
              this.generateToast(
                'Success',
                'Se ha actualizado la cuenta con exito'
              );
              if (type == 'transfer') {
                this.bankAccounts!.transferBankAccounts.result =
                  this.bankAccounts!.transferBankAccounts.result.map(
                    (oldBankAccount) => {
                      if (oldBankAccount.id == bankAccount.id) {
                        return {
                          ...oldBankAccount,
                          isShown,
                        } as TransferBankAccountsResult;
                      }
                      return oldBankAccount;
                    }
                  );
              } else if (type == 'mobile-pay') {
                this.bankAccounts!.mobilePayBankAccounts.result =
                  this.bankAccounts!.mobilePayBankAccounts.result.map(
                    (oldBankAccount) => {
                      if (oldBankAccount.id == bankAccount.id) {
                        return {
                          ...oldBankAccount,
                          isShown,
                        } as MobilePayBankAccountsResult;
                      }
                      return oldBankAccount;
                    }
                  );
              } else {
                this.bankAccounts!.zelleBankAccounts.result =
                  this.bankAccounts!.zelleBankAccounts.result.map(
                    (oldBankAccount) => {
                      if (oldBankAccount.id == bankAccount.id) {
                        return {
                          ...oldBankAccount,
                          isShown,
                        } as ZelleBankAccountsResult;
                      }
                      return oldBankAccount;
                    }
                  );
              }
            }
          });
      },
    });
  }

  deleteAccount(
    type: 'zelle' | 'transfer' | 'mobile-pay',
    bankAccount:
      | TransferBankAccountsResult
      | MobilePayBankAccountsResult
      | ZelleBankAccountsResult
  ) {
    this.confirmationService.confirm({
      message: 'Seguro desea eliminar la cuenta',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.bankAccountService
          .deleteBankAccount(bankAccount.id, type)
          .subscribe((res) => {
            if (res === 'unknow_err') {
              this.generateToast('Error', 'Ha ocurrido un error inesperado');
            } else {
              this.generateToast(
                'Success',
                'Se ha eliminado la cuenta con exito'
              );
              if (type == 'transfer') {
                this.bankAccounts!.transferBankAccounts.result =
                  this.bankAccounts!.transferBankAccounts.result.filter(
                    (oldBankAccount) => {
                      if (oldBankAccount.id == bankAccount.id) {
                        return false;
                      }
                      return true;
                    }
                  );
                this.bankAccounts!.transferBankAccounts.totalCount =
                  this.bankAccounts!.transferBankAccounts.totalCount - 1;
              } else if (type == 'mobile-pay') {
                this.bankAccounts!.mobilePayBankAccounts.result =
                  this.bankAccounts!.mobilePayBankAccounts.result.filter(
                    (oldBankAccount) => {
                      if (oldBankAccount.id == bankAccount.id) {
                        return false;
                      }
                      return true;
                    }
                  );
                this.bankAccounts!.mobilePayBankAccounts.totalCount =
                  this.bankAccounts!.mobilePayBankAccounts.totalCount - 1;
              } else {
                this.bankAccounts!.zelleBankAccounts.result =
                  this.bankAccounts!.zelleBankAccounts.result.filter(
                    (oldBankAccount) => {
                      if (oldBankAccount.id == bankAccount.id) {
                        return false;
                      }
                      return true;
                    }
                  );
                this.bankAccounts!.zelleBankAccounts.totalCount =
                  this.bankAccounts!.zelleBankAccounts.totalCount - 1;
              }
            }
          });
      },
    });
  }

  //edit transfer
  AliasTransferForm = new FormGroup({
    alias: new FormControl<string | undefined>(undefined),
  });

  onSubmitAliasTransfer() {
    if (this.AliasTransferForm.invalid) {
      this.generateToast('Error', 'Hay campos obligatorios sin rellenar');
      return;
    }

    this.bankAccountService
      .updateBankAccount(
        this.selectedId ?? '',
        'transfer',
        this.AliasTransferForm.value.alias ?? '',
        undefined
      )
      .subscribe((res) => {
        if (res === 'unknow_err') {
          this.generateToast('Error', 'Ha ocurrido un error inesperado');
        } else {
          this.generateToast('Success', 'Se editado la cuenta con exito');

          this.bankAccounts!.transferBankAccounts.result =
            this.bankAccounts!.transferBankAccounts.result.map(
              (oldBankAccount) => {
                if (oldBankAccount.id == this.selectedId) {
                  return {
                    ...oldBankAccount,
                    accountAlias: this.AliasTransferForm.value.alias,
                  } as TransferBankAccountsResult;
                }
                return oldBankAccount;
              }
            );
          this.TransferForm.reset();
        }
      });
  }

  //edit pago movil
  AliasMobilePayForm = new FormGroup({
    alias: new FormControl<string | undefined>(undefined),
  });

  onSubmitAliasMobilePay() {
    if (this.AliasMobilePayForm.invalid) {
      this.generateToast('Error', 'Hay campos obligatorios sin rellenar');
      return;
    }

    this.bankAccountService
      .updateBankAccount(
        this.selectedId ?? '',
        'mobile-pay',
        this.AliasMobilePayForm.value.alias ?? '',
        undefined
      )
      .subscribe((res) => {
        if (res === 'unknow_err') {
          this.generateToast('Error', 'Ha ocurrido un error inesperado');
        } else {
          this.generateToast('Success', 'Se ha editado la cuenta con exito');

          this.bankAccounts!.mobilePayBankAccounts.result =
            this.bankAccounts!.mobilePayBankAccounts.result.map(
              (oldBankAccount) => {
                if (oldBankAccount.id == this.selectedId) {
                  return {
                    ...oldBankAccount,
                    accountAlias: this.AliasMobilePayForm.value.alias,
                  } as MobilePayBankAccountsResult;
                }
                return oldBankAccount;
              }
            );
          this.TransferForm.reset();
        }
      });
  }

  //edit zelle
  AliasZelleForm = new FormGroup({
    alias: new FormControl<string | undefined>(undefined),
  });

  onSubmitAliasZelle() {
    if (this.AliasZelleForm.invalid) {
      this.generateToast('Error', 'Hay campos obligatorios sin rellenar');
      return;
    }

    this.bankAccountService
      .updateBankAccount(
        this.selectedId ?? '',
        'zelle',
        this.AliasZelleForm.value.alias ?? '',
        undefined
      )
      .subscribe((res) => {
        if (res === 'unknow_err') {
          this.generateToast('Error', 'Ha ocurrido un error inesperado');
        } else {
          this.generateToast('Success', 'Se ha editado la cuenta con exito');

          this.bankAccounts!.zelleBankAccounts.result =
            this.bankAccounts!.zelleBankAccounts.result.map(
              (oldBankAccount) => {
                if (oldBankAccount.id == this.selectedId) {
                  return {
                    ...oldBankAccount,
                    accountAlias: this.AliasZelleForm.value.alias,
                  } as ZelleBankAccountsResult;
                }
                return oldBankAccount;
              }
            );
          this.TransferForm.reset();
        }
      });
  }

  //form
  ExchangeRateForm = new FormGroup({
    rate: new FormControl<number | undefined>(undefined),
  });

  onSubmitExchangeRate() {
    if (this.ExchangeRateForm.invalid || !this.ExchangeRateForm.value.rate) {
      this.generateToast('Error', 'Hay campos obligatorios sin rellenar');
      return;
    }

    this.exchangeRateService
      .updateRateExchange(this.ExchangeRateForm.value.rate)
      .subscribe((res) => {
        if (res === 'unknow_err') {
          this.generateToast('Error', 'Ha ocurrido un error inesperado');
        } else {
          this.generateToast('Success', 'Se ha creado el concierto con exito');

          this.exchangeRate = res as ExchangeRateResponse;
          this.ExchangeRateForm.reset();
        }
      });
  }

  //form
  ZelleForm = new FormGroup({
    accountAlias: new FormControl<string | undefined>(undefined),
    accountHolderName: new FormControl<string | undefined>(undefined),
    accountHolderEmail: new FormControl<string | undefined>(undefined),
  });

  onSubmitZelle() {
    const regex = new RegExp(
      '^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
    );

    if (this.ZelleForm.invalid) {
      this.generateToast('Error', 'Hay campos obligatorios sin rellenar');
      return;
    }

    if (!regex.test(this.ZelleForm.value.accountHolderEmail ?? '')) {
      this.generateToast('Error', 'Email no valido');
      return;
    }

    this.bankAccountService
      .createZelleBankAcount(this.ZelleForm.value as ZelleBankAccountsResult)
      .subscribe((res) => {
        if (res === 'unknow_err') {
          this.generateToast('Error', 'Ha ocurrido un error inesperado');
        } else {
          this.generateToast('Success', 'Se ha creado la cuenta con exito');

          this.bankAccounts!.zelleBankAccounts.result.unshift(
            res as ZelleBankAccountsResult
          );
          this.bankAccounts!.zelleBankAccounts.totalCount =
            this.bankAccounts!.zelleBankAccounts.totalCount + 1;
          this.zelleTable?.reset();
          this.initializeAccountsChartData();
          this.initializeShownChartData();
        }
      });
  }

  //form
  MobilePayForm = new FormGroup({
    accountAlias: new FormControl<string | undefined>(undefined),
    accountHolderPhone: new FormControl<string | undefined>(undefined),
    accountHolderDocumentType: new FormControl<string | undefined>(undefined),
    accountHolderDocumentNumber: new FormControl<string | undefined>(undefined),
    bank: new FormControl<string | undefined>(undefined),
  });

  onSubmitMobilePay() {
    if (
      this.MobilePayForm.invalid ||
      !this.MobilePayForm.value.bank ||
      !this.MobilePayForm.value.accountHolderDocumentType
    ) {
      this.generateToast('Error', 'Hay campos obligatorios sin rellenar');
      return;
    }

    if (
      (this.MobilePayForm.value.accountHolderPhone?.length ?? 0) != 11 ||
      !this.isNumericString(this.MobilePayForm.value.accountHolderPhone ?? '')
    ) {
      this.generateToast('Error', 'Número de teléfono no válido');
      return;
    }

    if (
      (this.MobilePayForm.value.accountHolderDocumentNumber?.length ?? 0) < 4 ||
      !this.isNumericString(
        this.MobilePayForm.value.accountHolderDocumentNumber ?? ''
      )
    ) {
      this.generateToast('Error', 'Número de documento no válido');
      return;
    }

    this.bankAccountService
      .createMobilePayBankAcount({
        accountHolderDocument: `${this.MobilePayForm.value.accountHolderDocumentType}-${this.MobilePayForm.value.accountHolderDocumentNumber}`,
        accountHolderPhone: this.MobilePayForm.value.accountHolderPhone,
        accountAlias: this.MobilePayForm.value.accountAlias,
        bankId: this.getBankId(this.MobilePayForm.value.bank),
      } as any)
      .subscribe((res) => {
        if (res === 'unknow_err') {
          this.generateToast('Error', 'Ha ocurrido un error inesperado');
        } else {
          this.generateToast('Success', 'Se ha creado la cuenta con exito');

          this.bankAccounts!.mobilePayBankAccounts.result.unshift(
            res as MobilePayBankAccountsResult
          );
          this.bankAccounts!.mobilePayBankAccounts.totalCount =
            this.bankAccounts!.mobilePayBankAccounts.totalCount + 1;
          this.mobilePayTable?.reset();
          this.initializeAccountsChartData();
          this.initializeShownChartData();
        }
      });
  }

  //form
  TransferForm = new FormGroup({
    accountAlias: new FormControl<string | undefined>(undefined),
    accountHolderDocumentType: new FormControl<string | undefined>(undefined),
    accountHolderDocumentNumber: new FormControl<string | undefined>(undefined),
    bank: new FormControl<string | undefined>(undefined),
    number: new FormControl<string | undefined>(undefined),
    accountHolderName: new FormControl<string | undefined>(undefined),
    accountHolderEmail: new FormControl<string | undefined>(undefined),
  });

  onSubmitTransfer() {
    const regex = new RegExp(
      '^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
    );

    if (
      this.TransferForm.invalid ||
      !this.TransferForm.value.bank ||
      !this.TransferForm.value.accountHolderDocumentType
    ) {
      this.generateToast('Error', 'Hay campos obligatorios sin rellenar');
      return;
    }
    if (!regex.test(this.TransferForm.value.accountHolderEmail ?? '')) {
      this.generateToast('Error', 'Email no valido');
      return;
    }
    if (
      (this.TransferForm.value.number?.length ?? 0) != 16 ||
      !this.isNumericString(this.TransferForm.value.number ?? '')
    ) {
      this.generateToast('Error', 'Número de cuenta no válido');
      return;
    }

    if (
      (this.TransferForm.value.accountHolderDocumentNumber?.length ?? 0) < 4 ||
      !this.isNumericString(
        this.TransferForm.value.accountHolderDocumentNumber ?? ''
      )
    ) {
      this.generateToast('Error', 'Número de documento no válido');
      return;
    }

    this.bankAccountService
      .createTransferBankAcount({
        accountHolderDocument: `${this.TransferForm.value.accountHolderDocumentType}-${this.TransferForm.value.accountHolderDocumentNumber}`,
        accountAlias: this.TransferForm.value.accountAlias,
        accountHolderEmail: this.TransferForm.value.accountHolderEmail,
        accountHolderName: this.TransferForm.value.accountHolderName,
        accountNumber: `${
          this.TransferForm.value.bank
        }-${this.formatAccountNumber(this.TransferForm.value.number ?? '')}`,
        bankId: this.getBankId(`(${this.TransferForm.value.bank})`),
      } as any)
      .subscribe((res) => {
        if (res === 'unknow_err') {
          this.generateToast('Error', 'Ha ocurrido un error inesperado');
        } else {
          this.generateToast('Success', 'Se ha creado la cuenta con exito');

          this.bankAccounts!.transferBankAccounts.result.unshift(
            res as TransferBankAccountsResult
          );
          this.bankAccounts!.transferBankAccounts.totalCount =
            this.bankAccounts!.transferBankAccounts.totalCount + 1;
          this.transferTable?.reset();
          this.initializeAccountsChartData();
          this.initializeShownChartData();
        }
      });
  }

  private isNumericString(text: string): boolean {
    return /^[0-9]+$/.test(text);
  }

  private getBankId(bankLabel: string) {
    const match = bankLabel.match(/\((\d+)\)/);
    const code = match ? match[1] : '';
    let id;
    this.banks?.result.forEach((bank) => {
      if (bank.code == code) {
        id = bank.id;
      }
    });
    return id;
  }

  private formatAccountNumber(str: string): string {
    const part1 = str.substring(0, 4);
    const part2 = str.substring(4, 6);
    const part3 = str.substring(6);
    return `${part1}-${part2}-${part3}`;
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
      this.exchangeRate = exchangeRate;
      this.banks = banks;
      this.initializeAccountsChartData();
      this.initializeShownChartData();
      this.banks.result.forEach((bank) => {
        this.bankOptions.push(`${bank.name} (${bank.code})`);
        this.bankCodes.push(bank.code);
      });
    });
  }
}

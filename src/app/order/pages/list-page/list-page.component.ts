import { Component, ViewChild } from '@angular/core';
import { OrderService } from '../../services/orders.service';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import {
  Order,
  OrdersResponse,
} from '../../interfaces/orders-response.interface';
import { Table } from 'primeng/table';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: [],
  providers: [MessageService, ConfirmationService],
})
export class ListPageComponent {
  constructor(
    private orderService: OrderService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  transferDialogVisible = false;
  mobilePayDialogVisible = false;
  zelleDialogVisible = false;
  stripeDialogVisible = false;

  selectedOrder: Order | undefined;

  canReturnPayment: boolean = false;

  showOrderInfo(order: Order) {
    this.selectedOrder = order;
    if (order.transferBankAccount) {
      this.transferDialogVisible = true;
    } else if (order.mobilePayBankAccount) {
      this.mobilePayDialogVisible = true;
    } else if (order.zelleBankAccount) {
      this.zelleDialogVisible = true;
    } else if (
      !order.transferBankAccount &&
      !order.mobilePayBankAccount &&
      !order.zelleBankAccount
    ) {
      this.stripeDialogVisible = true;
    }
  }

  orders?: OrdersResponse;

  @ViewChild('pendingTable') pendingTable: Table | undefined;
  @ViewChild('successTable') successTable: Table | undefined;
  @ViewChild('failedTable') failedTable: Table | undefined;
  @ViewChild('returnedTable') returnedTable: Table | undefined;

  //pending overlay
  @ViewChild('pendingOverlayPanel') pendingOverlayPanel:
    | OverlayPanel
    | undefined;
  isOverlayPanelOpen = false;

  initOrderPendingEdit(
    order: Order,
    event: MouseEvent,
    canReturnPayment = false
  ) {
    this.canReturnPayment = canReturnPayment;
    if (!this.isOverlayPanelOpen) {
      this.selectedOrder = order;
      this.pendingOverlayPanel?.show(event);
      this.isOverlayPanelOpen = true;
    }
  }

  closeOverlayPanel() {
    this.pendingOverlayPanel?.hide();
    this.isOverlayPanelOpen = false;
  }

  ngAfterViewInit() {
    this.pendingOverlayPanel?.onHide.subscribe(() => {
      this.isOverlayPanelOpen = false;
    });
  }

  //changeStatus
  changeStatus(status: 'rechazado' | 'verificado' | 'reembolsado') {
    this.confirmationService.confirm({
      message:
        status == 'verificado'
          ? '¿Esta seguro que desea marcar como verificado?'
          : status == 'rechazado'
          ? '¿Esta seguro que desea marcar como rechazado?'
          : '¿Esta seguro que desea marcar como reembolsado?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(this.selectedOrder?.id ?? 'fuck');
        this.orderService
          .changeStatus(this.selectedOrder!.id, status)
          .subscribe((res) => {
            if (!res) {
              this.generateToast('Error', 'Ha ocurrido un error inesperado');
            } else {
              this.generateToast(
                'Success',
                'Se ha actualizado con exito el estatus de la orden'
              );
              if (this.selectedOrder!.status == 'pendiente') {
                this.orders!.pending = this.orders!.pending.filter(
                  (orderChecked) => {
                    if (orderChecked.id == this.selectedOrder!.id) {
                      return false;
                    }
                    return true;
                  }
                );
              } else if (this.selectedOrder!.status == 'rechazado') {
                this.orders!.failed = this.orders!.failed.filter(
                  (orderChecked) => {
                    if (orderChecked.id == this.selectedOrder!.id) {
                      return false;
                    }
                    return true;
                  }
                );
              } else if (this.selectedOrder!.status == 'verificado') {
                this.orders!.success = this.orders!.success.filter(
                  (orderChecked) => {
                    if (orderChecked.id == this.selectedOrder!.id) {
                      return false;
                    }
                    return true;
                  }
                );
              }

              this.selectedOrder!.status = status;

              if (status == 'rechazado') {
                this.orders!.failed.unshift(this.selectedOrder!);
              } else if (status == 'verificado') {
                this.orders!.success.unshift(this.selectedOrder!);
              } else {
                this.orders!.returned.unshift(this.selectedOrder!);
              }

              this.initializeOrdersChartData();
              this.failedTable?.reset();
              this.successTable?.reset();
              this.pendingTable?.reset();
              this.returnedTable?.reset();
            }
          });
      },
    });
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
      'Esta sección del dashboard permite gestionar las órdenes de pago de la orquesta',
    closable: false,
  };

  ordersChartData: any;
  ordersChartOptions = {
    maintainAspectRatio: false,
  };

  private initializeOrdersChartData() {
    this.ordersChartData = {
      labels: ['Verificados', 'Pendientes', 'Rechazados', 'Reembolsados'],
      datasets: [
        {
          data: [
            this.orders?.success.length,
            this.orders?.pending.length,
            this.orders?.failed.length,
            this.orders?.returned.length,
          ],
          backgroundColor: [
            'rgba(77, 158, 88, 0.3)',
            'rgba(245, 158, 11, 0.3)',
            'rgba(234, 75, 90, 0.3)',
            'rgba(0, 149, 255, 0.3)',
          ],
          borderColor: [
            'rgb(77, 158, 88)',
            'rgb(245, 158, 11)',
            'rgb(234, 75, 90)',
            'rgb(0, 149, 255)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }

  //table
  applyFilterGlobalPending($event: any) {
    this.pendingTable?.filterGlobal(
      ($event.target as HTMLInputElement).value,
      'contains'
    );
  }
  applyFilterGlobalSuccess($event: any) {
    this.successTable?.filterGlobal(
      ($event.target as HTMLInputElement).value,
      'contains'
    );
  }
  applyFilterGlobalFailed($event: any) {
    this.failedTable?.filterGlobal(
      ($event.target as HTMLInputElement).value,
      'contains'
    );
  }
  applyFilterGlobalReturned($event: any) {
    this.returnedTable?.filterGlobal(
      ($event.target as HTMLInputElement).value,
      'contains'
    );
  }

  //onInit
  ngOnInit(): void {
    this.orderService.getOrders().subscribe((ordersResponse) => {
      this.orders = ordersResponse;
      this.initializeOrdersChartData();
    });
  }
}

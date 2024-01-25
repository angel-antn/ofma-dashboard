import { Component, ViewChild } from '@angular/core';
import { OrderService } from '../../services/orders.service';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { OrdersResponse } from '../../interfaces/orders-response.interface';
import { Table } from 'primeng/table';
import { FormControl, FormGroup } from '@angular/forms';

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

  dialogVisible = false;

  orders?: OrdersResponse;

  @ViewChild('pendingTable') transferTable: Table | undefined;
  @ViewChild('successTable') mobilePayTable: Table | undefined;
  @ViewChild('failedTable') zelleTable: Table | undefined;

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
      'Esta sección del dashboard permite gestionar las órdenes de pago de la orquesta',
    closable: false,
  };

  ordersChartData: any;
  ordersChartOptions = {
    maintainAspectRatio: false,
  };

  private initializeOrdersChartData() {
    this.ordersChartData = {
      labels: ['Verificados', 'Pendientes', 'Rechazados'],
      datasets: [
        {
          data: [
            this.orders?.success.length,
            this.orders?.pending.length,
            this.orders?.failed.length,
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

  //table
  applyFilterGlobal($event: any) {
    this.transferTable?.filterGlobal(
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

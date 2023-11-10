import { NgModule } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { MessagesModule } from 'primeng/messages';

@NgModule({
  exports: [
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToolbarModule,
    SidebarModule,
    TableModule,
    TagModule,
    ChartModule,
    MessagesModule,
  ],
})
export class PrimeNgModule {}

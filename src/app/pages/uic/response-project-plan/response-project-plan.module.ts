import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { UserRoutingModule } from '../../auth/user/user-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ResponseProjectPlanComponent } from './response-project-plan.component';
import { ResponseProjectPlanFormComponent } from './response-project-plan-form/response-project-plan-form.component';
import { ResponseProjectPlanListComponent } from './response-project-plan-list/response-project-plan-list.component';
import { ResponseProjectPlanRoutingModule } from './response-project-plan-routing.module';
import { SharedModule } from '@shared/shared.module';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { MultiSelectModule } from 'primeng/multiselect';
import { SplitButtonModule } from 'primeng/splitbutton';
import { UicModule } from '../uic.module';


@NgModule({
  declarations: [
    ResponseProjectPlanComponent,
    ResponseProjectPlanFormComponent,
    ResponseProjectPlanListComponent
  ],
  imports: [
    ResponseProjectPlanRoutingModule,
    NgCommonModule,
    FileUploadModule,
    HttpClientModule,
    UserRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    //PrimeNg
    BadgeModule,
    ButtonModule,
    CardModule,
    CalendarModule,
    CheckboxModule,
    DialogModule,
    DropdownModule,
    InputSwitchModule,
    InputTextModule,
    KeyFilterModule,
    MenuModule,
    MessageModule,
    PaginatorModule,
    PanelModule,
    PasswordModule,
    RippleModule,
    TableModule,
    TagModule,
    ToolbarModule,
    TooltipModule,
    ToastModule,
    DividerModule,
    AccordionModule,
    MultiSelectModule,
    SplitButtonModule,
  ]
})
export class ResponseProjectPlanModule { }

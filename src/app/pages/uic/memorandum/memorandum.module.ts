import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {MemorandumRoutingModule} from './memorandum-routing.module';
import {ButtonModule} from "primeng/button";
import {CheckboxModule} from 'primeng/checkbox';
import {RippleModule} from "primeng/ripple";
import {TableModule} from 'primeng/table';
import {MessageModule} from "primeng/message";
import {MemorandumComponent} from './memorandum.component';

import {ToolbarModule} from 'primeng/toolbar';
import {TooltipModule} from 'primeng/tooltip';
import {InputTextModule} from 'primeng/inputtext';
import {SharedModule} from '@shared/shared.module';
import {CalendarModule} from 'primeng/calendar';
import {DropdownModule} from 'primeng/dropdown';
import {PasswordModule} from 'primeng/password';
import {CardModule} from "primeng/card";
import {ToastModule} from "primeng/toast";
import {PaginatorModule} from "primeng/paginator";
import {KeyFilterModule} from "primeng/keyfilter";
import {DialogModule} from "primeng/dialog";
import {UicModule} from "../uic.module";
import {InputSwitchModule} from "primeng/inputswitch";
import {PanelModule} from "primeng/panel";
import {MenuModule} from 'primeng/menu';
import {TagModule} from "primeng/tag";
import {DividerModule} from "primeng/divider";
import {AccordionModule} from "primeng/accordion";
import {MultiSelectModule} from "primeng/multiselect";
import {SplitButtonModule} from "primeng/splitbutton";
import {BadgeModule} from 'primeng/badge';

import { FileUploadModule } from 'primeng/fileupload';
import { MemorandumFormComponent } from './memorandum-form/memorandum-form.component';
import { MemorandumListComponent } from './memorandum-list/memorandum-list.component';
import { MemorandumTutorFormComponent } from './memorandum-tutor-form/memorandum-tutor-form.component';
import { MemorandumTutorListComponent } from './memorandum-tutor-list/memorandum-tutor-list.component';
import { MemorandumTutorRoutingModule } from './memorandum-tutor-routing.module';

@NgModule({
  declarations: [
    MemorandumComponent,
    MemorandumFormComponent,
    MemorandumListComponent,
    MemorandumTutorFormComponent,
    MemorandumTutorListComponent,
  ],
  imports: [
    NgCommonModule,
    MemorandumTutorRoutingModule,
    MemorandumRoutingModule,
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
    FileUploadModule,
    MultiSelectModule,
    SplitButtonModule,
  ]
})
export class MemorandumModule {
}

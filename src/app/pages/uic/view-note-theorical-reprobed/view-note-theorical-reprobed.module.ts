import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {ViewNoteTheoricalReprobedRoutingModule} from './view-note-theorical-reprobed-routing.module';
import {ButtonModule} from "primeng/button";
import {CheckboxModule} from 'primeng/checkbox';
import {RippleModule} from "primeng/ripple";
import {TableModule} from 'primeng/table';
import {MessageModule} from "primeng/message";
import {ViewNoteTheoricalReprobedComponent} from './view-note-theorical-reprobed.component';

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

@NgModule({
  declarations: [
    ViewNoteTheoricalReprobedComponent,
  ],
  imports: [
    NgCommonModule,
    ViewNoteTheoricalReprobedRoutingModule,
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
export class ViewNoteTheoricalReprobedModule {
}

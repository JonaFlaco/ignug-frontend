import { NgModule } from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import { PracticalCaseComponent } from './practical-case.component';
import {ReactiveFormsModule} from '@angular/forms';

import {ButtonModule} from "primeng/button";
import {CheckboxModule} from 'primeng/checkbox';
import {RippleModule} from "primeng/ripple";
import {TableModule} from 'primeng/table';
import {MessageModule} from "primeng/message";


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
import {InputSwitchModule} from "primeng/inputswitch";
import {PanelModule} from "primeng/panel";
import {MenuModule} from 'primeng/menu';
import {TagModule} from "primeng/tag";
import {DividerModule} from "primeng/divider";
import {AccordionModule} from "primeng/accordion";
import {MultiSelectModule} from "primeng/multiselect";
import {SplitButtonModule} from "primeng/splitbutton";
import {BadgeModule} from 'primeng/badge';
import { PracticalCaseRoutingModule } from './practical-case-routing.module';
import { PracticalCaseListComponent } from './practical-case-list/practical-case-list.component';
import { PracticalCaseFormComponent } from './practical-case-form/practical-case-form.component';
import { TimelineComponent } from './timeline/timeline.component';
import { TimelineModule } from 'primeng/timeline';


@NgModule({
  declarations: [
    PracticalCaseComponent,
    PracticalCaseListComponent,
    PracticalCaseFormComponent,
    TimelineComponent

  ],
  imports: [
    NgCommonModule,
    PracticalCaseRoutingModule,
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
    TimelineModule

  ]
})
export class PracticalCaseModule {
}


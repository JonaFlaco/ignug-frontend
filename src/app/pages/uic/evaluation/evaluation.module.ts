import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {ButtonModule} from "primeng/button";
import {CheckboxModule} from 'primeng/checkbox';
import {RippleModule} from "primeng/ripple";
import {TableModule} from 'primeng/table';
import {MessageModule} from "primeng/message";
import { EvaluationComponent } from './evaluation.component';
import { EvaluationFormComponent } from './evaluation-form/evaluation-form.component';
import { EvaluationListComponent } from './evaluation-list/evaluation-list.component';
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
//import {ProfileComponent} from './profile/profile.component';
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
import { EvaluationRoutingModule } from './evaluation-routing.module';
import { FileUploadModule } from 'primeng/fileupload';
import { MatTableModule } from '@angular/material/table';
import { KnobModule } from 'primeng/knob';
import {TabViewModule} from 'primeng/tabview';
import { RadioButtonModule } from 'primeng/radiobutton';
//import {AuthenticationModule} from "../authentication/authentication.module";

@NgModule({
  declarations: [
    EvaluationComponent,
    EvaluationFormComponent,
    EvaluationListComponent,
    //ProfileComponent,
  ],
  imports: [
    NgCommonModule,
    EvaluationRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    //PrimeNg
    FileUploadModule,
    BadgeModule,
    ButtonModule,
    CardModule,
    CalendarModule,
    CheckboxModule,
    DialogModule,
    DropdownModule,
    InputSwitchModule,
    InputTextModule,
    MatTableModule,
    KeyFilterModule,
    KnobModule,
    MenuModule,
    MessageModule,
    PaginatorModule,
    PanelModule,
    PasswordModule,
    RadioButtonModule,
    RippleModule,
    TableModule,
    TabViewModule,
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
export class EvaluationModule {
}

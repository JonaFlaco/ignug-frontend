import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {UicRoutingModule} from './uic-routing.module';
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {MessageModule} from "primeng/message";
import { FileUploadModule } from 'primeng/fileupload';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthenticationModule } from '../auth/authentication/authentication.module';
import { FieldsetModule } from 'primeng/fieldset';

@NgModule({
  declarations: [],
  imports: [
    NgCommonModule,
    UicRoutingModule,
    ButtonModule,
    RippleModule,
    MessageModule,
    FileUploadModule,
    MatSnackBarModule,
    AuthenticationModule,
    FieldsetModule
  ]
})
export class UicModule {

}

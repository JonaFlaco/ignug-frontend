import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthenticationRoutingModule} from './authentication-routing.module';
import {LoginComponent} from "./login/login.component";
import {PasswordChangeComponent} from "./password-change/password-change.component";
import {PasswordResetComponent} from "./password-reset/password-reset.component";
import {SharedModule} from "@shared/shared.module";
import {DividerModule} from "primeng/divider";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {CheckboxModule} from "primeng/checkbox";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {RippleModule} from "primeng/ripple";
import {ReactiveFormsModule} from "@angular/forms";
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AutenticationService } from './services/AutenticationService.service';


@NgModule({
  declarations: [LoginComponent, PasswordChangeComponent, PasswordResetComponent],
  providers: [
    LocalAuthGuard,
    AutenticationService
  ],
  exports: [
    PasswordChangeComponent,
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    DividerModule,
    InputTextModule,
    PasswordModule,
    RippleModule,
  ]
})
export class AuthenticationModule {
}

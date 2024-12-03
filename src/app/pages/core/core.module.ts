import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {CoreRoutingModule} from './core-routing.module';
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {MessageModule} from "primeng/message";
import { AuthenticationModule } from '../auth/authentication/authentication.module';

@NgModule({
  declarations: [],
  imports: [
    NgCommonModule,
    CoreRoutingModule,
    ButtonModule,
    RippleModule,
    MessageModule,
    AuthenticationModule
  ]
})
export class CoreModule {
}

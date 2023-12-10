import { NgModule } from "@angular/core";
import { AuthHeaderComponent, HeaderComponent } from "./components";
import { AuthLayoutComponent, LayoutComponent } from "./layouts";
import { CommonModule } from "@angular/common";
import { RouterModule, RouterOutlet } from "@angular/router";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
    declarations: [
        HeaderComponent,
        LayoutComponent,
        AuthHeaderComponent,
        AuthLayoutComponent,
    ],
    exports: [
        LayoutComponent,
        AuthLayoutComponent,
    ],
    imports:[
        CommonModule,
        RouterOutlet,
        RouterModule,
        NgbDropdownModule,
        TranslateModule
    ],
})
export class LayoutModule {}
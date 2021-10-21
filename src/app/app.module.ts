import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ProductsComponent } from "./products/products.component";
import { ProductItemComponent } from "./products/product-item/product-item.component";
import { NavbarComponent } from "./navbar/navbar.component";

import { FlexLayoutModule } from "@angular/flex-layout";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { LoginPageComponent } from "./login-page/login-page.component";
import { LoginComponent } from "./login-page/login/login.component";

import { Config } from "./shared/utilities/config";
import { Auth } from "./shared/services/auth";
import { User } from "./shared/models/user.model";

@NgModule({
    declarations: [
        AppComponent,
        ProductsComponent,
        ProductItemComponent,
        NavbarComponent,
        LoginPageComponent,
        LoginComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FlexLayoutModule,
        HttpClientModule,
        FormsModule
    ],
    providers: [Config, Auth, User],
    bootstrap: [AppComponent]
})
export class AppModule {}

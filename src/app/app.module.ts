import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ProductsComponent } from "./products/products.component";
import { ProductItemComponent } from "./products/product-item/product-item.component";

import { FlexLayoutModule } from "@angular/flex-layout";
import { NavbarComponent } from './products/navbar/navbar.component';

@NgModule({
    declarations: [AppComponent, ProductsComponent, ProductItemComponent, NavbarComponent],
    imports: [BrowserModule, AppRoutingModule, FlexLayoutModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}

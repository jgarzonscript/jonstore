import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginPageComponent } from "./login-page/login-page.component";

import { ProductsComponent } from "./products/products.component";

const routes: Routes = [
    { path: "", component: ProductsComponent },
    { path: "login", component: LoginPageComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}

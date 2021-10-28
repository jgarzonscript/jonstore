import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginPageComponent } from "./login-page/login-page.component";
import { ProductsComponent } from "./products/products.component";
import { CartComponent } from "./cart/cart.component";

const routes: Routes = [
    { path: "", component: ProductsComponent },
    {
        path: "login",
        component: LoginPageComponent
        // children: [
        //     {
        //         path: "",
        //         component: LoginComponent
        //     }
        // ]
    },
    {
        path: "cart",
        component: CartComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" })],
    exports: [RouterModule]
})
export class AppRoutingModule {}

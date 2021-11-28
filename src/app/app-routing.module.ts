import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginPageComponent } from "./login-page/login-page.component";
import { ProductsComponent } from "./products/products.component";
import { CartComponent } from "./cart/cart.component";
import { ConfirmationComponent } from "./cart/confirmation/confirmation.component";

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
    },
    {
        path: "confirmation/:name/:total",
        component: ConfirmationComponent
    }
    // {
    //     path: "confirmation",
    //     component: ConfirmationComponent
    // }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" })],
    exports: [RouterModule]
})
export class AppRoutingModule {}

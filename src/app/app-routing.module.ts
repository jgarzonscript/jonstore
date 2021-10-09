import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginPageComponent } from "./login-page/login-page.component";
import { LoginComponent } from "./login-page/login/login.component";

import { ProductsComponent } from "./products/products.component";

const routes: Routes = [
    { path: "", component: ProductsComponent },
    {
        path: "login",
        component: LoginPageComponent,
        children: [
            {
                path: "",
                component: LoginComponent
            }
        ]
    }
    // {
    //     path: "login/:id",
    //     component: LoginPageComponent,
    //     children: [
    //         {
    //             path: "",
    //             component: LoginComponent
    //         }
    //     ]
    // }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" })],
    exports: [RouterModule]
})
export class AppRoutingModule {}

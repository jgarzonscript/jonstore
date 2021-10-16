import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    AfterViewInit
} from "@angular/core";
import { HttpService } from "../shared/services/http.service";
import { NavigationEnd, Router } from "@angular/router";

@Component({
    selector: "navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit, AfterViewInit {
    @ViewChild("lnkLogin") lnkLogin: ElementRef<HTMLAnchorElement> =
        {} as ElementRef;

    loggedInUser = "";

    constructor(private http: HttpService, private router: Router) {}

    ngOnInit(): void {
        // this.http
        //     .isLoggedIn$()
        //     .subscribe((val) => console.log(`user is logged in: ${val}`));
        // this.router.events.subscribe((event) => {
        //     if (event instanceof NavigationEnd) {
        //         this.http
        //             .getCurrentUser$()
        //             .subscribe((user) =>
        //                 console.log(`user: ${user?.username}`)
        //             );
        //     }
        // });
    }

    ngAfterViewInit(): void {
        // console.log(`element: ${this.lnkLogin.nativeElement.text}`);

        this.http.isLoggedIn$().subscribe((isUserLoggedIn) => {
            if (isUserLoggedIn) {
                // this.lnkLogin.nativeElement.text = `user jo is logged in`;
                // this.loggedInUser = "juser";
                this.http
                    .getCurrentUser$()
                    .subscribe(
                        (user) => (this.loggedInUser = String(user?.username))
                    );
            }
        });
    }
}

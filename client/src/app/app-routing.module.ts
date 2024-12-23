import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { UserComponent } from "./common/components/user/user.component";
import { HomeComponent } from "./pages/home/home.component";
import { NotFoundComponent } from "./common/components/not-found/not-found.component";

const routes: Routes = [
  { path: "", pathMatch: "full", component: HomeComponent },
  { path: "user", component: UserComponent },
  {
    path: ":id",
    loadChildren: () =>
      import("./index/index.module").then((m) => m.IndexModule),
  },
  {
    path: "**",
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],

  exports: [RouterModule],
})
export class AppRoutingModule {}

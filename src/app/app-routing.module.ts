import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "./shared/layout/layout.component";

const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      {
        path: '',
        loadChildren: () => import('./views/todo-app/todo-app.module').then(m => m.TodoAppModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

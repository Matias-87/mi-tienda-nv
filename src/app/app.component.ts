import { Component, inject} from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { changeComponentAnimation } from '../animations/animations';

const PATH = 'totals';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [changeComponentAnimation]
})
export class AppComponent {
  title = 'MiTienda'

  contexts = inject(ChildrenOutletContexts);

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation']
  }
}

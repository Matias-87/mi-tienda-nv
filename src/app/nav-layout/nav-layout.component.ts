import { Component, inject } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { changeComponentAnimation } from '../../animations/animations';

@Component({
  selector: 'app-nav-layout',
  standalone: true,
  imports: [NavBarComponent, RouterOutlet],
  templateUrl: './nav-layout.component.html',
  styleUrl: './nav-layout.component.scss',
  animations: [changeComponentAnimation]
})
export class NavLayoutComponent {
  contexts = inject(ChildrenOutletContexts);

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation']
  }
}

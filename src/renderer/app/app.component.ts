import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutComponent } from './core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}

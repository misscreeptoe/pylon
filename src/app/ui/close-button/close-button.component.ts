import { Attribute, ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-close-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './close-button.component.html',
  styleUrls: ['./close-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloseButtonComponent {
  @Attribute('aria-label')
  public ariaLabel = 'Close';
}

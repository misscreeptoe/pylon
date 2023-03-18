import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebviewDirective } from './webview.directive';

@Component({
  selector: 'app-webview',
  standalone: true,
  imports: [CommonModule, WebviewDirective],
  templateUrl: './webview.component.html',
  styleUrls: ['./webview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebviewComponent implements AfterViewInit {
  @Input()
  public id: string;

  @Input()
  public src: string;

  public webview: Electron.WebviewTag;

  public ngAfterViewInit(): void {
    this.webview = document.querySelector('webview');
  }
}

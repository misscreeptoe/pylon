import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { DappListing } from '../../model';
import { CardComponent } from '../card';

@Component({
  selector: 'app-dapp-listing-card',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './dapp-listing-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DappListingCardComponent {
  @Input()
  public dappListing?: DappListing;

  @Output()
  public openDapp = new EventEmitter<DappListing>();

  public onCardClicked(): void {
    this.openDapp.emit(this.dappListing);
  }
}

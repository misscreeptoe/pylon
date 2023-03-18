import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { DappListing } from '../../model';
import { CardComponent } from '../../ui';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

const IC_DOMAIN = 'ic0.app';

@Component({
  selector: 'app-dapp-listing-card',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './dapp-listing-card.component.html',
  styleUrls: ['./dapp-listing-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DappListingCardComponent implements OnChanges {
  @Input()
  public dappListing?: DappListing;

  public url?: string;
  public faviconUrl?: SafeUrl;

  constructor(private readonly domSanitizer: DomSanitizer) {}

  public ngOnChanges(): void {
    if (this.dappListing) {
      this.faviconUrl = this.domSanitizer.bypassSecurityTrustUrl(
        `ic-metadata:${this.dappListing.canisterId}/icon`,
      );

      this.url =
        this.dappListing.url ??
        `https://${this.dappListing.canisterId}.${IC_DOMAIN}`;
    }
  }
}

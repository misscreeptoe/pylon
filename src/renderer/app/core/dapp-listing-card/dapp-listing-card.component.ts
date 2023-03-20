import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { DappListing } from '../../model';
import { CardComponent } from '../../ui';
import { MetadataService } from '../metadata';

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
  public title$?: Observable<string>;

  constructor(private readonly metadataService: MetadataService) {}

  public ngOnChanges(): void {
    if (this.dappListing) {
      const { canisterId } = this.dappListing;

      this.faviconUrl = this.metadataService.getFaviconUrl(canisterId);
      this.title$ = this.metadataService.getTitle(canisterId);

      this.url = this.dappListing.url ?? `https://${canisterId}.${IC_DOMAIN}`;
    }
  }
}

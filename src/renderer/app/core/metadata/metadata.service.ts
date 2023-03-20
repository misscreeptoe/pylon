import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MetadataService {
  constructor(
    private readonly domSanitizer: DomSanitizer,
    private readonly httpClient: HttpClient,
  ) {}

  public getFaviconUrl(canisterId: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl(
      this.getMetadataUrl(canisterId, 'icon'),
    );
  }

  public getTitle(canisterId: string): Observable<string> {
    return this.httpClient.get(this.getMetadataUrl(canisterId, 'title'), {
      responseType: 'text',
    });
  }

  private getMetadataUrl(canisterId: string, property: string): string {
    return `ic-metadata:${canisterId}/${property}`;
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-cookie-banner',
  imports: [],
  templateUrl: './cookie-banner.component.html',
  styleUrl: './cookie-banner.component.css'
})
export class CookieBannerComponent {
  showCookieBanner = !localStorage.getItem('cookiesAccepted');

  acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    this.showCookieBanner = false;
  }
}

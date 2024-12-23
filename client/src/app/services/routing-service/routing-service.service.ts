import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  navigateToURL = (url: string) => {
    if (url) {
      this.router.navigateByUrl(url);
    }
  };
}
import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideRouter,
  PreloadAllModules,
  withPreloading,
} from '@angular/router';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes, withPreloading(PreloadAllModules))],
}).catch((err) => console.error(err));

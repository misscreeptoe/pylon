import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideRouter,
  PreloadAllModules,
  withPreloading,
  withDebugTracing,
} from '@angular/router';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withDebugTracing(),
    ),
  ],
}).catch((err) => console.error(err));

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './app/core/http-interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppRoot } from './app/app-root/app-root';

bootstrapApplication(AppRoot, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpInterceptor])),
    provideAnimations(),
  ]
}).catch(err => console.error(err));

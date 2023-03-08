/*
 * angular-todo-prototype
 *
 * register.component.ts
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { Component, OnInit } from '@angular/core';
import Widget, { journey, configuration } from '@forgerock/login-widget';
import { environment } from 'samples/angular-todo/src/environments/environment';

/**
 * Used to show a registration page
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  ngOnInit() {
    // Configure the widget
    configuration().set({
      config: {
        clientId: environment.WEB_OAUTH_CLIENT,
        redirectUri: window.location.origin,
        scope: 'openid profile email',
        serverConfig: {
          baseUrl: environment.AM_URL,
          timeout: 30000, // 90000 or less
        },
        realmPath: environment.REALM_PATH,
      },
      links: {
        termsAndConditions: 'https://www.forgerock.com/terms',
      },
    });

    // Instantiate the widget
    const widget = new Widget({
      target: document.getElementById('login-widget-inline'),
      props: { type: 'inline' },
    });

    // Launch the widget
    const journeyEvents = journey();
    journeyEvents.start({ journey: 'Register' });
    journeyEvents.subscribe((event) => {
      console.log(event);
    });
  }
}

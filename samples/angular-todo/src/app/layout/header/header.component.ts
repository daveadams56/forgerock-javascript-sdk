/*
 * angular-todo-prototype
 *
 * header.component.ts
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import Widget, { component, configuration, journey, user } from '@forgerock/login-widget';
import { environment } from 'samples/angular-todo/src/environments/environment';

/**
 * Used to show a navigation bar with router links and user info
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  /**
   * Initialise with user service and router as we will be using user info and showing router links
   * @param userService - Determine whether user is authenticated and get user info retrieved by other parts of the app
   * @param router - Show router links
   */
  constructor(
    public userService: UserService,
    public router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      if (params.login) {
        this.launchWidget();
      }
    });
  }

  launchWidget() {
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
    });

    const widget = new Widget({
      target: document.getElementById('widget-root'),
    });

    const componentEvents = component();
    componentEvents.open();

    const journeyEvents = journey();
    journeyEvents.start({ journey: 'Login' });
    journeyEvents.subscribe((event) => {
      console.log(event);
      this.userService.isAuthenticated = event?.journey.completed && event?.journey.successful;
      this.userService.info = event?.user.response;
      console.log(event?.user);
    });
  }
}

/*
 * angular-todo-prototype
 *
 * home.component.ts
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TokenManager, UserManager } from '@forgerock/javascript-sdk';
import { UserService } from '../../services/user.service';

/**
 * Used to show a home page with information about the application, and links to sign in or register or a personalised welcome
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor(public userService: UserService, private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    // Check for code and state params indicating this the app is returning from a centralized login flow
    this.checkForCentralizedLoginReturn();

    // Check for goto param indicating this is a centralized login flow supported by this app
    this.checkForCentralizedLoginFlow();
  }

  async checkForCentralizedLoginReturn() {
    this.route.queryParams.subscribe(async (params) => {
      if (params.code && params.state) {
        await TokenManager.getTokens({
          query: {
            code: params.code, // Authorization code from redirect URL
            state: params.state, // State from redirect URL
          },
        });

        try {
          // Assume user is likely authenticated if there are tokens
          const info = await UserManager.getCurrentUser();
          this.userService.isAuthenticated = true;
          this.userService.info = info;
        } catch (err) {
          // User likely not authenticated
          console.log(err);
        }
      }
    });
  }

  async checkForCentralizedLoginFlow() {
    this.route.queryParams.subscribe(async (params) => {
      if (params.goto) {
        this.userService.goto = params.goto;
      }
    });
  }
}

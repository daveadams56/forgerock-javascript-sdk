/*
 * angular-todo-prototype
 *
 * auth.guard.ts
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { UserService } from '../services/user.service';
import { configuration, user } from '@forgerock/login-widget';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(public userService: UserService, private router: Router) {}

  /**
   * Extends CanActivate to protect selected routes from unauthenticated access
   *
   * @param next - Route that the user is trying to access
   * @param state - Router state
   * @returns Promise - Boolean or route to redirect the user to
   */
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<true | UrlTree> {
    const loginUrl = this.router.parseUrl('/home?login=true');

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
    try {
      // Assume user is likely authenticated if there are tokens
      const userEvents: any = user.tokens();
      // const userResult = await userEvents.get();
      const userResult = await userEvents.get();
      console.log('userResult');
      console.log(userResult);
      if (userResult.completed && userResult.successful) {
        console.log(userResult);
        this.userService.isAuthenticated = true;
        return true;
      } else {
        return loginUrl;
      }

      return true;
    } catch (err) {
      // User likely not authenticated
      console.log(err);
      return loginUrl;
    }
  }
}

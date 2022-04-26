/*
 * angular-todo-prototype
 *
 * select-idp.component.ts
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IdPValue, SelectIdPCallback } from '@forgerock/javascript-sdk';
import { environment } from '../../../../environments/environment';

/**
 * Used to display a series of choices and allow the user to select one
 */
@Component({
  selector: 'app-select-idp',
  templateUrl: './select-idp.component.html',
})
export class SelectIDPComponent {
  /**
   * The callback to be represented as select input
   */
  @Input() callback?: SelectIdPCallback;

  /**
   * The name of the callback
   */
  @Input() name?: string;

  /**
   * Emits a string representing the value of the selected choice
   */
  @Output() updatedCallback = new EventEmitter<string>();

  /**
   * Emit an event to the parent component, passing the selected choice
   * @param event - the choice selected
   */
  setValue(event: any): void {
    this.updatedCallback.emit(event);
  }

  socialProviders(): Array<IdPValue> | undefined {
    return this.callback?.getProviders().filter((provider) => provider.uiConfig);
  }

  localProviders(): Array<IdPValue> | undefined {
    return this.callback?.getProviders().filter((provider) => !provider.uiConfig);
  }

  socialImageUrlFromTenant(buttonImage: string): string {
    return `${environment.AM_URL}/XUI/${buttonImage}`;
  }
}

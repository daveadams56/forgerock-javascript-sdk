/*
 * angular-todo-prototype
 *
 * webauthn.component.ts
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FRWebAuthn, FRStep, WebAuthnStepType } from '@forgerock/javascript-sdk';

/**
 * Used to invoke Web Authentication on the user's browser and return the result
 */
@Component({
  selector: 'app-webauthn',
  templateUrl: './webauthn.component.html',
})
export class WebAuthnComponent implements OnInit {
  /**
   * The name of the callback
   */
  @Input() name?: string;

  /**
   * The FRStep representing the current step in authentication
   */
  @Input() step?: FRStep;

  /**
   * Emits a FRStep representing the updated step after Web Authentication
   */
  @Output() updatedCallback = new EventEmitter<FRStep>();

  /**
   * Initialise any failure messages and whether this field is mandatory
   */
  async ngOnInit(): Promise<void> {
    if (this.step) {
      // Determine if a step is a Web Biometrics step
      const stepType = FRWebAuthn.getWebAuthnStepType(this.step);

      let step = this.step;

      if (stepType === WebAuthnStepType.Registration) {
        // Registering a new device
        step = await FRWebAuthn.register(step);
      } else if (stepType === WebAuthnStepType.Authentication) {
        // Authenticating with a registered device
        step = await FRWebAuthn.authenticate(step);
      }

      // `step` has now been populated with the Web Biometrics credentials

      // Send this new step to the ForgeRock server
      this.updateValue(step);
    }
  }

  /**
   * Emit an event to the parent component, passing webauthn results
   * @param event - the value of the text field
   */
  updateValue(event: FRStep): void {
    this.updatedCallback.emit(event);
  }
}

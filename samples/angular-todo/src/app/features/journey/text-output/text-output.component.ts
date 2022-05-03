/*
 * angular-todo-prototype
 *
 * text-output.component.ts
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { SuspendedTextOutputCallback, TextOutputCallback } from '@forgerock/javascript-sdk';

/**
 * Used to display a message or script to be evaluated by the browser
 */
@Component({
  selector: 'app-text-output',
  templateUrl: './text-output.component.html',
})
export class TextOutputComponent implements OnInit {
  /**
   * The callback to be represented as terms and conditions
   */
  @Input() callback?: TextOutputCallback | SuspendedTextOutputCallback;

  /**
   * The name of the callback
   */
  @Input() name?: string;

  message?: string;

  messageType?: string;

  /**
   * Emits a boolean representing the updated state of the checkbox
   */
  @Output() updatedCallback = new EventEmitter<boolean>();

  ngOnInit(): void {
    if (this.callback) {
      this.message = this.callback?.getMessage();
      switch (this.callback.getMessageType()) {
        case '1':
          this.messageType = 'WARNING';
          break;
        case '2':
          this.messageType = 'ERROR';
          break;
        case '4':
          this.messageType = 'SCRIPT';
          // TODO find a way to evaluate the script safely
          break;
        default:
          this.messageType = 'INFORMATION';
      }
    }
  }

  /**
   * Emit an event to the parent component, passing the acceptance of the terms and conditions
   * @param event - the acceptance of the terms and conditions
   */
  updateValue(event: any): void {
    this.updatedCallback.emit(event.target.checked);
  }
}

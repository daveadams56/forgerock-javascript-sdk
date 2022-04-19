/*
 * angular-todo-prototype
 *
 * device-profile.component.ts
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FRStep, DeviceProfileCallback, FRDevice } from '@forgerock/javascript-sdk';
import { DeviceProfileData } from '@forgerock/javascript-sdk/src/fr-device/interfaces';

/**
 * Used to collect and return the profile of a user's device
 */
@Component({
  selector: 'app-device-profile',
  templateUrl: './device-profile.component.html',
})
export class DeviceProfileComponent implements OnInit {
  /**
   * The callback to be represented as a username, create username, or text input field
   */
  @Input() callback?: DeviceProfileCallback;

  /**
   * The name of the callback
   */
  @Input() name?: string;

  /**
   * Emits the data collected from the device profiling
   */
  @Output() updatedCallback = new EventEmitter<DeviceProfileData>();

  /**
   * Initiate the device profiling
   */
  async ngOnInit(): Promise<void> {
    const device = new FRDevice();
    const profile = await device.getProfile({
      location: this.callback?.isLocationRequired() ?? false,
      metadata: this.callback?.isMetadataRequired() ?? false,
    });

    this.updateValue(profile);
  }

  /**
   * Emit an event to the parent component, passing the device profile collected
   * @param event - the value of the device profile
   */
  updateValue(event: DeviceProfileData): void {
    this.updatedCallback.emit(event);
  }
}

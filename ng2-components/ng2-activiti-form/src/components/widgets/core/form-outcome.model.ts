/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { FormWidgetModel } from './form-widget.model';
import { FormModel } from './form.model';

export class FormOutcomeModel extends FormWidgetModel {

    private _id: string;
    private _name: string;

    isSystem: boolean = false;

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    constructor(form: FormModel, json?: any) {
        super(form, json);

        if (json) {
            this._id = json.id;
            this._name = json.name;
            this.isSystem = json.isSystem ? true : false;
        }
    }
}

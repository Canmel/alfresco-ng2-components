/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { browser } from 'protractor';

import { ApiService, LoginSSOPage, TasksService, SettingsPage } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { AppListCloudPage } from '@alfresco/adf-testing';
import { StringUtil } from '@alfresco/adf-testing';
import resources = require('../util/resources');

describe('Task list cloud - selection', () => {

    describe('Task list cloud - selection', () => {
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
        const tasksCloudDemoPage = new TasksCloudDemoPage();
        const settingsPage = new SettingsPage();

        let tasksService: TasksService;

        const simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP.name;
        const noOfTasks = 3;
        let response;
        const tasks = [];

        beforeAll(async (done) => {
            const apiService = new ApiService(
                browser.params.config.oauth2.clientId,
                browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers
            );
            await apiService.login(browser.params.identityUser.email, browser.params.identityUser.password);

            tasksService = new  TasksService(apiService);

            for (let i = 0; i < noOfTasks; i++) {
                response = await tasksService.createStandaloneTask(StringUtil.generateRandomString(), simpleApp);
                await tasksService.claimTask(response.entry.id, simpleApp);
                tasks.push(response.entry.name);
            }

            await settingsPage.setProviderBpmSso(
                browser.params.config.bpmHost,
                browser.params.config.oauth2.host,
                browser.params.config.identityHost);
            loginSSOPage.loginSSOIdentityService(browser.params.identityUser.email, browser.params.identityUser.password);
            done();
        });

        beforeEach(() => {
            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.goToApp(simpleApp);
            tasksCloudDemoPage.myTasksFilter().checkTaskFilterIsDisplayed();
            tasksCloudDemoPage.clickSettingsButton().disableDisplayTaskDetails();
            tasksCloudDemoPage.clickAppButton();
        });

        it('[C291914] Should not be able to select any row when selection mode is set to None', () => {
            tasksCloudDemoPage.clickSettingsButton().selectSelectionMode('None');
            tasksCloudDemoPage.clickSettingsButton().disableDisplayTaskDetails();
            tasksCloudDemoPage.clickAppButton();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();

            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().selectRow(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkNoRowIsSelected();
        });

        it('[C291918] Should be able to select only one row when selection mode is set to Single', () => {
            tasksCloudDemoPage.clickSettingsButton().selectSelectionMode('Single');
            tasksCloudDemoPage.clickSettingsButton().disableDisplayTaskDetails();
            tasksCloudDemoPage.clickAppButton();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();

            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().selectRow(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsSelected(tasks[0]);
            expect(tasksCloudDemoPage.taskListCloudComponent().getDataTable().getNumberOfSelectedRows()).toEqual(1);

            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().selectRow(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsSelected(tasks[1]);
            expect(tasksCloudDemoPage.taskListCloudComponent().getDataTable().getNumberOfSelectedRows()).toEqual(1);
        });

        it('[C291919] Should be able to select only one row when selection mode is set to Multiple', () => {
            tasksCloudDemoPage.clickSettingsButton().selectSelectionMode('Multiple');
            tasksCloudDemoPage.clickSettingsButton().disableDisplayTaskDetails();
            tasksCloudDemoPage.clickAppButton();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();

            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().selectRow(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsSelected(tasks[0]);

            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().selectRowWithKeyboard(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsSelected(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsSelected(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsNotSelected(tasks[2]);
        });

        it('[C291916] Should be able to select multiple row when multiselect is true', () => {
            tasksCloudDemoPage.clickSettingsButton().enableMultiSelection();
            tasksCloudDemoPage.clickSettingsButton().disableDisplayTaskDetails();
            tasksCloudDemoPage.clickAppButton();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();

            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().clickCheckbox(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsChecked(tasks[0]);

            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().clickCheckbox(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsChecked(tasks[1]);

            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(tasks[2]);
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsNotChecked(tasks[2]);
            tasksCloudDemoPage.taskListCloudComponent().clickCheckbox(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsNotChecked(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsChecked(tasks[0]);
        });

        it('[C291915] Should be possible select all the rows when multiselect is true', () => {
            tasksCloudDemoPage.clickSettingsButton().enableMultiSelection();
            tasksCloudDemoPage.clickSettingsButton().disableDisplayTaskDetails();
            tasksCloudDemoPage.clickAppButton();
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();

            tasksCloudDemoPage.taskListCloudComponent().getDataTable()
                .checkAllRowsButtonIsDisplayed()
                .checkAllRows();
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsChecked(tasks[0]);
            tasksCloudDemoPage.taskListCloudComponent().clickCheckbox(tasks[1]);
            tasksCloudDemoPage.taskListCloudComponent().checkRowIsChecked(tasks[2]);
        });

    });

});

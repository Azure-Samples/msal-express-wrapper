/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Page, Browser, BrowserContext, chromium } from "playwright";
import { test, expect, } from "@playwright/test";

import {
  Screenshot, createFolder, enterCredentials,
  SCREENSHOT_BASE_FOLDER_NAME,
  SAMPLE_HOME_URL,
  clickSignIn,
  clickSignOut
} from "./e2eTestUtils";

const { WebAppAuthProvider } =  require("../../dist/index");
const appSettings = require("../App/appSettings");
const { app, main } = require('../App/app');

require('dotenv').config();

// Get flow-specific routes from sample application

test.describe("Auth Code AAD Tests", () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;
  let port: number;
  let homeRoute: string;

  let username: string;
  let accountPwd: string;
  let msid: any;
  
  const screenshotFolder = `${SCREENSHOT_BASE_FOLDER_NAME}/web-app/aad`;

  test.beforeAll(async () => {
    browser = await chromium.launch();

    port = 4000;
    homeRoute = `http://localhost:${port}`;

    createFolder(screenshotFolder);

    [username, accountPwd] = [process.env.AAD_TEST_USER_USERNAME, process.env.AAD_TEST_USER_PASSWORD];
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test.describe("Acquire Token", async () => {
    let server: any;
    test.beforeAll(async () => {
      server = app.listen(port);
      msid = await new WebAppAuthProvider.initialize(appSettings);
      main(msid);
    });

    test.afterAll(async () => {
      if (server) {
        server.close();
      }
    });

    test.beforeEach(async () => {
      context = await browser.newContext();
      page = await context.newPage();
      page.setDefaultTimeout(5000);
      page.on("dialog", async dialog => {
        console.log(dialog.message());
        await dialog.dismiss();
      });
    });

    test.afterEach(async () => {
      await page.close();
      await context.close();
    });

    test("Sign-in with AAD", async () => {
      const screenshot = new Screenshot(`${screenshotFolder}/sign-in-with-aad`);
      await page.goto(homeRoute);
      await clickSignIn(page, screenshot);
      await enterCredentials(page, screenshot, username, accountPwd);
      await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
      await expect(page.locator(`text=${username}`).first()).toBeVisible();
    });

    test("Acquire token with AAD", async () => {
      const screenshot = new Screenshot(`${screenshotFolder}/acquire-token-with-aad`);
      await page.goto(homeRoute);
      await clickSignIn(page, screenshot);
      await enterCredentials(page, screenshot, username, accountPwd);
      await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
      await expect(page.locator(`text=${username}`).first()).toBeVisible();
      await page.waitForSelector("#acquireTokenGraph")
      await screenshot.takeScreenshot(page, "samplePagePostLogin");
      page.click("#acquireTokenGraph");
      await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
      await screenshot.takeScreenshot(page, "samplePageAcquireTokenCallGraph");
      await expect(page.locator(`text=Calling Microsoft Graph API`).first()).toBeVisible();
      await expect(page.locator(`text=${username}`).first()).toBeVisible();
    });

    test("Sign-out with AAD", async () => {
      const screenshot = new Screenshot(`${screenshotFolder}/sign-out-with-aad`);
      await page.goto(homeRoute);
      await clickSignIn(page, screenshot);
      await enterCredentials(page, screenshot, username, accountPwd);
      await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
      await expect(page.locator(`text=${username}`).first()).toBeVisible();

      await clickSignOut(page, screenshot);
      await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
      await screenshot.takeScreenshot(page, "samplePagePostLogout");
      await expect(page.locator(`text=${username}`).first()).not.toBeVisible();
      await expect(page.locator(`text=Sign-in to access your resources`).first()).toBeVisible();
    });

    test('Acquire tokens for multi-resources from ADD', async () => {
        const screenshot = new Screenshot(`${screenshotFolder}/acquire-token-for-multi-resource`);
        await page.goto(homeRoute);
        await clickSignIn(page, screenshot);
        await enterCredentials(page, screenshot, username, accountPwd);
        await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
        await expect(page.locator(`text=${username}`).first()).toBeVisible();

        await page.waitForSelector('#acquireTokenGraph');
        await screenshot.takeScreenshot(page, 'samplePagePostLogin');
        page.click('#acquireTokenGraph');
        await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
        await screenshot.takeScreenshot(page, 'samplePageAcquireTokenCallGraph');
        await expect(page.locator(`text=Calling Microsoft Graph API`).first()).toBeVisible();

        await page.goBack();
        await screenshot.takeScreenshot(page, 'samplePageAcquireTokenCallArm');
        await page.waitForSelector('#acquireTokenArm');
        page.click('#acquireTokenArm');
        await page.waitForFunction(`window.location.href.startsWith("${SAMPLE_HOME_URL}")`);
        await expect(page.locator(`text=Calling Azure Resource Manager API`).first()).toBeVisible();
    });
  });
});

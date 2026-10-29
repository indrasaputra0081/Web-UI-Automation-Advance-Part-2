const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test.describe('Login - SauceDemo', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // ===== POSITIVE =====
  test('TC01 - Login success dengan standard_user', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(loginPage.inventoryTitle).toHaveText('Products');

    await expect(page).toHaveScreenshot('login-success.png');
  });

  // ===== NEGATIVE =====
  test('TC02 - Login gagal dengan invalid username', async ({ page }) => {
    await loginPage.login('user_salah', 'secret_sauce');

    await loginPage.expectErrorMessage(
      'Epic sadface: Username and password do not match any user in this service'
    );
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    await expect(page).toHaveScreenshot('login-invalid-username.png');
  });

  test('TC03 - Login gagal dengan wrong password', async ({ page }) => {
    await loginPage.login('standard_user', 'password_salah');

    await loginPage.expectErrorMessage(
      'Epic sadface: Username and password do not match any user in this service'
    );
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    await expect(page).toHaveScreenshot('login-wrong-password.png');
  });

  test('TC04 - Login gagal dengan locked_out_user', async ({ page }) => {
    await loginPage.login('locked_out_user', 'secret_sauce');

    await loginPage.expectErrorMessage(
      'Epic sadface: Sorry, this user has been locked out.'
    );
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    await expect(page).toHaveScreenshot('login-locked-out.png');
  });
});
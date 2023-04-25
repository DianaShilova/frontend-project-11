import { test, expect } from '@playwright/test';

const successUrl = 'https://lorem-rss.hexlet.app/feed?unit=second&interval=30';

// test('not empty url', async ({page}) => {
//     await page.goto('http://localhost:8080/');
//     await page.getByText('Добавить').click();
//     const warning = await page.getByText('Не должно быть пустым');
//     await expect(warning).toBeVisible();
// })

test('success url', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await page.getByPlaceholder('ссылка RSS').fill(successUrl);
  await page.getByText('Добавить').click();
  const message = await page.getByText('RSS успешно загружен');
  await expect(message).toBeVisible();
});

test('duplicate url', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await page.getByPlaceholder('ссылка RSS').fill(successUrl);
  await page.getByText('Добавить').click();
  await page.waitForTimeout(2000);
  await page.getByPlaceholder('ссылка RSS').fill(successUrl);
  await page.getByText('Добавить').click();
  await page.waitForTimeout(2000);
  const message = await page.getByText('RSS уже существует');
  await expect(message).toBeVisible();
});

test('wrong url', async ({ page }) => {
  const wrongUrl = 'https://lorem-rss';
  await page.goto('http://localhost:8080/');
  await page.getByPlaceholder('ссылка RSS').fill(wrongUrl);
  await page.getByText('Добавить').click();
  const message = await page.getByText('Ссылка должна быть валидным URL');
  await expect(message).toBeVisible();
});

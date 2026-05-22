import { expect, test } from "@playwright/test";

const mojibakePattern = /(Ã|Â|â€“|â€”|â€¦|�)/;

async function expectNoMojibake(page) {
  const bodyText = await page.locator("body").innerText();
  expect(bodyText, "Svenska tecken ska visas rätt, inte som mojibake").not.toMatch(mojibakePattern);
}

test.describe("Brewscape GUI och användbarhet", () => {
  test("TC-001 startsidan laddas utan crash och visar huvudnavigation", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/.+/);
    await expect(page.getByRole("link", { name: /Brewscape hem/i })).toBeVisible();
    if (test.info().project.name.includes("mobile")) {
      await expect(page.getByRole("button", { name: /Öppna meny|Stäng meny/i })).toBeVisible();
    } else {
      await expect(page.getByRole("navigation", { name: /Huvudnavigering/i })).toBeVisible();
    }
    await expect(page.getByRole("main")).toBeVisible();
    await expectNoMojibake(page);
  });

  test("TC-002 navigation till produkter och detaljsida fungerar", async ({ page }) => {
    await page.goto("/");
    if (test.info().project.name.includes("mobile")) {
      await page.getByRole("button", { name: /Öppna meny|Stäng meny/i }).click();
      await page.getByRole("navigation", { name: /Mobilnavigering/i }).getByRole("link", { name: /^Produkter$/i }).click();
    } else {
      await page.getByRole("link", { name: /^Produkter$/i }).first().click();
    }
    await expect(page).toHaveURL(/\/products/);
    await expect(page.getByRole("heading", { name: "Produkter" })).toBeVisible();

    const firstProduct = page.locator("article").first();
    await expect(firstProduct).toBeVisible();
    await firstProduct.getByRole("link").first().click();
    await expect(page).toHaveURL(/\/products\//);
    await expect(page.getByRole("main")).toBeVisible();
    await expectNoMojibake(page);
  });

  test("TC-003 sök/filter ger tydlig återkoppling och kan rensas", async ({ page }) => {
    await page.goto("/products");
    const search = page.getByRole("searchbox", { name: /sök produkter/i });
    await expect(search).toBeVisible();

    await search.fill("kvarn");
    await expect(page.getByText(/Visar .* produkter|Inga produkter hittades/i)).toBeVisible();
    await expect(page.getByText(/Sök: "kvarn"/i)).toBeVisible();

    await page.getByRole("button", { name: /Rensa sökning|Ta bort sökfilter/i }).first().click();
    await expect(search).toHaveValue("");
  });

  test("TC-004 kundvagn och kassa visar valideringsfel för tomma obligatoriska fält", async ({ page }) => {
    await page.goto("/products");
    await page.getByRole("button", { name: /Lägg i kundvagn|Lägg i korgen/i }).first().click();
    await page.getByRole("link", { name: /Kundvagn/i }).click();
    await expect(page).toHaveURL(/\/checkout/);

    await page.getByRole("button", { name: /Lägg beställning/i }).click();
    await expect(page.getByText("Fullständigt namn krävs.")).toBeVisible();
    await expect(page.getByText(/e-postadress krävs/i)).toBeVisible();
    await expect(page.getByText(/kortnummer krävs/i)).toBeVisible();
  });

  test("TC-005 mobilvy har ingen horisontell overflow och meny kan öppnas", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow, "Mobilvy ska inte ha horisontell overflow").toBe(false);

    await page.getByRole("button", { name: /Öppna meny|Stäng meny/i }).click();
    await expect(page.getByRole("navigation", { name: /Mobilnavigering/i })).toBeVisible();
  });

  test("TC-006 tangentbord kan nå viktiga länkar och visar fokus", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toBeVisible();

    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab");
      const focusedText = await page.locator(":focus").innerText().catch(() => "");
      const focusedLabel = await page.locator(":focus").getAttribute("aria-label").catch(() => "");
      if (`${focusedText} ${focusedLabel}`.match(/Produkter|Kundvagn|Logga in|Brewscape/i)) return;
    }

    throw new Error("Tangentbordsfokus nådde inte en viktig navigation/länk inom 8 Tab-tryck");
  });

  test("TC-007 specialtecken i sökfält kraschar inte appen", async ({ page }) => {
    await page.goto("/products");
    await page.getByRole("searchbox", { name: /sök produkter/i }).fill("<script>alert(1)</script> 😈 ' OR 1=1 --");
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByText(/Inga produkter hittades|Visar .* produkter/i).first()).toBeVisible();
  });

  test("TC-008 grundläggande a11y-check: inputs ska ha tillgängliga namn", async ({ page }) => {
    await page.goto("/checkout");
    await page.getByRole("link", { name: /Bläddra bland produkter/i }).click();
    await page.getByRole("button", { name: /Lägg i kundvagn|Lägg i korgen/i }).first().click();
    await page.getByRole("link", { name: /Kundvagn/i }).click();

    const controls = page.locator("input, select, textarea, button, a");
    const count = await controls.count();
    const unnamed = [];
    for (let i = 0; i < count; i++) {
      const control = controls.nth(i);
      if (!(await control.isVisible())) continue;
      const tag = await control.evaluate((el) => el.tagName.toLowerCase());
      const text = (await control.innerText().catch(() => "")).trim();
      const aria = await control.getAttribute("aria-label");
      const labelledBy = await control.getAttribute("aria-labelledby");
      const title = await control.getAttribute("title");
      const id = await control.getAttribute("id");
      const label = id ? await page.locator(`label[for="${id}"]`).count() : 0;
      const placeholder = await control.getAttribute("placeholder");
      if (!text && !aria && !labelledBy && !title && !label && tag !== "a" && !placeholder) {
        unnamed.push(`${tag}${id ? `#${id}` : ""}`);
      }
    }
    expect(unnamed, `Synliga kontroller saknar tillgängligt namn: ${unnamed.join(", ")}`).toEqual([]);
  });
});

describe('Home Screen', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have welcome screen', async () => {
    await expect(element(by.id('welcome'))).toBeVisible();
  });

  it('check register a new skill', async () => {
    const inputNewSkill = await element(by.id('input-new'));
    const buttonAdd = await element(by.id('button-add'));

    await inputNewSkill.tap();
    await inputNewSkill.typeText('React Native');
    await buttonAdd.tap();
  });
});
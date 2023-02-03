require("ts-node/register");

import { setHeadlessWhen, setCommonPlugins } from "@codeceptjs/configure";
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(!process.env.SHOW_E2E_TESTS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

export const config = {
    tests: "./tests/*_test.ts",
    output: "./output",
    helpers: {
        Playwright: {
            url: process.env.E2E_TARGET_HOST,
            show: process.env.SHOW_E2E_TESTS,
            browser: "chromium",
            waitForNavigation: "networkidle0",
        },
    },
    // include: {
    //     I: "./steps_file",
    // },
    name: "frontend",
    fullPromiseBased: false,
};

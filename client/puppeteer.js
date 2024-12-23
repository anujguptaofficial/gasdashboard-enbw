import * as pt from "puppeteer";
import puppeteer from "puppeteer-extra";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import UserPreferencesPlugin from "puppeteer-extra-plugin-user-preferences";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const downloadPath = path.resolve(__dirname, "downloads");

puppeteer.use(
  UserPreferencesPlugin({
    userPrefs: {
      "download.default_directory": downloadPath,
      "download.prompt_for_download": false,
    },
  })
);

pt.launch({
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-web-security",
    "--allow-file-access-from-files",
    "--disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure",
  ],
}).then(async (browser) => {
  if (!process.env.puppetteerPassword) {
    throw Error("Missing puppetteerPassword env variable.");
  }
  const p = await browser.newPage();
  await p.setDefaultNavigationTimeout(30000);
  await p.setViewport({ width: 1524, height: 500 });

  await p.goto("https://gasdashboard.tradingmop-gasdashboarddev.enbw.cloud/", {
    waitUntil: "networkidle0",
  });

  //login using AzureAD
  const loginButton = await p.$("input");
  await loginButton.evaluate((b) => b.click());
  await p.waitForSelector("#i0116");

  //close modal
  const closingModal = async () => {
    await p.waitForTimeout(2000);
    await p.waitForSelector(".bricks-modal-header button");
    await p.click(".bricks-modal-header button");
  };

  //testing email
  await p.type("#i0116", "svc_devops-analytics-ui-test@myenbw.onmicrosoft.com");
  await p.waitForSelector("#idSIButton9");
  await p.click("#idSIButton9");

  //password
  await new Promise((resolve) => setTimeout(resolve, 1500));
  await p.waitForSelector("#i0118");
  await p.type("#i0118", process.env.puppetteerPassword);
  let elem;
  await p.evaluate(async () => {
    elem = document.querySelector("input[type=submit]");
    if (elem != null) {
      elem.click();
    }
  });

  //accept to be singned in
  await p.waitForNavigation();
  await p.waitForSelector('input[type="submit"]');
  await p.click('input[type="submit"]');

  // Check if the file exists in the download folder
  async function verifyDownload(downloadPath, fileName) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (fs.existsSync(path.join(downloadPath, fileName))) {
          console.log("File found in download folder!");
          clearInterval(interval);
          resolve(fileName);
        }
      }, 500);
      setTimeout(() => {
        clearInterval(interval);
        console.log("file downloaded successfully!");
        resolve(fileName);
      }, 10000);
    });
  }

  //Download forecast template
  await p.waitForNavigation();
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const downloadTemplateSeletor = "#downloadtemplate-button";
  await p.waitForSelector(downloadTemplateSeletor);
  await p.click(downloadTemplateSeletor);

  try {
    await verifyDownload(downloadPath, "forecast-template.xlsx");
  } catch (error) {
    console.error("File download failed:", error);
  }

  // click on upload forecast button
  await new Promise((resolve) => setTimeout(resolve, 6000));
  const templateforcastButton = async () => {
    const uploadBtnSelector = "#upload-button";
    await new Promise((resolve) => setTimeout(resolve, 6000));
    await p.waitForSelector(uploadBtnSelector);
    await p.click(uploadBtnSelector);
  };
  await templateforcastButton();

  //upload forecast-template file
  await p.waitForSelector("#custom-file-upload");
  const [forecastfileUploader] = await Promise.all([
    p.waitForFileChooser(),
    p.click("#custom-file-upload"),
  ]);
  await forecastfileUploader.accept(["forecast-template.xlsx"]);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await p.click("#upload");

  //success or error
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await p.waitForSelector("#upload-message");
  await p.evaluate(() => {
    let el = document.querySelector("#upload-message");
    if (!el) {
      throw Error("Upload failed");
    } else {
      console.log("FIle uploaded Succefully");
    }
  });

  //***********---- Starting here, the test will be done on Netherlands Page ----***********//

  await p.goto(
    "https://gasdashboard.tradingmop-gasdashboarddev.enbw.cloud/nl",
    { waitUntil: "networkidle0" }
  );

  // Granularity change
  await p.waitForNavigation();
  await new Promise((resolve) => setTimeout(resolve, 8000));
  await p.waitForSelector("#granularity");
  const dropdown = await p.$("#granularity");
  await dropdown.type("weekly");

  //check if data in table loaded correctly
  const tableData = async () => {
    let productType = await p.evaluate(() => {
      let el = document.querySelector("#errorMessage");
      if (el) {
        throw Error("Failed to load Table data");
      }
    });
  };
  await new Promise((resolve) => setTimeout(resolve, 3500));
  await tableData();

  //file upload
  const uploadButton = async () => {
    const uploadBtnSelector = "#upload-button";
    await new Promise((resolve) => setTimeout(resolve, 6000));
    await p.waitForSelector(uploadBtnSelector);
    await p.click(uploadBtnSelector);
  };
  await uploadButton();

  //uploading scenario
  const scenarioData = async (scenarioId) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await p.waitForSelector(scenarioId);
    await p.click(scenarioId);
    await p.keyboard.down("Control");
    await p.keyboard.press("A");
    await p.keyboard.up("Control");
    await p.keyboard.press("Backspace");
    await p.keyboard.type("puppeteer_testing");
  };
  await scenarioData("#scenarioUpload");

  await p.waitForSelector("#custom-file-upload");
  const [fileUploader] = await Promise.all([
    p.waitForFileChooser(),
    p.click("#custom-file-upload"),
  ]);
  await fileUploader.accept(["forecast.xlsx"]);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await p.click("#upload");

  //throw error
  await p.waitForTimeout(20000);
  await p.waitForSelector("#upload-message");
  await p.evaluate(() => {
    let el = document.querySelector("#upload-message");
    if (!el) {
      throw Error("Upload failed");
    } else {
      console.log("FIle uploaded Succefully");
    }
  });

  //close modal
  await closingModal();

  //selecting scenario
  await scenarioData("#scenario");

  //open another upload for copy paste
  await uploadButton();

  await p.waitForTimeout(2000);
  const file_path = "forecast1.xlsx";
  const copyPasteSelector = "#copy-paste";
  const file_content = fs.existsSync(file_path)
    ? fs.readFileSync(file_path, "utf8")
    : "file not found";
  await p.evaluate((file_content) => {
    console.log("Hi there", file_content);
  }, file_content);

  await p.waitForSelector(copyPasteSelector);
  await p.click(copyPasteSelector);

  //paste-data
  await p.waitForTimeout(4500);
  const textFieldSelector = "#paste-data";
  const uploadSelector = "#upload";
  const textToCopy =
    "DATE\tcon_industry\tcon_ldc\timp_production\timp_norway\timp_de_h\timp_de_l\timp_be_h\timp_be_l\timp_uk\tlinepack\timp_lng\r\n2023-11-15\t0\t0\t0\t0\t0\t0\t0\t0\t0\t0\t0\r\n2023-11-16\t0\t0\t0\t0\t0\t0\t0\t0\t0\t0\t0\r\n2023-11-17\t0\t0\t0\t0\t0\t0\t0\t0\t0\t0\t0\r\n2023-11-18\t0\t0\t0\t0\t0\t0\t0\t0\t0\t0\t0\r\n2023-11-19\t0\t0\t0\t0\t0\t0\t0\t0\t0\t0\t0\r\n2023-11-20\t0\t0\t0\t0\t0\t0\t0\t0\t0\t0\t0\r";
  await p.evaluate((data) => {
    const textarea = document.createElement("textarea");
    textarea.value = data;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
  }, textToCopy);
  await p.focus(textFieldSelector);
  await p.keyboard.down("Control");
  await p.keyboard.press("V");
  await p.keyboard.up("Control");
  await p.waitForTimeout(2000);
  await p.waitForSelector(uploadSelector);
  await p.click(uploadSelector);

  //close modal
  await p.waitForTimeout(9500);
  await closingModal();

  //checking for heading
  const title = async () => {
    if (p.$("title") !== null) {
      let element = await p.$("title");
      let value = await p.evaluate((el) => el.textContent, element);
      await console.log("Text available", value);
    } else {
      throw Error("Category not found");
    }
  };
  await p.waitForTimeout(4000);
  await title();

  //open switchCountry
  const switchCountry = async () => {
    await p.waitForSelector("ul.main-menu-closed li:nth-child(1) span.name");
    console.log("found it");
    await p.evaluate(async () => {
      let button = document.querySelector(
        "ul.main-menu-closed li:nth-child(1) span.name"
      );
      if (button != null) {
        button.click();
      }
    });
  };
  await p.waitForTimeout(2000);
  await switchCountry();

  await p.waitForTimeout(4000);
  await tableData();

  //verifing the granularity value after the category changes.
  await p.waitForSelector("#granularity");
  await p.evaluate(async () => {
    const granValue = document.querySelector("#granularity");
    console.log(granValue.innerText, "granularity value");
  });

  //checking plotting data
  const graphButton = async () => {
    await p.waitForSelector("#graph-button");
    await p.evaluate(async () => {
      let button = document.querySelector("#graph-button");
      if (button != null) {
        button.click();
      }
    });
  };
  await p.waitForTimeout(4000);
  await graphButton();

  //closing graph modal
  await closingModal();

  //opening download button modal
  const downloadButton = async () => {
    await p.waitForSelector(".header-name");
    await p.evaluate(async () => {
      let DownloanClick = document.querySelectorAll(
        ".header-name > .bricks-button"
      )[0];
      if (DownloanClick != null) {
        DownloanClick.click();
      }
    });
  };
  await p.waitForTimeout(4000);
  await downloadButton();

  //Download data form the modal
  const downloadFromToInput = async () => {
    const fromDatePickerInputSelector =
      ".from-to-datepicker .bricks-modal-body > *:nth-child(1) *:nth-child(1) input";
    const toDatePickerInputSelector =
      ".from-to-datepicker .bricks-modal-body > *:nth-child(2) *:nth-child(1) input";
    const downloadButtonSelector = ".bricks-modal-footer button";
    const fromDateValue = "2023-06-15";
    const toDateValue = "2023-06-25";

    await p.waitForSelector(fromDatePickerInputSelector);
    await p.type(fromDatePickerInputSelector, fromDateValue);
    await p.waitForSelector(toDatePickerInputSelector);
    await p.type(toDatePickerInputSelector, toDateValue);

    // Wait for the download button to be enabled
    await p.$eval(toDatePickerInputSelector, (input) =>
      input.dispatchEvent(new Event("change"))
    );

    // Perform actions with the enabled download button
    await p.waitForSelector(downloadButtonSelector);
    await p.click(downloadButtonSelector);
  };
  await p.waitForTimeout(2000);
  await downloadFromToInput();

  //closing download modal
  await closingModal();

  //test BCM toggle
  const toggleSelector = "#bcm-toggle";
  await p.waitForTimeout(2000);
  await p.waitForSelector(toggleSelector);
  await p.click(toggleSelector);
  await p.waitForTimeout(3500);
  await tableData();

  await p.waitForTimeout(10000);
  await browser.close();
});

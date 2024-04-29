import fs from "fs";
import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const urls = fs
    .readFileSync("./txt_files/serviceResourceTypeUrl.txt", "utf-8")
    .split("\n");
  const resourceTypes = [];

  for (const url of urls) {
    try {
      await page.goto(
        `https://docs.aws.amazon.com/ko_kr/AWSCloudFormation/latest/UserGuide/${url}`
      );

      const typesOnPage = await page.$$eval(
        ".itemizedlist ul li",
        (elements) => {
          const types = [];
          elements.forEach((element) => {
            const anchor = element.querySelector("a");
            if (/^[^:]+::\w+::\w+$/.test(anchor.textContent.trim())) {
              const resourceType = {
                resourceType: anchor.textContent.trim(),
                resourceTypeUrl: anchor.getAttribute("href").replace("./", ""),
              };
              types.push(JSON.stringify(resourceType));
            }
          });
          return types;
        }
      );

      resourceTypes.push(...typesOnPage);
    } catch (error) {
      console.error(`Error navigating to ${url}: ${error.message}`);
    }
  }

  fs.writeFile(
    "txt_files/resourceTypes.txt",
    resourceTypes.join("\n"),
    (err) => {
      if (err) {
        console.error("resourceTypes.txt 저장 실패");
        console.error(err);
      } else {
        console.log("resourceTypes.txt 저장 성공");
      }
    }
  );
  await browser.close();
})();

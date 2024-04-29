import fs from "fs";
import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // AWS CloudFormation 문서 사이트로 이동
  await page.goto(
    "https://docs.aws.amazon.com/ko_kr/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html"
  );

  // html.txt 파일에 HTML 저장
  fs.writeFile("txt_files/html.txt", await page.content(), (err) => {
    if (err) {
      console.error("html.txt 저장 실패");
      console.error(err);
    } else {
      console.log("html.txt 저장 성공");
    }
  });

  //serviuceResourceType, serviceResourceTypeUrl 배열 생성

  const serviceResourceScraping = await page.$$eval(
    ".highlights ul li",
    (elements) => {
      const serviceResourceType = [];
      const serviceResourceTypeUrl = [];
      elements.forEach((element) => {
        serviceResourceType.push(element.textContent.trim());
        const anchor = element.querySelector("a");
        if (anchor) {
          const href = anchor.getAttribute("href");
          serviceResourceTypeUrl.push(href.replace("./", ""));
        }
      });
      return { serviceResourceType, serviceResourceTypeUrl };
    }
  );

  // serviuceResourceType, serviceResourceTypeUrl 배열을 텍스트 파일로 저장
  fs.writeFile(
    "txt_files/serviceResourceType.txt",
    serviceResourceScraping.serviceResourceType.join("\n"),
    (err) => {
      if (err) {
        console.error("serviceResourceType.txt 저장 실패");
        console.error(err);
      } else {
        console.log("serviceResourceType.txt 저장 성공");
      }
    }
  );

  fs.writeFile(
    "txt_files/serviceResourceTypeUrl.txt",
    serviceResourceScraping.serviceResourceTypeUrl.join("\n"),
    (err) => {
      if (err) {
        console.error("serviceResourceTypeUrl.txt 저장 실패");
        console.error(err);
      } else {
        console.log("serviceResourceTypeUrl.txt 저장 성공");
      }
    }
  );

  await browser.close();
})();

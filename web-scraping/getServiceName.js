import fs from "fs";

(async () => {
  const resourceData = fs
    .readFileSync("./txt_files/serviceNames.txt", "utf-8")
    .split("\n");
  const serviceNames = [];

  for (const data of resourceData) {
    // const jsonData = JSON.parse(data);
    // const resourceType = jsonData.resourceType;

    // if (!serviceNames.includes(resourceType.match(/::(\w+)::/)[1])) {
    //   serviceNames.push(resourceType.match(/::(\w+)::/)[1]);
    // }
    if (!serviceNames.includes(data)) {
      serviceNames.push(data);
    }
  }
  fs.writeFile("txt_files/serviceNames.txt", serviceNames.join("\n"), (err) => {
    if (err) {
      console.error("serviceNames.txt 저장 실패");
      console.error(err);
    } else {
      console.log("serviceNames.txt 저장 성공");
    }
  });
})();

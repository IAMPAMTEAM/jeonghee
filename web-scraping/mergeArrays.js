import fs from "fs";

(async () => {
  const array1 = JSON.parse(fs.readFileSync("./awsProduct1.json", "utf-8"));
  const array2 = JSON.parse(fs.readFileSync("./awsProduct2.json", "utf-8"));
  const array3 = JSON.parse(fs.readFileSync("./awsProduct3.json", "utf-8"));
  const array4 = JSON.parse(fs.readFileSync("./awsProduct4.json", "utf-8"));
  const array5 = JSON.parse(fs.readFileSync("./awsProduct5.json", "utf-8"));

  function mergeArrays(...arrays) {
    const mergedArray = [].concat(...arrays);
    return mergedArray;
  }

  const mergedArray = JSON.stringify(
    mergeArrays(array1, array2, array3, array4, array5)
  );

  fs.writeFile("finalData.json", mergedArray, (err) => {
    if (err) {
      console.error("finalData.json 저장 실패");
      console.error(err);
    } else {
      console.log("finalData.json 저장 성공");
      console.log(mergedArray.length);
    }
  });
})();

import { response, runGetObjectCommand } from "./common.js";

export const handler = async (event) => {
  const fileName = "awsProductInfo.json";
  const productInfo = await runGetObjectCommand(fileName);
  const httpMethod = event.httpMethod;
  const pathParameters = event.pathParameters;
  console.log("event:" + JSON.stringify(event));
  console.log("event.httpMethod:" + event.httpMethod);
  console.log("event.pathParameters:" + JSON.stringify(event.pathParameters));
  console.log("productInfo:" + JSON.stringify(productInfo));

  switch (httpMethod) {
    case "GET":
      console.log("case GET");
      //전체 읽기
      if (pathParameters === null) {
        return response(200, JSON.stringify(productInfo));
      }
      //특정 컬럼 Data 읽기
      const result = await productInfo.map(function (item) {
        return item[pathParameters.columnName];
      });
      return response(
        200,
        JSON.stringify({ [pathParameters.columnName]: result })
      );
  }
};

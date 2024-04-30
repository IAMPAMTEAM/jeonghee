import { response, findJson, runGetObjectCommand } from "./common.js";

export const handler = async (event) => {
  const fileName = "awsRegionsInfo.json";
  const regionInfo = await runGetObjectCommand(fileName);
  const httpMethod = event.httpMethod;
  const pathParameters = event.pathParameters;
  console.log("event:" + JSON.stringify(event));
  console.log("event.httpMethod:" + event.httpMethod);
  console.log("event.pathParameters:" + JSON.stringify(event.pathParameters));
  console.log("regionInfo:" + JSON.stringify(regionInfo));

  switch (httpMethod) {
    case "GET":
      console.log("case GET");
      //전체 읽기
      if (pathParameters === null) {
        return response(200, JSON.stringify(regionInfo));
      }
      //특정 리전 읽기
      return response(
        200,
        JSON.stringify(
          await findJson(
            regionInfo,
            "awsRegionCode",
            pathParameters.awsRegionCode
          )
        )
      );
  }
};

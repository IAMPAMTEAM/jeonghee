import { response, findJson, runGetObjectCommand } from "./common.js";

export const handler = async (event) => {
  const fileName = "awsCloudformationInfo.json";
  const cloudformationInfo = await runGetObjectCommand(fileName);
  const httpMethod = event.httpMethod;
  const pathParameters = event.pathParameters;
  const queryStringParameters = event.queryStringParameters;
  console.log("event:" + JSON.stringify(event));
  console.log("event.httpMethod:" + event.httpMethod);
  console.log("event.pathParameters:" + JSON.stringify(event.pathParameters));
  console.log("queryStringParameters:" + JSON.stringify(queryStringParameters));
  console.log("cloudformationInfo:" + JSON.stringify(cloudformationInfo));

  switch (httpMethod) {
    case "GET":
      console.log("case GET");
      const result = await findJson(
        cloudformationInfo,
        "awsResourceTypeName",
        pathParameters.awsResourceTypeName
      );
      if (queryStringParameters === null) {
        return response(200, JSON.stringify(result));
      }

      if (queryStringParameters.type === "json") {
        return response(
          200,
          JSON.stringify({
            cloudformation: result.awsResourceTypeCloudformationJson,
          })
        );
      }
      if (queryStringParameters.type === "yaml") {
        return response(
          200,
          JSON.stringify({
            cloudformation: result.awsResourceTypeCloudformationYaml,
          })
        );
      }
  }
};

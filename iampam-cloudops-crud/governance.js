import {
  findJson,
  runGetObjectCommand,
  runPutObjectCommand,
  findIndex,
  response,
} from "./common.js";

export const handler = async (event) => {
  const body = JSON.parse(event.body);
  const fileName = "governanceInfo.json";
  const governanceInfo = await runGetObjectCommand(fileName);
  const httpMethod = event.httpMethod;
  const pathParameters = event.pathParameters;
  console.log("event:" + JSON.stringify(event));
  console.log("event.httpMethod:" + event.httpMethod);
  console.log("event.pathParameters:" + JSON.stringify(event.pathParameters));
  console.log("governanceInfo:" + JSON.stringify(governanceInfo));

  switch (httpMethod) {
    case "GET":
      console.log("case GET");
      if (pathParameters === null) {
        console.log("governanceInfo:" + JSON.stringify(governanceInfo));
        return response(200, JSON.stringify(governanceInfo));
      }
      return response(
        200,
        JSON.stringify(
          await findJson(
            governanceInfo,
            "governanceKey",
            pathParameters.governanceKey
          )
        )
      );

    //JSON 파일의 특정 JSON 수정
    case "PUT":
      console.log("case PUT");
      const index = await findIndex(
        governanceInfo,
        "governanceKey",
        pathParameters.governanceKey
      );
      governanceInfo[index] = body;
      await runPutObjectCommand(fileName, governanceInfo);
      return response(200, JSON.stringify(await runGetObjectCommand(fileName)));

    //JSON 파일에 특정 JSON 추가
    case "POST":
      console.log("case POST");
      governanceInfo.push(body);
      await runPutObjectCommand(fileName, governanceInfo);
      return response(200, JSON.stringify(await runGetObjectCommand(fileName)));

    //JSON 파일의 특정 JSON 삭제
    case "DELETE":
      console.log("case DELETE");
      await runPutObjectCommand(
        fileName,
        await governanceInfo.filter(
          (item) => item.governanceKey !== pathParameters.governanceKey
        )
      );
      return response(200, JSON.stringify(await runGetObjectCommand(fileName)));
  }
};

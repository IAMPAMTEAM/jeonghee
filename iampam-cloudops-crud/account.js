import {
  findJson,
  runGetObjectCommand,
  runPutObjectCommand,
  findIndex,
  response,
} from "./common.js";

export const handler = async (event) => {
  const body = JSON.parse(event.body);
  const fileName = "awsAccountInfo.json";
  const accountInfo = await runGetObjectCommand(fileName);
  const httpMethod = event.httpMethod;
  const pathParameters = event.pathParameters;
  console.log("event:" + JSON.stringify(event));
  console.log("event.httpMethod:" + event.httpMethod);
  console.log("event.pathParameters:" + JSON.stringify(event.pathParameters));
  console.log("accountInfo:" + JSON.stringify(accountInfo));

  switch (httpMethod) {
    //JSON 파일의 특정 JSON 읽기
    case "GET":
      console.log("case GET");
      if (pathParameters === null) {
        console.log("accountInfo:" + JSON.stringify(accountInfo));
        return response(200, JSON.stringify(accountInfo));
      }
      return response(
        200,
        JSON.stringify(
          await findJson(accountInfo, "awsAccount", +pathParameters.awsAccount)
        )
      );

    //JSON 파일의 특정 JSON 수정
    case "PUT":
      console.log("case PUT");
      const index = await findIndex(
        accountInfo,
        "awsAccount",
        +pathParameters.awsAccount
      );
      accountInfo[index] = body;
      await runPutObjectCommand(fileName, accountInfo);
      return response(200, JSON.stringify(await runGetObjectCommand(fileName)));

    //JSON 파일에 특정 JSON 추가
    case "POST":
      console.log("case POST");
      accountInfo.push(body);
      await runPutObjectCommand(fileName, accountInfo);
      return response(200, JSON.stringify(await runGetObjectCommand(fileName)));

    //JSON 파일의 특정 JSON 삭제
    case "DELETE":
      console.log("case DELETE");
      await runPutObjectCommand(
        fileName,
        await accountInfo.filter(
          (item) => item.awsAccount !== +pathParameters.awsAccount
        )
      );
      return response(200, JSON.stringify(await runGetObjectCommand(fileName)));
  }
};

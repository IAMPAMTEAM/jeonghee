import {
  findJson,
  runGetObjectCommand,
  runPutObjectCommand,
  findIndex,
  response,
} from "./common.js";

export const handler = async (event) => {
  const body = JSON.parse(event.body);
  const fileName = "companyInfo.json";
  const companyInfo = await runGetObjectCommand(fileName);
  const httpMethod = event.httpMethod;
  const pathParameters = event.pathParameters;
  console.log("event:" + JSON.stringify(event));
  console.log("event.httpMethod:" + event.httpMethod);
  console.log("event.pathParameters:" + JSON.stringify(event.pathParameters));
  console.log("companyInfo:" + JSON.stringify(companyInfo));

  switch (httpMethod) {
    case "GET":
      console.log("case GET");
      if (pathParameters === null) {
        console.log("pathParameters === null");
        return response(200, JSON.stringify(companyInfo));
      }
      return response(
        200,
        JSON.stringify(
          await findJson(
            companyInfo,
            "companyRegistrationNumber",
            pathParameters.companyRegistrationNumber
          )
        )
      );

    //JSON 파일의 특정 JSON 수정
    case "PUT":
      console.log("case PUT");
      const index = await findIndex(
        companyInfo,
        "companyRegistrationNumber",
        pathParameters.companyRegistrationNumber
      );
      accountInfo[index] = body;
      await runPutObjectCommand(fileName, companyInfo);
      return response(200, JSON.stringify(await runGetObjectCommand(fileName)));

    //JSON 파일에 특정 JSON 추가
    case "POST":
      console.log("case POST");
      companyInfo.push(body);
      await runPutObjectCommand(fileName, companyInfo);
      return response(200, JSON.stringify(await runGetObjectCommand(fileName)));

    //JSON 파일의 특정 JSON 삭제
    case "DELETE":
      console.log("case DELETE");
      await runPutObjectCommand(
        fileName,
        await companyInfo.filter(
          (item) =>
            item.companyRegistrationNumber !==
            pathParameters.companyRegistrationNumber
        )
      );
      return response(200, JSON.stringify(await runGetObjectCommand(fileName)));
  }
};

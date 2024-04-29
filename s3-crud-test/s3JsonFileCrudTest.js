import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
const s3Client = new S3Client();

export const handler = async (event) => {
  const body = JSON.parse(event.body);
  const companyInfo = await runGetObjectCommand();
  const httpMethod = event.httpMethod;
  const pathParameters = event.pathParameters;
  console.log("event:" + JSON.stringify(event));
  console.log("event.httpMethod:" + event.httpMethod);
  console.log("event.pathParameters:" + JSON.stringify(event.pathParameters));
  console.log("companyInfo:" + JSON.stringify(companyInfo));

  switch (httpMethod) {
    //JSON 파일의 특정 JSON 읽기
    case "GET":
      console.log("case GET");
      if (pathParameters === null) {
        console.log("companyInfo:" + JSON.stringify(companyInfo));
        return response(200, JSON.stringify(companyInfo));
      }
      console.log(
        "특정companyInfo:" + JSON.stringify(companyInfo[pathParameters.id - 1])
      );
      return response(200, JSON.stringify(companyInfo[pathParameters.id - 1]));

    //JSON 파일의 특정 JSON 수정
    case "PUT":
      console.log("case PUT");
      companyInfo[pathParameters.id - 1] = body;
      await runPutObjectCommand(companyInfo);
      return response(200, JSON.stringify(await runGetObjectCommand()));

    //JSON 파일에 특정 JSON 추가
    case "POST":
      console.log("case POST");
      companyInfo.push(body);
      await runPutObjectCommand(companyInfo);
      return response(200, JSON.stringify(await runGetObjectCommand()));

    //JSON 파일의 특정 JSON 삭제
    case "DELETE":
      console.log("case DELETE");
      companyInfo.splice(pathParameters.id - 1, 1);
      await runPutObjectCommand(companyInfo);
      return response(200, JSON.stringify(await runGetObjectCommand()));
  }
};

const runGetObjectCommand = async () => {
  const getObjectInput = {
    Bucket: "iampam",
    Key: "test-companyInfo.json",
  };
  const getCommand = new GetObjectCommand(getObjectInput);
  const response = await s3Client.send(getCommand);
  const bodyString = await streamToString(response.Body);

  return JSON.parse(bodyString);
};

const runPutObjectCommand = async (body) => {
  const putObjectInput = {
    Body: JSON.stringify(body),
    Bucket: "iampam",
    Key: "test-companyInfo.json",
  };
  const putCommand = new PutObjectCommand(putObjectInput);
  console.log("runPutObjectCommand response");
  await s3Client.send(putCommand);
};

const streamToString = async (stream) => {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
};

const response = async (statusCode, body) => {
  return {
    statusCode: statusCode,
    body: body,
    headers: {
      "Content-Type": "application/json",
    },
  };
};

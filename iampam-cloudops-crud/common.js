import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
const s3Client = new S3Client();

const restApiFunctions = async (event, bucketName, fileName, key) => {
  const body = JSON.parse(event.body);

  const socialUsersContents = await runGetObjectCommand(bucketName, fileName);
  const httpMethod = event.httpMethod;
  const pathParameters = event.pathParameters;
  console.log("event:" + JSON.stringify(event));
  console.log("event.httpMethod:" + event.httpMethod);
  console.log("event.pathParameters:" + JSON.stringify(event.pathParameters));
  console.log("socialUsersContents:" + JSON.stringify(socialUsersContents));

  switch (httpMethod) {
    //get: list all rows
    case "GET":
      console.log("case GET");
      console.log("socialUsersContents:" + JSON.stringify(socialUsersContents));
      return response(200, JSON.stringify(socialUsersContents));

    //update a row
    case "PUT":
      console.log("case PUT");
      const index = await findIndex(
        socialUsersContents,
        key,
        pathParameters[key]
      );
      socialUsersContents[index] = body;
      await runPutObjectCommand(fileName, socialUsersContents);
      return response(200, JSON.stringify(await runGetObjectCommand(fileName)));

    //create a row
    case "POST":
      console.log("case POST");
      socialUsersContents.push(body);
      await runPutObjectCommand(fileName, socialUsersContents);
      return response(200, JSON.stringify(await runGetObjectCommand(fileName)));

    //JSON 파일의 특정 JSON 삭제
    case "DELETE":
      console.log("case DELETE");
      await runPutObjectCommand(
        fileName,
        await socialUsersContents.filter(
          (item) => item[key] !== pathParameters[key]
        )
      );
      return response(200, JSON.stringify(await runGetObjectCommand(fileName)));
  }
};

const findJson = async (info, key, value) => {
  return info.find(function (item) {
    return item[key] === value;
  });
};

const findIndex = async (info, key, value) => {
  return info.findIndex(function (item) {
    return item[key] === value;
  });
};

const runGetObjectCommand = async (bucketName, fileName) => {
  const getObjectInput = {
    Bucket: bucketName,
    Key: fileName,
  };
  const getCommand = new GetObjectCommand(getObjectInput);
  const response = await s3Client.send(getCommand);
  const bodyString = await streamToString(response.Body);

  return JSON.parse(bodyString);
};

const runPutObjectCommand = async (bucketName, fileName, body) => {
  const putObjectInput = {
    Body: JSON.stringify(body),
    Bucket: bucketName,
    Key: fileName,
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

export { restApiFunctions };

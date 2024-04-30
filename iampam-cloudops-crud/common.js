import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
const s3Client = new S3Client();

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

const runGetObjectCommand = async (fileName) => {
  const getObjectInput = {
    Bucket: "iampam",
    Key: `cloud_ops/${fileName}`,
  };
  const getCommand = new GetObjectCommand(getObjectInput);
  const response = await s3Client.send(getCommand);
  const bodyString = await streamToString(response.Body);

  return JSON.parse(bodyString);
};

const runPutObjectCommand = async (fileName, body) => {
  const putObjectInput = {
    Body: JSON.stringify(body),
    Bucket: "iampam",
    Key: `cloud_ops/${fileName}`,
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

export {
  findJson,
  findIndex,
  runGetObjectCommand,
  runPutObjectCommand,
  streamToString,
  response,
};

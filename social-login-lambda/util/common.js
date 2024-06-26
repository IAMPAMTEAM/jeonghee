import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client();
const info = {
  bucketName: process.env.BUCKET_NAME,
  fileName: process.env.FILE_NAME,
  key: process.env.JSON_KEY,
};

//json에서 key와 value로 검색
const findJson = async (info, key, value) => {
  return info.find(function (item) {
    return item[key] === value;
  });
};

const streamToString = async (stream) => {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
};

//매개변수: info
const runGetObjectCommand = async ({ bucketName, fileName }) => {
  const getObjectInput = {
    Bucket: bucketName,
    Key: fileName,
  };
  const getCommand = new GetObjectCommand(getObjectInput);
  const response = await s3Client.send(getCommand);
  const bodyString = await streamToString(response.Body);

  return JSON.parse(bodyString);
};

//매개변수: info, body
const runPutObjectCommand = async ({ bucketName, fileName }, body) => {
  const putObjectInput = {
    Body: JSON.stringify(body),
    Bucket: bucketName,
    Key: fileName,
  };
  const putCommand = new PutObjectCommand(putObjectInput);
  console.log("runPutObjectCommand response");
  await s3Client.send(putCommand);
};

const getCurrentTimeInKST = async () => {
  const now = new Date();

  // 한국 표준시 (KST)는 UTC+9입니다.
  const utcOffset = 9 * 60 * 60 * 1000;
  const kstTime = new Date(now.getTime() + utcOffset);

  const year = kstTime.getUTCFullYear();
  const month = String(kstTime.getUTCMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더함
  const day = String(kstTime.getUTCDate()).padStart(2, "0");
  const hours = String(kstTime.getUTCHours()).padStart(2, "0");
  const minutes = String(kstTime.getUTCMinutes()).padStart(2, "0");
  const seconds = String(kstTime.getUTCSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} KST`;
};

//사용자 정보 가져오기
const socialUsersData = await runGetObjectCommand(info);

export {
  findJson,
  runGetObjectCommand,
  runPutObjectCommand,
  getCurrentTimeInKST,
  socialUsersData,
};

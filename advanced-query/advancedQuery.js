import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import csv from "csv-parser";
import {
  ConfigServiceClient,
  SelectResourceConfigCommand,
} from "@aws-sdk/client-config-service";
import { fromUtf8 } from "@aws-sdk/util-utf8-node";

const s3Client = new S3Client({ region: "ap-northeast-2" });
const configClient = new ConfigServiceClient({ region: "ap-northeast-2" });

export const handler = async (event) => {
  const csvFile = await getCSV();
  const queryList = await getQueryList(csvFile);
  console.log(queryList);

  await Promise.all(
    queryList.map(async (query) => {
      putFileToS3(query.name, await getQueryResult(query.query));
    })
  );
};

//csv파일에서 queryList 추출
const getQueryList = async (csvFile) => {
  console.log("csvFile:" + csvFile);
  let queryList = [];
  for (let i = 0; i < csvFile.length; i++) {
    queryList.push({
      name: csvFile[i].Name,
      query: csvFile[i].SqlQuery.replace(/\n/g, " "),
    });
  }
  console.log(queryList);
  return queryList;
};

//S3의 csv파일을 JSON으로 변환하여 조회
const getCSV = async () => {
  const params = {
    Bucket: "iampam",
    Key: "advancedQuery.csv",
  };

  try {
    // S3 객체 읽기
    const data = await s3Client.send(new GetObjectCommand(params));

    // CSV 파싱하여 JSON으로 변환
    const jsonResult = await new Promise((resolve, reject) => {
      const results = [];
      data.Body.pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(results))
        .on("error", (error) => reject(error));
    });
    return jsonResult;
  } catch (err) {
    console.error(err);
  }
};

//S3에 파일 넣기
const putFileToS3 = async (name, queryResult) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  const params = {
    Bucket: "iampam",
    Key: `advancedQuery/${year}${month}${day}/${name}.json`,
    Body: fromUtf8(JSON.stringify(queryResult)),
    ContentType: "application/json",
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
  } catch (err) {
    console.error(err);
  }
};

const getQueryResult = async (query) => {
  const params = {
    Expression: query,
    Limit: 100, // 결과 제한 설정
  };

  try {
    const command = new SelectResourceConfigCommand(params);
    const response = await configClient.send(command);
    return response.Results;
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

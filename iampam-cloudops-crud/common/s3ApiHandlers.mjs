import {
  findIndex,
  runGetObjectCommand,
  runPutObjectCommand,
  response,
} from "./common.mjs";

const handleRestApiRequest = async (event, { bucketName, fileName, key }) => {
  const body = JSON.parse(event.body);
  const jsonContent = await runGetObjectCommand(bucketName, fileName);
  const httpMethod = event.httpMethod;
  let pathParameterValue = null;
  if (event.pathParameters) {
    const strParameterValue = event.pathParameters[key];
    pathParameterValue =
      !isNaN(strParameterValue) && strParameterValue.trim() !== ""
        ? Number(strParameterValue)
        : strParameterValue;
  }
  console.log("event:" + JSON.stringify(event));
  console.log("event.httpMethod:" + event.httpMethod);
  console.log("event.pathParameters:" + JSON.stringify(event.pathParameters));
  console.log("jsonContent:" + JSON.stringify(jsonContent));

  switch (httpMethod) {
    case "GET":
      return await listAllRows(jsonContent);

    case "PUT":
      return await updateARows(
        bucketName,
        fileName,
        jsonContent,
        key,
        await pathParameterValue,
        body
      );

    case "POST":
      return await createARow(bucketName, fileName, jsonContent, body);

    case "DELETE":
      if (!pathParameterValue) {
        return await deleteAllRows(bucketName, fileName);
      }
      return await deleteARow(
        bucketName,
        fileName,
        jsonContent,
        key,
        await pathParameterValue
      );
  }
};

const listAllRows = async (jsonContent) => {
  console.log("case GET");
  console.log("jsonContent:" + JSON.stringify(jsonContent));
  return response(200, JSON.stringify(jsonContent));
};

const updateARows = async (
  bucketName,
  fileName,
  jsonContent,
  key,
  pathParameterValue,
  body
) => {
  console.log("case PUT");
  const index = await findIndex(jsonContent, key, pathParameterValue);
  jsonContent[index] = body;
  await runPutObjectCommand(bucketName, fileName, jsonContent);
  return response(
    200,
    JSON.stringify(await runGetObjectCommand(bucketName, fileName))
  );
};

const createARow = async (bucketName, fileName, jsonContent, body) => {
  console.log("case POST");
  jsonContent.push(...body);
  await runPutObjectCommand(bucketName, fileName, jsonContent);
  return response(
    200,
    JSON.stringify(await runGetObjectCommand(bucketName, fileName))
  );
};

const deleteAllRows = async (bucketName, fileName) => {
  await runPutObjectCommand(bucketName, fileName, JSON.parse("[]"));
  return response(200, "[success]: delete all rows");
};

const deleteARow = async (
  bucketName,
  fileName,
  jsonContent,
  key,
  pathParameterValue
) => {
  //delete a row
  console.log("case DELETE");
  await runPutObjectCommand(
    bucketName,
    fileName,
    await jsonContent.filter((item) => item[key] !== pathParameterValue)
  );
  return response(
    200,
    JSON.stringify(await runGetObjectCommand(bucketName, fileName))
  );
};

export { handleRestApiRequest };

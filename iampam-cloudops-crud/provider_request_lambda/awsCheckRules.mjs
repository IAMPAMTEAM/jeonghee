import { handleRestApiRequest } from "../common/s3ApiHandlers.mjs";

const info = {
  bucketName: "iampam-provider",
  fileName: "provider/awsCheckRules.json",
  key: "checkRuleName",
};

export const handler = async (event) => {
  return await handleRestApiRequest(event, info);
};

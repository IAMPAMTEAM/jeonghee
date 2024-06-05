import { handleRestApiRequest } from "../common/s3ApiHandlers.mjs";

const info = {
  bucketName: "iampam-provider",
  fileName: "provider/tenants.json",
  key: "companyRegistrationNumber",
};

export const handler = async (event) => {
  return await handleRestApiRequest(event, info);
};

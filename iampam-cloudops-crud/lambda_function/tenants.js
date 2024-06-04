import { restApiFunctions } from "../common.js";
const bucketName = "iampam-provider";
const fileName = "provider/tenants.json";
const key = "companyRegistrationNumber";

export const handler = async (event) => {
  restApiFunctions(event, bucketName, fileName, key);
};

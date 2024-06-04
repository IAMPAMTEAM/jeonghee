import { restApiFunctions } from "../common.js";
const bucketName = "iampam-provider";
const fileName = "provider/awsProducts.json";
const key = "awsResourceType";

export const handler = async (event) => {
  restApiFunctions(event, bucketName, fileName, key);
};

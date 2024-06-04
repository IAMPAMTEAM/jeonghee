import { restApiFunctions } from "../common.js";
const bucketName = "iampam-provider";
const fileName = "provider/awsAccount.json";
const key = "awsAccount";

export const handler = async (event) => {
  restApiFunctions(event, bucketName, fileName, key);
};

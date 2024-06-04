import { restApiFunctions } from "../common.js";
const bucketName = "iampam-provider";
const fileName = "provider/awsCheckRules.json";
const key = "checkRuleName";

export const handler = async (event) => {
  restApiFunctions(event, bucketName, fileName, key);
};

import { restApiFunctions } from "../common.js";
const bucketName = "iampam-provider";
const fileName = "provider/awsRegions.json";
const key = "awsRegionCode";

export const handler = async (event) => {
  restApiFunctions(event, bucketName, fileName, key);
};

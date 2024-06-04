import { restApiFunctions } from "../common.js";
const bucketName = "iampam-provider";
const fileName = "provider/socialUsers.json";
const key = "socialEmail";

export const handler = async (event) => {
  restApiFunctions(event, bucketName, fileName, key);
};

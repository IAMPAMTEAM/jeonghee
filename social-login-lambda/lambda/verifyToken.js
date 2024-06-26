import { response } from "../util/response.js";

export const handler = async (event) => {
  const origin = event.headers.origin;
  console.log("event", event);
  return response(200, { message: "Pass Authorizer!" }, origin);
};

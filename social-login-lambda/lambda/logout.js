import { responseWithCookie } from "../util/response.js";

export const handler = async (event) => {
  console.log("event", event);
  const origin = event.headers.origin;
  const cookie = `Authorization=; HttpOnly; Path=/; SameSite=None; Secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
  return await responseWithCookie(200, { message: "logout!" }, cookie, origin);
};

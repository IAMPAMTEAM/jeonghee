import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const handler = async (event) => {
  console.log("Authorizer invoked");
  console.log("Event:", JSON.stringify(event));

  const token = getTokenFromCookie(event.headers.Cookie);
  // event.authorizationToken || (event.headers && event.headers.Authorization);
  console.log(token);
  if (!token) {
    console.error("No token found");
    return generatePolicy("user", "Deny", event.methodArn);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    console.log("Token verified:", decoded);
    return generatePolicy(
      decoded.socialEmail,
      "Allow",
      event.methodArn,
      decoded
    );
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return generatePolicy("user", "Deny", event.methodArn);
  }
};

const generatePolicy = (principalId, effect, resource, decoded) => {
  if (effect && resource) {
    const authResponse = {
      principalId,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: effect,
            Resource: resource,
          },
        ],
      },
      context: decoded,
    };
    console.log(authResponse);
    return authResponse;
  }
};
const getTokenFromCookie = (cookieHeader) => {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split("; ");
  const authCookie = cookies.find((cookie) =>
    cookie.startsWith("Authorization=Bearer ")
  );
  if (!authCookie) return null;
  return authCookie.split("Authorization=Bearer ")[1];
};

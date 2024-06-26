const allowedOrigins = [
  "http://localhost:5173",
  "https://iampam.io",
  "https://www.iampam.io",
  "http://localhost:3000",
];

const headers = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Headers":
    "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Cookie'",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Content-Type": "application/json",
};

// origin = event.headers.origin

const handleOptionsRequest = (origin) => {
  headers["Access-Control-Allow-Origin"] = allowedOrigins.includes(origin)
    ? origin
    : null;

  return {
    statusCode: 204,
    headers: headers,
  };
};

const response = async (statusCode, body, origin = undefined) => {
  if (origin !== undefined) {
    headers["Access-Control-Allow-Origin"] = allowedOrigins.includes(origin)
      ? origin
      : null;
  }
  console.log("response headers", headers);
  return {
    statusCode: statusCode,
    body: JSON.stringify(body),
    headers: headers,
  };
};

const responseWithCookie = async (
  statusCode,
  body,
  cookie,
  origin = undefined
) => {
  if (origin !== undefined) {
    headers["Access-Control-Allow-Origin"] = allowedOrigins.includes(origin)
      ? origin
      : null;
  }
  headers["Set-Cookie"] = cookie;
  console.log("response headers", headers);
  return {
    statusCode: statusCode,
    body: JSON.stringify(body),
    headers: headers,
  };
};

export { response, responseWithCookie, handleOptionsRequest };

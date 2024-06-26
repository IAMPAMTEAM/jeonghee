import {
  getCurrentTimeInKST,
  findJson,
  socialUsersData,
} from "../util/common.js";
import {
  response,
  responseWithCookie,
  handleOptionsRequest,
} from "../util/response.js";
import { generateToken } from "../util/jwt.js";

export const handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin;
  console.log("event", event);
  console.log("origin", origin);
  if (event.httpMethod === "OPTIONS") {
    console.log("OPTIONS");
    return handleOptionsRequest(origin);
  }
  const newSocialUser = JSON.parse(event.body).userInfo;
  console.log("newSocialUser", newSocialUser);
  newSocialUser.lastLogin = await getCurrentTimeInKST();
  const findUser = await findJson(
    socialUsersData,
    "socialEmail",
    newSocialUser.socialEmail
  );
  console.log("findUser", findUser);

  try {
    if (findUser == undefined) {
      await fetch(
        "https://z0ykb6o0hk.execute-api.ap-northeast-2.amazonaws.com/dev/socialusers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([newSocialUser]),
        }
      );

      const token = await generateToken(newSocialUser);
      const cookie = `Authorization=Bearer ${token}; HttpOnly; Path=/; SameSite=None;`;

      return await responseWithCookie(
        200,
        {
          isRegistered: true,
          data: {
            token: token,
            userInfo: newSocialUser,
          },
        },
        cookie,
        origin
      );
    } else {
      return await response(
        400,
        { errorMessage: "User already registered." },
        origin
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return await response(
      400,
      {
        errorName: error.name,
        errorMessage: error.message,
      },
      origin
    );
  }
};

/*
// console.log(event)

resource: '/signup',
  path: '/signup',
  httpMethod: 'POST',
  headers: {
    Accept: '*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'CloudFront-Forwarded-Proto': 'https',
    'CloudFront-Is-Desktop-Viewer': 'true',
    'CloudFront-Is-Mobile-Viewer': 'false',
    'CloudFront-Is-SmartTV-Viewer': 'false',
    'CloudFront-Is-Tablet-Viewer': 'false',
    'CloudFront-Viewer-ASN': '4766',
    'CloudFront-Viewer-Country': 'KR',
    'Content-Type': 'application/json',
    Host: 'zi0bc64zck.execute-api.ap-northeast-2.amazonaws.com',
    'Postman-Token': '19fc91e2-b493-4c37-9e9e-84ad877db038',
    'User-Agent': 'PostmanRuntime/7.39.0',
    Via: '1.1 bfad77da64cd65a36fcbbe44acb655e8.cloudfront.net (CloudFront)',
    'X-Amz-Cf-Id': 'JK4qano56FpZc8mq3U0LYkfAyy9f98QW-gV9euZwkGeehCqCbZfa9w==',
    'X-Amzn-Trace-Id': 'Root=1-6675559d-2684081612f72ad45e6ac1a6',
    'X-Forwarded-For': '210.204.83.69, 15.158.5.78',
    'X-Forwarded-Port': '443',
    'X-Forwarded-Proto': 'https'
  },
  multiValueHeaders: {
    Accept: [ '*' ],
    'Accept-Encoding': [ 'gzip, deflate, br' ],
    'Cache-Control': [ 'no-cache' ],
    'CloudFront-Forwarded-Proto': [ 'https' ],
    'CloudFront-Is-Desktop-Viewer': [ 'true' ],
    'CloudFront-Is-Mobile-Viewer': [ 'false' ],
    'CloudFront-Is-SmartTV-Viewer': [ 'false' ],
    'CloudFront-Is-Tablet-Viewer': [ 'false' ],
    'CloudFront-Viewer-ASN': [ '4766' ],
    'CloudFront-Viewer-Country': [ 'KR' ],
    'Content-Type': [ 'application/json' ],
    Host: [ 'zi0bc64zck.execute-api.ap-northeast-2.amazonaws.com' ],
    'Postman-Token': [ '19fc91e2-b493-4c37-9e9e-84ad877db038' ],
    'User-Agent': [ 'PostmanRuntime/7.39.0' ],
    Via: [
      '1.1 bfad77da64cd65a36fcbbe44acb655e8.cloudfront.net (CloudFront)'
    ],
    'X-Amz-Cf-Id': [ 'JK4qano56FpZc8mq3U0LYkfAyy9f98QW-gV9euZwkGeehCqCbZfa9w==' ],
    'X-Amzn-Trace-Id': [ 'Root=1-6675559d-2684081612f72ad45e6ac1a6' ],
    'X-Forwarded-For': [ '210.204.83.69, 15.158.5.78' ],
    'X-Forwarded-Port': [ '443' ],
    'X-Forwarded-Proto': [ 'https' ]
  },
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  pathParameters: null,
  stageVariables: null,
  requestContext: {
    resourceId: 'irewzt',
    resourcePath: '/signup',
    httpMethod: 'POST',
    extendedRequestId: 'ZtpQsGtIIE0EJQg=',
    requestTime: '21/Jun/2024:10:27:41 +0000',
    path: '/dev/signup',
    accountId: '330886885966',
    protocol: 'HTTP/1.1',
    stage: 'dev',
    domainPrefix: 'zi0bc64zck',
    requestTimeEpoch: 1718965661739,
    requestId: 'c6607f4a-8aa3-4bf6-87d4-595b35cfe5c5',
    identity: {
      cognitoIdentityPoolId: null,
      accountId: null,
      cognitoIdentityId: null,
      caller: null,
      sourceIp: '210.204.83.69',
      principalOrgId: null,
      accessKey: null,
      cognitoAuthenticationType: null,
      cognitoAuthenticationProvider: null,
      userArn: null,
      userAgent: 'PostmanRuntime/7.39.0',
      user: null
    },
    domainName: 'zi0bc64zck.execute-api.ap-northeast-2.amazonaws.com',
    deploymentId: 'efz9fr',
    apiId: 'zi0bc64zck'
  },
  body: '{\r\n' +
    '\t"userInfo": {\r\n' +
    '\t  "userId": "1",\r\n' +
    '\t  "profileImage": "https://iampam-cloudops.s3.ap-northeast-2.amazonaws.com/provider/socialusers/waniskim.jpg",\r\n' +
    '\t  "displayName": "김완중",\r\n' +
    '\t  "socialEmail": "waniskim@gmail.com",\r\n' +
    '\t  "emailStatus": "emailVerified",\r\n' +
    '\t  "loginIpaddress": "14.63.67.15",\r\n' +
    '\t  "geoLocation": "KR",\r\n' +
    '\t  "loginLocation": "14.63.67.15(KR)",\r\n' +
    '\t  "lastLogin": "2024-05-07 14:30:12 KST",\r\n' +
    '\t  \n' +
    '\t  "companyEmail": "wanis@mz.co.kr",\r\n' +
    '\t  "hashedPassword": "1234"\r\n' +
    '\t}\r\n' +
    '}',
  isBase64Encoded: false
}
*/

import { OAuth2Client } from "google-auth-library";
import {
  findJson,
  getCurrentTimeInKST,
  socialUsersData,
} from "../util/common.js";
import { generateToken } from "../util/jwt.js";
import {
  response,
  responseWithCookie,
  handleOptionsRequest,
} from "../util/response.js";
import geoip from "geoip-lite";

export const handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin;
  console.log("event", event);
  console.log("origin", origin);
  if (event.httpMethod === "OPTIONS") {
    console.log("OPTIONS");
    return handleOptionsRequest(origin);
  }

  const path = event.path;
  const sourceIp = event.requestContext.identity.sourceIp;
  const { clientId, credential } = JSON.parse(event.body);

  switch (path) {
    // 클라이언트가 구글에서 받은 Token을 검증하고, 신규/기존 유저인지 확인하여 결과 전송
    case "/login/google":
      const payload = await verifyGoogleIdToken(clientId, credential).catch(
        console.error
      );
      const user = await findUser(payload.email);
      console.log("user: " + JSON.stringify(user));
      const geo = geoip.lookup(sourceIp).country;

      if (user == undefined) {
        const newSocialUser = {
          profileImage: payload?.picture,
          displayName: payload?.name,
          socialEmail: payload.email,
          emailStatus: payload.email_verified
            ? "emailVerified"
            : "emailNotVerified",
          loginIpaddress: sourceIp,
          geoLocation: geo,
          loginLocation: `${sourceIp}(${geo})`,
          lastLogin: "",
        };
        console.log("newSocialUser", newSocialUser);
        return await response(
          200,
          {
            isRegistered: false,
            data: { userInfo: newSocialUser },
          },
          origin
        );
      }

      user.loginIpaddress = sourceIp;
      user.lastLogin = await getCurrentTimeInKST();

      await fetch(
        `https://z0ykb6o0hk.execute-api.ap-northeast-2.amazonaws.com/dev/socialusers/${user.socialEmail}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

      const token = await generateToken(user);
      const expireDate = new Date(Date.now() + 1000 * 60 * 60 * 5); // 5hours
      const cookie = `Authorization=Bearer ${token}; HttpOnly; Path=/; SameSite=None; Secure; Expires=${expireDate};`;

      return await responseWithCookie(
        200,
        {
          isRegistered: true,
          data: { token: token, userInfo: user },
        },
        cookie,
        origin
      );

    default:
      console.error("Invalid provider. path: " + path);
      return await response(
        404,
        { errorMessage: `Invalid provider. path: ${path}` },
        origin
      );
  }
};

//구글 ID 토큰 검증
const verifyGoogleIdToken = async (clientId, credential) => {
  const client = new OAuth2Client(clientId);
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    const payload = ticket.getPayload();
    console.log("ticket: " + JSON.stringify(ticket));
    console.log("payload: " + JSON.stringify(payload));
    return payload;
  } catch (error) {
    console.log(error);
    return await response(500, {
      errorName: error.name,
      errorMessage: error.message,
    });
  }
};

//사용자 정보 찾기
const findUser = async (userEmail) => {
  return await findJson(socialUsersData, "socialEmail", userEmail);
};

/**
 //console.log(event)
 
 {
  resource: '/login/{provider}',
  path: '/login/google',
  httpMethod: 'POST',
  headers: {
    Accept: '/*',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5',
    'CloudFront-Forwarded-Proto': 'https',
    'CloudFront-Is-Desktop-Viewer': 'true',
    'CloudFront-Is-Mobile-Viewer': 'false',
    'CloudFront-Is-SmartTV-Viewer': 'false',
    'CloudFront-Is-Tablet-Viewer': 'false',
    'CloudFront-Viewer-ASN': '4766',
    'CloudFront-Viewer-Country': 'KR',
    'content-type': 'application/json',
    Host: 'zi0bc64zck.execute-api.ap-northeast-2.amazonaws.com',
    origin: 'http://localhost:5173',
    priority: 'u=1, i',
    Referer: 'http://localhost:5173/',
    'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    Via: '2.0 cf4ceb3336927d8695e07607ff3ce1fa.cloudfront.net (CloudFront)',
    'X-Amz-Cf-Id': 'ptyRRQZ6sPsubhBXgPH1145NiYKYgoFGPprgsR3LpxfnhKh-Ey4XsA==',
    'X-Amzn-Trace-Id': 'Root=1-66755631-3b96f0f73cb9b21a48227969',
    'X-Forwarded-For': '210.204.83.69, 130.176.126.156',
    'X-Forwarded-Port': '443',
    'X-Forwarded-Proto': 'https'
  },
  multiValueHeaders: {
    Accept: [ '/*' ],
    'Accept-Encoding': [ 'gzip, deflate, br, zstd' ],
    'Accept-Language': [ 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5' ],
    'CloudFront-Forwarded-Proto': [ 'https' ],
    'CloudFront-Is-Desktop-Viewer': [ 'true' ],
    'CloudFront-Is-Mobile-Viewer': [ 'false' ],
    'CloudFront-Is-SmartTV-Viewer': [ 'false' ],
    'CloudFront-Is-Tablet-Viewer': [ 'false' ],
    'CloudFront-Viewer-ASN': [ '4766' ],
    'CloudFront-Viewer-Country': [ 'KR' ],
    'content-type': [ 'application/json' ],
    Host: [ 'zi0bc64zck.execute-api.ap-northeast-2.amazonaws.com' ],
    origin: [ 'http://localhost:5173' ],
    priority: [ 'u=1, i' ],
    Referer: [ 'http://localhost:5173/' ],
    'sec-ch-ua': [
      '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"'
    ],
    'sec-ch-ua-mobile': [ '?0' ],
    'sec-ch-ua-platform': [ '"Windows"' ],
    'sec-fetch-dest': [ 'empty' ],
    'sec-fetch-mode': [ 'cors' ],
    'sec-fetch-site': [ 'cross-site' ],
    'User-Agent': [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
    ],
    Via: [
      '2.0 cf4ceb3336927d8695e07607ff3ce1fa.cloudfront.net (CloudFront)'
    ],
    'X-Amz-Cf-Id': [ 'ptyRRQZ6sPsubhBXgPH1145NiYKYgoFGPprgsR3LpxfnhKh-Ey4XsA==' ],
    'X-Amzn-Trace-Id': [ 'Root=1-66755631-3b96f0f73cb9b21a48227969' ],
    'X-Forwarded-For': [ '210.204.83.69, 130.176.126.156' ],
    'X-Forwarded-Port': [ '443' ],
    'X-Forwarded-Proto': [ 'https' ]
  },
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  pathParameters: { provider: 'google' },
  stageVariables: null,
  requestContext: {
    resourceId: 'i3vtaw',
    resourcePath: '/login/{provider}',
    httpMethod: 'POST',
    extendedRequestId: 'ZtpntE5MoE0ETNQ=',
    requestTime: '21/Jun/2024:10:30:09 +0000',
    path: '/dev/login/google',
    accountId: '330886885966',
    protocol: 'HTTP/1.1',
    stage: 'dev',
    domainPrefix: 'zi0bc64zck',
    requestTimeEpoch: 1718965809018,
    requestId: 'cd563790-c632-4d4c-b493-534d6e667a29',
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
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      user: null
    },
    domainName: 'zi0bc64zck.execute-api.ap-northeast-2.amazonaws.com',
    deploymentId: 'efz9fr',
    apiId: 'zi0bc64zck'
  },
  body: '{"credential":"eyJhbGciOiJSUzI1NiIsImtpZCI6IjNkNTgwZjBhZjdhY2U2OThhMGNlZTdmMjMwYmNhNTk0ZGM2ZGJiNTUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4OTMwMDE4NjMzNDktc3JxcmpjOW1nYXZnaW4xMGVqN2tuYWswc3VmdXZjOGouYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4OTMwMDE4NjMzNDktc3JxcmpjOW1nYXZnaW4xMGVqN2tuYWswc3VmdXZjOGouYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTgzNzk5MDk0NzE5OTI0OTEzNTYiLCJoZCI6ImlhbXBhbS5pbyIsImVtYWlsIjoidGVjaEBpYW1wYW0uaW8iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmJmIjoxNzE4OTY1NTA4LCJuYW1lIjoiVGVjaCBJQU1QQU0iLCJnaXZlbl9uYW1lIjoiIFRlY2giLCJmYW1pbHlfbmFtZSI6IklBTVBBTSIsImlhdCI6MTcxODk2NTgwOCwiZXhwIjoxNzE4OTY5NDA4LCJqdGkiOiI5MzQxZDRjMWEwODRlYmYzM2FlMjY4Njc1ZmFkZWZlNTYzODUyYTNkIn0.L8Od21rYHi3OPDGIyiIAgU9Yhn9E_MPSfbEdCkyZjg-utIqzGS4kAcTH1FusxxhO01LPC6_LNWTSJdfjseLpDPW9Q2oVkoEayyjtNb19d62BVYkv9Dw2eqhjyYreswPs_l1NEsc6HAdCVq5Z75owC_zVvJ78KwSeWHEEdy1CJ5kYQR6AAXpvr_U1hXtQgBDrAwaUT-1crYkPK06BgSvIxzqLeaws44JwJEGFGCbPG18SVVzKcB8Ow_5_SDE-yJvJpbYpc2K1dHtufucYMJorWT55EiIcUXzX07Q5Qg6KDcAROJxQZbNboWwwWStMLkTJC4bW14ot4UV48gP187sTOA","clientId":"893001863349-srqrjc9mgavgin10ej7knak0sufuvc8j.apps.googleusercontent.com","select_by":"btn"}',
  isBase64Encoded: false
}
 */

/*
    ticket:
    {
      "envelope": {
          "alg": "RS256",
          "kid": "3d580f0af7ace698a0cee7f230bca594dc6dbb55",
          "typ": "JWT"
      },
      "payload": {
          "iss": "https://accounts.google.com",
          "azp": "893001863349-srqrjc9mgavgin10ej7knak0sufuvc8j.apps.googleusercontent.com",
          "aud": "893001863349-srqrjc9mgavgin10ej7knak0sufuvc8j.apps.googleusercontent.com",
          "sub": "118379909471992491356",
          "hd": "iampam.io",
          "email": "tech@iampam.io",
          "email_verified": true,
          "nbf": 1718685592,
          "name": "Tech IAMPAM",
          "given_name": " Tech",
          "family_name": "IAMPAM",
          "iat": 1718685892,
          "exp": 1718689492,
          "jti": "03dcbd9bcee706e9a7b841a9149d203617fb3b9a"
      }
    }
    */

/* 송정희:
    {
        "iss": "https://accounts.google.com",
        "azp": "893001863349-srqrjc9mgavgin10ej7knak0sufuvc8j.apps.googleusercontent.com",
        "aud": "893001863349-srqrjc9mgavgin10ej7knak0sufuvc8j.apps.googleusercontent.com",
        "sub": "100581316273359636433",
        "hd": "mz.co.kr",
        "email": "sjh8924@mz.co.kr",
        "email_verified": true,
        "nbf": 1718690615,
        "name": "송정희",
        "picture": "https://lh3.googleusercontent.com/a/ACg8ocK6Z1W2fU_09B9BfS2V-RJ-WW3oG4kEWd5Gphy_Pr-V1LHHzg=s96-c",
        "given_name": "정희",
        "family_name": "송",
        "iat": 1718690915,
        "exp": 1718694515,
        "jti": "8f90daefdd1aa06e62798a97b4cbbeddb6454f6a"
    }

    /*
    socialusers:
    {
      "userId": "1",
      "profileImage": "https://iampam-cloudops.s3.ap-northeast-2.amazonaws.com/provider/socialusers/waniskim.jpg",
      "displayName": "김완중",
      "socialEmail": "waniskim@gmail.com",
      "emailStatus": "emailVerified",
      "loginIpaddress": "14.63.67.15",
      "geoLocation": "KR",
      "loginLocation": "14.63.67.15(KR)",
      "lastLogin": "2024-05-07 14:30:12 KST",
      "companyEmail": "wanis@mz.co.kr",
      "hashedPassword": "1234",
    }
    */

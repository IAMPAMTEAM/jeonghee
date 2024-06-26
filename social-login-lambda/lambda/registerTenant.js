import { response } from "../util/response.js";

export const handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin;

  const {
    companyRegistrationNumber, //string
    companyName, //string
    contactPerson, //string
    contactPhone, //string
    contactEmail, //string
    awsAccount, //number
    awsAccountName, //string
    awsAccountType, //string
    awsRegions, //string array
  } = JSON.parse(event.body);

  const newTenant = {
    companyRegistrationNumber: companyRegistrationNumber, //Company Registration Number
    companyName: companyName, //Company Name
    companySetName: `${companyName}(${companyRegistrationNumber})`, //OK
    companyContactName: contactPerson, //Contact Person
    companyContactPhone: contactPhone, //Contact Phone
    companyContactEmail: contactEmail, //Contact Email
    companyIndustryType: "",
    companyFinancialHealth: "",
    reportUrls: [],
  };
  console.log("newTenant", newTenant);

  const newAwsAccount = {
    awsAccount: awsAccount, //AWS Account
    awsAccountName: awsAccountName,
    awsAccountFullName: `${awsAccountName}(${awsAccount})`,
    companyName: companyName, //OK
    awsAccountType: awsAccountType, //AWS Account Type
    regions: awsRegions,
  };
  console.log("newAwsAccount", newAwsAccount);

  await fetch(
    `https://z0ykb6o0hk.execute-api.ap-northeast-2.amazonaws.com/dev/tenants`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTenant),
    }
  );

  await fetch(
    `https://z0ykb6o0hk.execute-api.ap-northeast-2.amazonaws.com/dev/awsaccount`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAwsAccount),
    }
  );

  return await response(
    200,
    { newTenant: newTenant, newAwsAccount: newAwsAccount },
    origin
  );
};

//socialUser
// {
//   "profileImage": "https://iampam-cloudops.s3.ap-northeast-2.amazonaws.com/provider/socialusers/waniskim.jpg",
//   "displayName": "김완중",
//   "socialEmail": "tech@iampam.io",
//   "emailStatus": "emailVerified",
//   "loginIpaddress": "14.63.67.157",
//   "geoLocation": "KR",
//   "loginLocation": "14.63.67.15(KR)",
//   "lastLogin": "2024-06-24 14:13:13 KST"
// }

//tenants
// {
//   "companyRegistrationNumber": "116-81-19477", //Company Registration Number
//   "companyName": "LG CNS",  //Company Name
//   "companySetName": "LGCNS(116-81-19477)",  //OK
//   "companyContactName": "김형국",  //Contact Person
//   "companyContactPhone": "010-5021-9466",  //Contact Phone
//   "companyContactEmail": "vulcankim@lgcns.com",  //Contact Email
//   "companyIndustryType": "IT",
//   "companyFinancialHealth": "AA0",
//   "reportUrls": [
//     {
//       "reportUrl": "https://hybrixops-diagops-report.s3.ap-northeast-2.amazonaws.com/report-1234567",
//       "reportIssueDate": "2023-03-15",
//       "reportIssueStatus": "Success"
//     },
//     {
//       "reportUrl": "https://hybrixops-diagops-report.s3.ap-northeast-2.amazonaws.com/report-2345678",
//       "reportIssueDate": "2023-07-19",
//       "reportIssueStatus": "Success"
//     }
//   ]
// }
//awsAccount
// {
//   "awsAccount": 330886885966,  //AWS Account
//   "awsAccountName": "sinsurance-dev",
//   "awsAccountFullName": "sinsurance-dev(330886885966)",
//   "companyName": "삼성생명",  //OK
//   "awsAccountType": "dev"  //AWS Account Type
//   "regions": ["ap-northeast-2", "us-east-1", "us-west-2"]
// }

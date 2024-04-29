import fs from "fs";
import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const resourceData = fs
    .readFileSync("./txt_files/resourceTypes5.txt", "utf-8")
    .split("\n");
  const awsProduct = [];

  for (const data of resourceData) {
    const jsonData = JSON.parse(data);
    const resourceType = jsonData.resourceType;
    const resourceTypeUrl = jsonData.resourceTypeUrl;

    try {
      await page.goto(
        `https://docs.aws.amazon.com/ko_kr/AWSCloudFormation/latest/UserGuide/${resourceTypeUrl}`,
        { waitUntil: "networkidle2" }
      );

      //syntaxData=[JSON, YAML]
      const syntax = await page.$$eval(
        '[data-testid="copyCodeBtn"]',
        (copyButtons) => {
          const syntax = [];
          copyButtons.forEach((copyButton) => {
            syntax.push(copyButton.title.replace(/^Copy\s/, ""));
          });
          return syntax;
        }
      );
      const awsServiceName = resourceType.match(/::(\w+)::/)[1];
      awsProduct.push({
        awsResourceType: resourceType,
        awsResourceTypeName: resourceTypeUrl
          .replace(/^aws-resource-/, "")
          .replace(/\.html$/, ""),
        awsResourceTypeCloudformationJson: syntax[0],
        awsResourceTypeCloudformationYaml: syntax[1],
        awsServiceName: awsServiceName,
        awsServiceCategory: getCategory(awsServiceName),
      });
    } catch (error) {
      console.error(`Error navigating to ${resourceTypeUrl}: ${error.message}`);
    }
  }

  fs.writeFile("awsProduct5.json", JSON.stringify(awsProduct), (err) => {
    if (err) {
      console.error("awsProduct5.json 저장 실패");
      console.error(err);
    } else {
      console.log("awsProduct5.json 저장 성공");
    }
  });

  function getCategory(serviceName) {
    const compute = [
      "EC2",
      "AutoScaling",
      "ElasticBeanstalk",
      "Lambda",
      "Lightsail",
      "Batch",
      "EMR",
      "EMRServerless",
      "EMRContainers",
      "Fargate",
      "GroundStation",
      "NimbleStudio",
      "Oam",
      "RoboMaker",
      "SystemsManagerSAP",
      "WorkSpaces",
      "WorkSpacesThinClient",
      "WorkSpacesWeb",
    ];

    // Containers 카테고리
    const containers = ["ECS", "EKS", "ECR", "MWAA"];

    // Storage 카테고리
    const storage = [
      "S3",
      "S3Express",
      "S3ObjectLambda",
      "S3Outposts",
      "EBS",
      "EFS",
      "FSx",
      "MediaStore",
      "MemoryDB",
      "AmazonMQ",
      "MSK",
      "KafkaConnect",
    ];

    // Database 카테고리
    const database = [
      "RDS",
      "DynamoDB",
      "DocDB",
      "DocDBElastic",
      "Neptune",
      "NeptuneGraph",
      "QLDB",
      "Redshift",
      "RedshiftServerless",
      "Timestream",
      "LakeFormation",
    ];

    // Migration & Transfer 카테고리
    const migration = ["DMS", "DataSync", "Transfer"];

    // Networking & Content Delivery 카테고리
    const networking = [
      "VPC",
      "CloudFront",
      "Route53",
      "Route53RecoveryControl",
      "Route53RecoveryReadiness",
      "Route53Resolver",
      "GlobalAccelerator",
      "NetworkFirewall",
      "NetworkManager",
      "InternetMonitor",
      "DirectConnect",
    ];

    // Developer Tools 카테고리
    const developerTools = [
      "CloudFormation",
      "CodeArtifact",
      "CodeBuild",
      "CodeCommit",
      "CodeDeploy",
      "CodeGuruProfiler",
      "CodeGuruReviewer",
      "CodePipeline",
      "CodeStar",
      "CodeStarConnections",
      "CodeStarNotifications",
      "Cloud9",
      "XRay",
    ];

    // Customer Enablement 카테고리
    const customerEnablement = [
      "SupportApp",
      "AWS IQ",
      "AWS Training and Certification",
    ];

    // Robotics 카테고리
    const robotics = ["RoboMaker"];

    // Blockchain 카테고리
    const blockchain = ["ManagedBlockchain"];

    // Satellite 카테고리
    const satellite = ["GroundStation"];

    // Quantum Technologies 카테고리
    const quantum = ["QLDB"];

    // Management & Governance 카테고리
    const management = [
      "CloudTrail",
      "Config",
      "ControlTower",
      "Organizations",
      "SystemsManagerSAP",
      "ResourceGroups",
      "SystemsManagerSAP",
      "OpsWorks",
      "OpsWorksCM",
      "Personalize",
      "SystemsManagerSAP",
      "SSMIncidents",
      "SSMContacts",
      "AppConfig",
      "SystemsManagerSAP",
      "SystemsManagerSAP",
      "SystemsManagerSAP",
      "SystemsManagerSAP",
      "SystemsManagerSAP",
      "SystemsManagerSAP",
    ];

    // Media  카테고리
    const media = [
      "MediaConnect",
      "MediaConvert",
      "MediaLive",
      "MediaPackage",
      "MediaPackageV2",
      "MediaTailor",
    ];

    // Game Development 카테고리
    const gameDevelopment = ["GameLift"];

    // Internet of Things 카테고리
    const iot = [
      "IoT",
      "Greengrass",
      "IoT1Click",
      "IoTAnalytics",
      "IoTCoreDeviceAdvisor",
      "IoTEvents",
      "IoTFleetHub",
      "IoTFleetWise",
      "IoTSiteWise",
      "IoTTwinMaker",
      "IoTWireless",
    ];

    // End User Computing 카테고리
    const endUserComputing = [
      "WorkSpaces",
      "WorkSpacesThinClient",
      "WorkSpacesWeb",
      "AppStream",
      "AppRunner",
    ];

    // Business Applications 카테고리
    const businessApplications = [
      "WorkDocs",
      "Chime",
      "Alexa for Business",
      "AppFlow",
      "ServiceCatalog",
      "ServiceCatalogAppRegistry",
      "Panorama",
      "Pinpoint",
      "PinpointEmail",
    ];

    // Application Integration 카테고리
    const appIntegration = [
      "EventBridge",
      "EventSchemas",
      "SNS",
      "SQS",
      "StepFunctions",
      "AppIntegrations",
      "Connect",
      "ConnectCampaigns",
    ];

    // Front-end Web & Mobile 카테고리
    const frontEnd = ["Amplify", "AmplifyUIBuilder", "MobileHub"];

    // Cloud Financial Management 카테고리
    const financial = [
      "Cost Explorer",
      "Budgets",
      "Cost and Usage Report",
      "BillingConductor",
      "CUR",
      "Forecast",
    ];

    // Security, Identity, & Compliance 카테고리
    const security = [
      "IAM",
      "SSO",
      "IdentityStore",
      "AccessAnalyzer",
      "Macie",
      "GuardDuty",
      "Shield",
      "CertificateManager",
      "ACMPCA",
      "PCAConnectorAD",
      "Inspector",
      "InspectorV2",
      "SecurityHub",
      "WAF",
      "WAFRegional",
      "WAFv2",
      "Detective",
      "FirewallManager",
      "FMS",
    ];

    // Analytics 카테고리
    const analytics = [
      "Athena",
      "Glue",
      "DataBrew",
      "Kinesis",
      "KinesisAnalytics",
      "KinesisAnalyticsV2",
      "QuickSight",
      "LookoutEquipment",
      "LookoutMetrics",
      "LookoutVision",
      "Forecast",
    ];

    // Machine Learning 카테고리
    const machineLearning = [
      "SageMaker",
      "Rekognition",
      "Comprehend",
      "Polly",
      "Translate",
      "Transcribe",
      "Personalize",
      "Kendra",
      "KendraRanking",
      "Lex",
      "FraudDetector",
      "CodeGuruProfiler",
      "CodeGuruReviewer",
      "Forecast",
      "Textract",
    ];
    switch (true) {
      case compute.includes(serviceName):
        return "compute";
      case containers.includes(serviceName):
        return "containers";
      case storage.includes(serviceName):
        return "storage";
      case database.includes(serviceName):
        return "database";
      case migration.includes(serviceName):
        return "migration";
      case networking.includes(serviceName):
        return "networking";
      case developerTools.includes(serviceName):
        return "developerTools";
      case customerEnablement.includes(serviceName):
        return "customerEnablement";
      case robotics.includes(serviceName):
        return "robotics";
      case blockchain.includes(serviceName):
        return "blockchain";
      case satellite.includes(serviceName):
        return "satellite";
      case quantum.includes(serviceName):
        return "quantum";
      case management.includes(serviceName):
        return "management";
      case media.includes(serviceName):
        return "media";
      case gameDevelopment.includes(serviceName):
        return "gameDevelopment";
      case iot.includes(serviceName):
        return "iot";
      case endUserComputing.includes(serviceName):
        return "endUserComputing";
      case businessApplications.includes(serviceName):
        return "businessApplications";
      case appIntegration.includes(serviceName):
        return "appIntegration";
      case frontEnd.includes(serviceName):
        return "frontEnd";
      case financial.includes(serviceName):
        return "financial";
      case security.includes(serviceName):
        return "security";
      case analytics.includes(serviceName):
        return "analytics";
      case machineLearning.includes(serviceName):
        return "machineLearning";
      default:
        return "other";
    }
  }

  await browser.close();
})();

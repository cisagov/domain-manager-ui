const awsmobile = {
  aws_project_region: "us-east-1",
  aws_cognito_identity_pool_id:
    "us-east-1:b3c001ae-1fa0-485b-9ad8-d5cd80c4c5a4",
  aws_cognito_region: "us-east-1",
  aws_user_pools_id: "us-east-1_4RQW1kSXq",
  aws_user_pools_web_client_id: "5ima4cpik7lsu3je6je2546npf",
  oauth: {
    domain: "domain-manager-dev.auth.us-east-1.amazoncognito.com",
    scope: [
      "phone",
      "email",
      "openid",
      "profile",
      "aws.cognito.signin.user.admin",
    ],
    redirectSignIn: "http://localhost:4200/",
    redirectSignOut: "http://localhost:4200/",
    responseType: "code",
  },
  federationTarget: "COGNITO_USER_POOLS",
};

export default awsmobile;

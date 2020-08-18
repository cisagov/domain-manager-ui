const awsmobile = {
  aws_project_region: "us-east-1",
  aws_cognito_identity_pool_id:
    "us-east-1:53276d58-41f7-49f6-a51b-f9474076541b",
  aws_cognito_region: "us-east-1",
  aws_user_pools_id: "us-east-1_XMCiffOAW",
  aws_user_pools_web_client_id: "4m0tjch9tjcbpn8j998mge8hqk",
  oauth: {
    domain: "domain-manager-develop.auth.us-east-1.amazoncognito.com",
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

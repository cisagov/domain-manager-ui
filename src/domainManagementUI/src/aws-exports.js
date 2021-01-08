const awsmobile = {
  aws_project_region: "us-east-1",
  aws_cognito_identity_pool_id: "",
  aws_cognito_region: "us-east-1",
  aws_user_pools_id: "us-east-1_iqSBsswDh",
  aws_user_pools_web_client_id: "2jjsob72d3umqvfjg42fb319c4",
  oauth: {
    domain: "dm-dev.auth.us-east-1.amazoncognito.com",
    scope: [
      "phone",
      "email",
      "openid",
      "profile",
      "aws.cognito.signin.user.admin",
    ],
    redirectSignIn: "http://localhost:4200",
    redirectSignOut: "http://localhost:4200",
    responseType: "code",
  },
  federationTarget: "COGNITO_USER_POOLS",
};

export default awsmobile;

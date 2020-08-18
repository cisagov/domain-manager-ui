const awsmobile = {
  aws_project_region: "${AWS_PROJECT_REGION}",
  aws_cognito_identity_pool_id: "${AWS_COGNITO_IDENTITY_POOL_ID}",
  aws_cognito_region: "${AWS_COGNITO_REGION}",
  aws_user_pools_id: "${AWS_USER_POOLS_ID}",
  aws_user_pools_web_client_id: "${AWS_USER_POOLS_WEB_CLIENT_ID}",
  oauth: {
    domain: "${OAUTH_DOMAIN}",
    scope: [
      "phone",
      "email",
      "openid",
      "profile",
      "aws.cognito.signin.user.admin",
    ],
    redirectSignIn: "${OAUTH_REDIRECT_URL}",
    redirectSignOut: "${OAUTH_REDIRECT_URL}",
    responseType: "code",
  },
  federationTarget: "COGNITO_USER_POOLS",
};

export default awsmobile;

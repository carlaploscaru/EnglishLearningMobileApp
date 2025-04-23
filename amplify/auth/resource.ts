  import { Amplify } from 'aws-amplify';
  import awsconfig from './aws-exports'
  
  const outputs = Amplify.configure({
    Auth: {
      Cognito: {
        userPoolClientId: awsconfig.auth_userpool_clientid,
        userPoolId: awsconfig.auth_userpool_id,
        loginWith: {
          oauth: {
            domain: awsconfig.oauth_domain,
            scopes: ['email'],
            redirectSignIn: [awsconfig.deployment_url],
            redirectSignOut: [awsconfig.deployment_url],
            responseType: 'token',
          },
        },
      },
    },
  });
  
  export default outputs;
  
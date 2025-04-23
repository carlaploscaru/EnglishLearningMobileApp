

const awsconfig  = ({
    Auth: {
      Cognito: {
        userPoolId: "eu-central-1_ogMogQIs0", 
        userPoolClientId: "desisnif1bjhqc9m31rlu66lv", 
        identityPoolId: "",
        loginWith: {
          email: true,
        },
        signUpVerificationMethod: "code",
        userAttributes: {
          email: {
            required: true,
          }
        },
        allowGuestAccess: true,
        passwordFormat: {
          minLength: 8,
          requireLowercase: true,
          requireUppercase: true,
          requireNumbers: true,
          requireSpecialCharacters: true,
        },
      },
    },
  })

  
  export default awsconfig ;
resource "aws_cognito_user_pool" "pool" {
    name = "mypool"
    mfa_configuration = "ON"
    sms_authentication_message = "Your code is {####}"

}
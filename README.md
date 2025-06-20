# Serverless Email Service

This is a serverless REST API that sends emails using AWS Lambda and the Serverless Framework.

## Prerequisites

1. Node.js (v14 or later)
2. AWS CLI configured with appropriate credentials
3. Serverless Framework CLI installed globally
4. An email account to send emails from (Gmail or other service)

## Setup Steps

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure email settings in `serverless.yml`:
   - Update `emailService` (default is 'gmail')
   - Add your email address in `emailUser`
   - Add your email password or app-specific password in `emailPassword`

3. For Gmail users:
   - Enable 2-factor authentication
   - Generate an App Password
   - Use the App Password in the `emailPassword` field

## Running Locally

1. Start the local server:
   ```bash
   npm start
   ```

2. The API will be available at `http://localhost:3000/send-email`

## API Usage

Send a POST request to `/send-email` with the following JSON body:

```json
{
  "receiver_email": "recipient@example.com",
  "subject": "Email Subject",
  "body_text": "Email body content"
}
```

### Response Codes

- 200: Email sent successfully
- 400: Bad request (missing fields or invalid email format)
- 500: Server error

## Deployment

To deploy to AWS:

```bash
npm run deploy
```

## Security Notes

- Never commit your email credentials to version control
- Consider using AWS Secrets Manager or Parameter Store for production credentials
- Use environment variables for sensitive information 
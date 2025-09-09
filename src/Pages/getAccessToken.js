const { GoogleAuth } = require('google-auth-library');
const auth = new GoogleAuth({
  keyFile: './service-account-file.json', // path to your JSON file
  scopes: 'https://www.googleapis.com/auth/dialogflow',
});

async function getAccessToken() {
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  console.log("Your Dialogflow Client Access Token:", token);
}

getAccessToken();

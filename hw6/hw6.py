import requests
import base64
import datetime

client_id = "11165d2d66144be9a40cb31c2e813dd7"
client_secret = "2ef4f2dbb76643728422ee37467243ea"

class SpotifyAPI(object):
        access_token = None
        access_token_expires = datetime.datetime.now()
        access_token_did_expire = True
        client_id = None
        client_secret = None
        token_url = "https://accounts.spotify.com/api/token"
        
        def __init__(self, client_id, client_secret, *args, **kwargs ):
            super().__init__(*args, **kwargs) ##call any class
            self.client_id = client_id
            self.client_secret = client_secret

        def get_client_credentials(self):
            """
            Returns a base64 encoded string
            """
            client_id = self.client_id
            client_secret = self.client_secret
            if client_secret == None or client_id == None: 
             raise Exception("set client_id and client_secret")
            client_creds = f"{client_id}:{client_secret}"
            client_creds_b64 = base64.b64encode(client_creds.encode())
            return client_creds_b64.decode()

            ##authentication method
        def get_token_headers(self):
            client_creds_b64 = self.get_client_credentials()
            return{

            "Authorization" : f"Basic {client_creds_b64}"
        }

        def get_token_data(self):
            return {
            "grant_type" : "client_credentials"
        }
        def perform_auth(self):
            token_url = self.token_url
            token_data = self.get_token_data()
            token_headers = self.get_token_headers()
            r = requests.post(token_url, data = token_data, headers = token_headers)
            if  r.status_code in range(200, 299):
                return False

            data = r.json()
            now = datetime.datetime.now()
            access_token = data["access_token"]
            expires_in = data["expires_in"]
            expires = now + datetime.timedelta(seconds = expires_in)
            self.access_token = access_token
            self.access_token_expires = expires
            self.access_token_did_expire = expires < now
            did_expire = expires > now 
            
            return True
    

   
      















#grab token by doing a lookup
#client_creds = f"{client_id}:{client_secret}"
#type(client_creds)

#client_creds.encode().decode()
#lient_creds_b64 = base64.b64encode(client_creds.encode())
#print(client_creds_b64)

##token_url = "https://accounts.spotify.com/api/token"
#method = "POST"
#token_data = {
 #   "grant_type" : "client_credentials"
#}
#token_headers = {

 #   "Authorization" : f"Basic {client_creds_b64.decode()}"
#}
#r = requests.post(token_url, data = token_data, headers = token_headers)
#print(r.json())
##valid_request =r.status_code in range(200, 299)


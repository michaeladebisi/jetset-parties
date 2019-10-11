import HttpsClient from 'https';
import QueryString from 'querystring';
import {Buffer} from 'buffer';
import {logger} from '../tools';

const JetsetIdentityAPIUrl = 'identity.jetset.com';
const JetsetHoldingsAPIUrl = 'holdings.jetset.com';

export default class Jetset {
  constructor() {
    this.storedToken = null;
    this.storedTokenExpiry = null;
  }

  Authenticate() {
    logger.info(new Date(), 'Jetset.Authenticate');

    return new Promise((resolve, reject) => {
      let currentTime = new Date();

      if (this.storedTokenExpiry !== null && currentTime < this.storedTokenExpiry) {
        logger.info(new Date(), 'Using stored Jetset token');
        resolve(this.storedToken);
        return;
      }

      let form_data = QueryString.stringify({
        grant_type: 'client_credentials'
      });

      // TODO: Move this out to environment variables/configuration
      let authorizationHeader = Buffer.from('AthenaCAT:s5vSek9GnrVLm9cU').toString('base64');

      let options = {
        host: JetsetIdentityAPIUrl,
        port: 443,
        path: '/connect/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(form_data),
          Authorization: 'Basic ' + authorizationHeader
        }
      };

      let request = HttpsClient.request(options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          let token = JSON.parse(data);

          if (token.error !== undefined) {
            logger.error(new Date(), token.error);
            reject(token.error);
          } else {
            let expiryDateTime = new Date();
            expiryDateTime.setSeconds(expiryDateTime.getSeconds() + token.expires_in);
            this.storedTokenExpiry = expiryDateTime;
            this.storedToken = token.access_token;
            resolve(this.storedToken);
          }
        });
      }).on('error', (error) => {
        logger.error('Error making Jetset Authentication Request: ' + error);
        reject(error);
      });

      request.write(form_data);
      request.end();
    });
  }

  CreateParty(token, party) {
    logger.info(new Date(), 'Jetset.CreateParty');
    // TODO: Add some validation to `party` in here before submitting
    return new Promise((resolve, reject) => {
      let options = {
        host: JetsetHoldingsAPIUrl,
        port: 443,
        path: '/persons',
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      };

      let request = HttpsClient.request(options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          let person = JSON.parse(data);

          if (person.error !== undefined) {
            reject(person.error);
          } else {
            resolve(person);
          }
        });
      }).on('error', (error) => {
        logger.error('Error making Jetset Persons POST Request: ' + error);
        reject(error);
      });

      request.write(JSON.stringify(party));
      request.end();
    });
  }

  GetParty(token, jetsetId) {

    logger.info(new Date() + ' Jetset.GetParty '+  token);
    return new Promise((resolve, reject) => {
      let options = {
        host: JetsetHoldingsAPIUrl,
        port: 443,
        path: '/persons/' + jetsetId,
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token
        }
      };

      let request = HttpsClient.request(options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          let person = JSON.parse(data);

          if (person.error !== undefined) {
            reject(person.error);
          } else {
            resolve(person);
          }
        });
      }).on('error', (error) => {
        logger.error('Error making Jetset Persons GET Request: ' + error);
        reject(error);
      });

      request.end();
    });
  }

  UpdateParty(token, party) {
    let jetsetId = party && party.jetset_id || 0;
    logger.info(new Date() + ' Jetset.UpdateParty: ' + jetsetId);
    // TODO: Add some validation to `party` in here before submitting
    return new Promise((resolve, reject) => {
    if (!jetsetId){ return; }
      let options = {
        host: JetsetHoldingsAPIUrl,
        port: 443,
        path: '/persons/' + jetsetId,
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      };

      let request = HttpsClient.request(options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          let person = JSON.parse(data);

          if (person.error !== undefined) {
            reject(person.error);
          } else {
            resolve(person);
          }
        });
      }).on('error', (error) => {
        logger.error('Error making Jetset Persons POST Request: ' + error);
        reject(error);
      });

      request.write(JSON.stringify(party));
      request.end();
    });
  }
}

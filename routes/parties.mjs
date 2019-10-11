
import {logger, config} from '../tools';
import Parties from '../app';

/**
 * function partiesRoutes
 * @param app : any
 */

const partiesRoutesSetup = function(app, partiesApi) {
  let api = new Parties();
  // JSON API
  let baseUrl = config.API_PATH;

  app.get(baseUrl, partiesApi.defaultRoute);

  app.get(baseUrl + 'parties', partiesApi.getParties.bind(partiesApi));
  app.get(baseUrl + 'parties/:id', partiesApi.getParties.bind(partiesApi));

  app.post(baseUrl + 'parties', partiesApi.createParty.bind(partiesApi));

  app.post(baseUrl + 'updateParty/:id', api.updateParties);
  app.put(baseUrl + 'updateParty/:id', api.updateParties);

  app.post(baseUrl + 'deleteParty/:id', api.deleteParties);
  app.delete(baseUrl + 'deleteParty/:id', api.deleteParties);

  // app.post(baseUrl + 'login', api.login);
  // app.post(baseUrl + 'logout', api.logout);

  logger.info('Accessing /parties');
};

export default partiesRoutesSetup;

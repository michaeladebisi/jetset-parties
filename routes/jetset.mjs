
import {logger} from '../tools';
//import Jetset from '../jetset';

/**
 * function JetsetRoutes
 * @param app : any
 */

const jetsetRoutesSetup = function() {
  //let jetset = new Jetset();
  // JSON jetset
  //let baseUrl = config.RUNPATH_PATH;

  //app.get(baseUrl + 'parties', jetset.getParties);
  // app.get(baseUrl + 'parties/:id', jetset.getParties);

  // app.post(baseUrl + 'updateParty', jetset.addParties);

  // app.post(baseUrl + 'updateParty/:id', jetset.updateParties);
  // app.put(baseUrl + 'updateParty/:id', jetset.updateParties);

  // app.post(baseUrl + 'deleteParty/:id', jetset.deleteParties);
  // app.delete(baseUrl + 'deleteParty/:id', jetset.deleteParties);

  // app.post(baseUrl + 'login', jetset.login);
  // app.post(baseUrl + 'logout', jetset.logout);

  logger.info('Accessing /jetset');
};

export default jetsetRoutesSetup;

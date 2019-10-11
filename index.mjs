import Express from 'express';
import bodyParser from 'body-parser';
import Parties from './app';
import Jetset from './jetset';
import Database from './database';
import {logger, config} from './tools';
import partiesRoutesSetup from './routes/parties';
//import jetsetRoutesSetup from './routes/jetset';

let app = new Express();

const listen = function (host, port) {
  app.listen(port, host, function() {
    let h = this.address().address;
    let p = this.address().port;

    logger.info(`Parties App listening at http://${h}:${p}`);
  });
};

const applyHeaders = function (req, res, next) {
  if (config.ENV === 'dev') {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  }

};

const configureServer = function(app) {
  app.use(applyHeaders);
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
};

function main() {
  // Create out Jetset provider class
  let jetsetAPIProvider = new Jetset();

  // Instantiate Database
  let db = new Database();
  db.Connect();
  db.CreatePartyTable();

  // Instantiate the Parties app
  let p = new Parties(jetsetAPIProvider, db);

  // Startup
  partiesRoutesSetup(app, p);
  //jetsetRoutesSetup(app, p);
  configureServer(app, p);

  listen(config.DOMAIN, config.PORT);

}

main();

/*
function configureRoutes(express, parties) {
    express.get('/parties', parties.getParties.bind(parties));
    express.post('/parties', parties.createParty.bind(parties));
}

function main() {
    // Create our Jetset provider class
    let jetsetAPIProvider = new Jetset();

    // Instantiate Database
    let db = new Database();
    db.Connect('localhost', 'root', 'password', 'parties');

    // Instantiate the Parties app
    let p = new Parties(jetsetAPIProvider, db);

    // Startup
    configureRoutes(express, p);
    listen("0.0.0.0", 8081);
}
*/

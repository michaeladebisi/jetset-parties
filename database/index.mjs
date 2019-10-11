import Knex from 'knex';
import {config, logger} from '../tools';

export default class Database {
  constructor() {
    this.connection = null;
  }
  Connect() {
    let DB = config.DB;
    this.connection = Knex({
      client: 'mysql2',
      connection: {
        host: DB.HOST,
        user: DB.USERNAME,
        password: DB.PASSWORD,
        database: DB.NAME
      }
    });

  }

  CreatePartyTable() {
    let dbCon = this.connection;
    const tableName = config.DB.PARTYTABLENAME;
    dbCon.schema.hasTable(tableName).then(function(exists) {
      if (!exists) {
        logger.info('creating table: ', tableName);
        return dbCon.schema.createTable(tableName, function(table) {
          table.integer('jetset_id');
          table.string('first_name');
          table.string('last_name');
          table.string('title');
          table.string('dob'); // string datetime format: '1999-11-11T00:00:00'
          table.string('email'); // string
          table.string('created'); // string
        });

      } else {
        return logger.info(tableName, 'table exists!!');
      }
    });

  }

  GetPartyByEmailAddress(email) {
    return this.connection('table').select('jetset_id').from('party').where('email', email);
  }

  InsertParty(party) {
    return this.connection('party').insert(party);
  }


  UpdatePartyByEmailAddress(email, person) {
    return this.connection('party').update(person).where('email', email);
  }

  UpdatePartyByJetsetId(jetsetId, person) {
    return this.connection('party').update(person).where('jetset_id', jetsetId);
  }

}

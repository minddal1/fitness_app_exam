const { Model } = require('objection');

const Client_bought_packages = require('./client_bought_packages.js');

class Client extends Model {
    static tableName = 'client';

    static relationMappings = {
        client_bought_packages: {
          relation: Model.HasManyRelation,
          modelClass: Client,
          join: {
            from: 'client.id',
            to: 'client_bought_packages.id'
          }
        }
    }
}

module.exports = Client;

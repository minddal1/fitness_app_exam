const { Model } = require('objection');

const Client = require('./client.js');

class client_bought_packages extends Model {
    static tableName = 'client_bought_packages';

    static relationMappings = {
        client: {
          relation: Model.BelongsToOneRelation,
          modelClass: Client,
          join: {
            from: 'client_bought_packages.id',
            to: 'client.id'
          }
        }
    }
}

module.exports = client_bought_packages;

const { Model } = require('objection');

const Trainer_packages = require('./trainer_packages.js');

class Trainer extends Model {
    static tableName = 'trainer';

    static relationMappings = {
        trainer_packages: {
          relation: Model.BelongsToOneRelation,
          modelClass: Trainer,
          join: {
            from: 'trainer_packages.id',
            to: 'trainer.id'
          }
        }
    }
}

module.exports = Trainer;

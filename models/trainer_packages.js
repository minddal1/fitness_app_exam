const { Model } = require('objection');

const Trainer = require('./trainer.js');

class trainer_packages extends Model {
    static tableName = 'trainer_packages';

    static relationMappings = {
        trainer_packages: {
          relation: Model.HasManyRelation,
          modelClass: Trainer,
          join: {
            from: 'trainer_packages.id',
            to: 'trainer.id'
          }
        }
    }
}

module.exports = trainer_packages;

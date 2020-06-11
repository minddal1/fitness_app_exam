exports.up = function(knex) {
    
    return knex.schema
        .createTable('trainer', table => {
          table.increments('id');
          table.string('email').unique().notNullable();
          table.string('password').notNullable();
          table.string('first_name').notNullable();
          table.string('last_name').notNullable();
          table.string('day_of_birth').notNullable();
          table.string('address').notNullable();
          table.string('zip_code').notNullable();

          table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
          table.timestamp('created_at').defaultTo(knex.fn.now());
    
        })
        .createTable('trainerPackages', table => {
          table.increments('id');
          table.string('name').unique().notNullable();
          table.integer('price').unique().notNullable();

          table.integer('trainer_id').unsigned().notNullable();
          table.foreign('trainer_id').references('trainer.id');
    
          table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
          table.timestamp('created_at').defaultTo(knex.fn.now());
    
        })
        .createTable('client', table => {
            table.increments('id');
            table.string('email').unique().notNullable();
            table.string('password').notNullable();
            table.string('first_name').notNullable();
            table.string('last_name').notNullable();
            table.string('day_of_birth').notNullable();
            table.string('address').notNullable();
            table.string('zip_code').notNullable();
    
            table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
            table.timestamp('created_at').defaultTo(knex.fn.now());
    
          })
          .createTable('clientBoughtPackages', table => {
            table.increments('id');
  
            table.integer('trainer_package_id').unsigned().notNullable();
            table.foreign('trainer_package_id').references('trainerPackages.id');
              
            table.integer('client_id').unsigned().notNullable();
            table.foreign('client_id').references('client.id');

              
            table.integer('trainer_id').unsigned().notNullable();
            table.foreign('trainer_id').references('trainer.id');
      
            table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
            table.timestamp('created_at').defaultTo(knex.fn.now());
      
          });
        }


exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('clients')
        .dropTableIfExists('trainer')
        .dropTableIfExists('clientBoughtPackages')
        .dropTableIfExists('trainerPackages')
};


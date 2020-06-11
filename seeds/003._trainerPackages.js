exports.seed = function(knex) {
    return knex('trainer_packages').insert([      // password
      { name: "GULD PAKKEN", price: "200", trainer_id: "1"},
      { name: "SØLV PAKKEN", price: "149", trainer_id: "1"},
      { name: "BRONZE  PAKKEN", price: "99", trainer_id: "1"}
      
    ]);
  };
  
exports.seed = function(knex) {
    return knex('client_bought_packages').insert([      // password
      { trainer_package_id: "1", client_id: "1", trainer_id: "1" },
      { trainer_package_id: "2", client_id: "1", trainer_id: "1" },
      { trainer_package_id: "2", client_id: "1", trainer_id: "1"}
      
    ]);
  };
  
const router = require('express').Router();

const Trainer = require('../models/trainer.js');
const Trainer_Packages = require('../models/trainer_packages.js');


router.get('/trainerPackages', async (req, res) => {
    id = req.session.trainerId
    //console.log(req.session.trainerId + " TRAINERS")
    const allCurrentTrainerPackages = await Trainer_Packages.query().where('trainer_id', id).select('name', 'price')
    return res.send({ response: allCurrentTrainerPackages });
});

router.get('/users', async (req, res) => {
    const allUsersWithElectives = await User.query().select('username').withGraphFetched('electives');
    return res.send({ response: allUsersWithElectives });
});

router.get('/currentTrainer', (req, res) => {
    const trainer = req.session.trainerFullName
    return res.send(trainer);
});








module.exports = router;

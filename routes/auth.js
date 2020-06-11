router = require("express").Router();
const Client = require("../models/client.js");
const Client_bought_packages = require("../models/client_bought_packages.js");
const Trainer = require("../models/trainer.js");
const Trainer_packages = require("../models/Trainer_packages.js");
const bodyParser = require("body-parser");
const moment = require("moment");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");

const saltRounds = 12;

router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.use(bodyParser.json());

//-----------------------------------------------------
//LOG IN ROUTE
router.post("/clientLogin", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const client = await Client.query().select().where({ email: email });
    clientFullName = client[0].firstName + " " + client[0].lastName;
    console.log(client);

    bcrypt.compare(password, client[0].password).then((result) => {
      if (result == true) {
        return res.send(
          "NOW LOGGED IN AS A CLIENT: " +
            clientFullName +
            " WITH THE EMAIL " +
            email
        );
      } else {
        console.log("failed login attempt as a client");
        return res.redirect("/login");
      }
    });
  } catch (error) {
    console.log("no user");
    return res.send("no user found");
  }
});

//-----------------------------------------------------
//LOG IN ROUTE
router.post("/trainerLogin", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const trainer = await Trainer.query().select().where({ email: email });
    trainerFullName = trainer[0].firstName + " " + trainer[0].lastName;

    bcrypt.compare(password, trainer[0].password).then((result) => {
      if (result == true) {
        req.session.loggedin = true;
        req.session.trainerId = trainer[0].id;
        req.session.trainerFullName = trainerFullName;
        return res.redirect("/trainerDashboard");
      } else {
        console.log("failed login attempt as a trainer");
        return res.redirect("/login");
      }
    });
  } catch (error) {
    console.log("no user");
    return res.send("no user found");
  }
});

//---------------------------------------------------------------------------------------------------------
//SIGN UP ROUTE CLIENT

router.post(
  "/signupClient",
  [
    check("email").isEmail().withMessage("Must be a valid e-mail"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be atleast 8 characters long."),
  ],
  (req, res) => {
    const {
      email,
      password,
      first_name,
      last_name,
      day_of_birth,
      address,
      zip_code,
    } = req.body;

    const errors = validationResult(req);

    if (
      email &&
      password &&
      first_name &&
      last_name &&
      day_of_birth &&
      address &&
      zip_code
    ) {
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      date = req.body.day_of_birth;
      console.log(date);
      formatedDate = moment(date, "YYYY-DD-MM").format("DD-MM-YYYY");
      console.log(formatedDate);
      validatedDate = moment(formatedDate, "DD-MM-YYYY", true).isValid();

      console.log(validatedDate);

      if (validatedDate == false) {
        return res
          .status(400)
          .send({ response: "Must be a valid day format - Try dd-mm-yyyy" });
      }
      const zipRegex = /^[0-9]+$/;
      //to-do only 4 digits
      if (
        zipRegex.test(!req.body.zip_code) &&
        !req.body.zip_code < 5 &&
        !req.body.zip_code > 3
      ) {
        return res
          .status(400)
          .send({ response: "Invalid zip code - Use numbers only! 4 Digits" });
      } else {
        try {
          Client.query()
            .select("email")
            .where("email", email)
            .then((foundClient) => {
              if (foundClient.length > 0) {
                return res
                  .status(400)
                  .send({ response: "User already exists" });
              } else {
                bcrypt.hash(password, saltRounds).then((hashedPassword) => {
                  Client.query()
                    .insert({
                      email: req.body.email,
                      password: hashedPassword,
                      first_name: req.body.first_name,
                      last_name: req.body.last_name,
                      day_of_birth: formatedDate,
                      address: req.body.address,
                      zip_code: req.body.zip_code,
                    })
                    .then((createdClient) => {
                      return res.send({
                        response: `The client with the ${createdClient.email} was created`,
                      });
                    });
                });
              }
            });
        } catch (error) {
          return res
            .status(500)
            .send({ response: "Something went wrong with the DB" });
        }
      }
    } else {
      return res.status(400).send({ response: "username or password missing" });
    }
  }
);

router.post(
  "/signupTrainer",
  [
    check("email").isEmail().withMessage("Must be a valid e-mail"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be atleast 8 characters long."),
  ],
  (req, res) => {
    const {
      email,
      password,
      first_name,
      last_name,
      day_of_birth,
      address,
      zip_code,
    } = req.body;

    const errors = validationResult(req);

    if (
      email &&
      password &&
      first_name &&
      last_name &&
      day_of_birth &&
      address &&
      zip_code
    ) {
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const nameRegex = /^[A-Za-z]+$/;
      if (
        !nameRegex.test(req.body.last_name) ||
        !nameRegex.test(req.body.first_name)
      ) {
        return res.status(400).send({ response: "Must be a valid name" });
      }

      date = req.body.day_of_birth;
      console.log(date);
      formatedDate = moment(date, "YYYY-MM-DD").format("DD-MM-YYYY");
      console.log(formatedDate);
      validatedDate = moment(formatedDate, "DD-MM-YYYY", true).isValid();

      console.log(validatedDate);

      if (validatedDate == false) {
        return res
          .status(400)
          .send({ response: "Must be a valid day format - Try dd-mm-yyyy" });
      }
      const zipRegex = /^[0-9]+$/;
      //to-do only 4 digits
      if (
        zipRegex.test(!req.body.zip_code) &&
        !req.body.zip_code < 5 &&
        !req.body.zip_code > 3
      ) {
        return res
          .status(400)
          .send({ response: "Invalid zip code - Use numbers only! 4 Digits" });
      } else {
        try {
          Trainer.query()
            .select("email")
            .where("email", email)
            .then((foundTrainer) => {
              if (foundTrainer.length > 0) {
                return res
                  .status(400)
                  .send({ response: "User already exists" });
              } else {
                bcrypt.hash(password, saltRounds).then((hashedPassword) => {
                  Trainer.query()
                    .insert({
                      email: req.body.email,
                      password: hashedPassword,
                      first_name: req.body.first_name,
                      last_name: req.body.last_name,
                      day_of_birth: req.body.day_of_birth,
                      address: req.body.address,
                      zip_code: req.body.zip_code,
                    })
                    .then((createdTrainer) => {
                      return res.redirect("/trainerlogin");
                    });
                });
              }
            });
        } catch (error) {
          return res
            .status(500)
            .send({ response: "Something went wrong with the DB" });
        }
      }
    } else {
      return res.status(400).send({ response: "username or password missing" });
    }
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;

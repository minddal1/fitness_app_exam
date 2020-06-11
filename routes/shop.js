const router = require('express').Router();

router.get("/supplies", (req, res) => {
        const supplies = supplies.query().select("supplies").withGraphFetched();   
    return res.send({ response: supplies })
    
});
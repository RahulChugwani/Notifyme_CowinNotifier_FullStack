const router = require('express').Router();

const availableNotfier = require('../available-notifier');
let User = require('../models/user.model');

router.route('/add').post((req, res) =>{
    var email = req.body.email;
    var pincode = (req.body.pincode);
    var age = Number(req.body.age);

    const newUser = new User({
        email,
        age,
        pincode
    });

    const extranewUser = {
        email: email,
        pincode: pincode,
        age: age
    }

    newUser.save()
    .then(()=> res.json('User added successfully'))
    .then( () => {
        console.log("new user: ");
        console.log(extranewUser)
        var flag = 1; //for adding new user and sending mail for new user
        availableNotfier.getVaccineAvailablityForUser(extranewUser,flag);
    })
    .catch((err) => res.status(400).json('error:' + err));

});

router.route('/unsubscribe/:email').delete((req,res)=>{

    User.deleteMany({ email: req.params.email }, function (err) {
           if(err) console.log(err);
            console.log("Successful deletion");
    });
    
});


module.exports = router;
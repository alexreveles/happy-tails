const router = require("express").Router();
const sequelize = require("../config/connection");
const { Canine, Volunteer, Kennel, Demeanor } = require("../models");
const withAuth = require("../utils/auth");

// get all dogs for dashboard
router.get("/", withAuth, (req, res) => {
  console.log(req.session.v_id)
  Canine.findAll({
    order: [['c_name', 'ASC']],
    attributes: [
      'c_id',
      'c_name',
      'c_demeanor',
      [sequelize.literal('(SELECT volunteer.username FROM volunteer WHERE volunteer.v_id = canine.has_walked_am)'), 'has_walked_am'],
      [sequelize.literal('(SELECT volunteer.username FROM volunteer WHERE volunteer.v_id = canine.has_walked_pm)'), 'has_walked_pm'],
      [sequelize.literal('(SELECT volunteer.username FROM volunteer WHERE volunteer.v_id = canine.has_potty_am)'), 'has_potty_am'],
      [sequelize.literal('(SELECT volunteer.username FROM volunteer WHERE volunteer.v_id = canine.has_potty_pm)'), 'has_potty_pm'],
      'k_id'],
    include: [
      {
        model: Volunteer,
        attributes: ['username']
      },
      {
        model: Demeanor,
        attributes: ['d_desc']
      },
      {
        model: Kennel,
        attributes: ['k_name']
      }
    ]
  })
    .then(dbCanineData => {
      const canine = dbCanineData.map(canine => canine.get({ plain: true }));
      // console.log(canine[1]);
      // res.json(canine);
      res.render('dashboard', {
        canine,
        loggedIn: req.session.loggedIn
      })
    })
    .catch(err => {
      console.log(err);
      // res.redirect('login');
    });
});

// get single dog
router.get("/edit/:c_id", (req, res) => {
  Canine.findOne({
    where: {
      c_id: req.params.c_id
    },
  }, {
    attributes: [
      "c_id",
      "c_name",
      "c_demeanor",
      [
        sequelize.literal(
          "(SELECT volunteer.username FROM volunteer WHERE volunteer.v_id = canine.has_walked_am)"
        ),
        "has_walked_am",
      ],
      [
        sequelize.literal(
          "(SELECT volunteer.username FROM volunteer WHERE volunteer.v_id = canine.has_walked_pm)"
        ),
        "has_walked_pm",
      ],
      [
        sequelize.literal(
          "(SELECT volunteer.username FROM volunteer WHERE volunteer.v_id = canine.has_potty_am)"
        ),
        "has_potty_am",
      ],
      [
        sequelize.literal(
          "(SELECT volunteer.username FROM volunteer WHERE volunteer.v_id = canine.has_potty_pm)"
        ),
        "has_potty_pm",
      ],
      "k_id",
    ],

    include: [
      {
        model: Volunteer,
        attributes: [
          "c_id",
          "c_name",
          "c_demeanor",
          "has_walked_am",
          "has_walked_pm",
          "has_potty_am",
          "has_potty_pm",
          "k_id",
          "body",
        ],
        include: {
          model: Volunteer,
          attributes: ["username"],
        },
      },
      {
        model: Kennel,
        attributes: ["k_name"],
      },
      {
        model: Demeanor,
        attributes: ["d_desc"],
      },
    ],
  })
    .then((dbCanineData) => {
      console.log(dbCanineData);
      if (dbCanineData) {
        const canine = dbCanineData.get({ plain: true });
        
        res.render("single-dog", {
          canine,
          loggedIn: true,
          username: req.session.username,
          v_id: req.session.v_id
        });
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});




module.exports = router;

// get single dog
// router.get('/:c_id', (req, res) => {
//     Canine.findOne({
//        where: {
//         c_id: req.params.c_id
// },
// attributes: [
//             'c_id',
//             'c_name',
//             'c_demeanor',
//             [sequelize.literal('(SELECT volunteer.username FROM volunteer WHERE volunteer.v_id = canine.has_walked_am)'), 'has_walked_am'],
//         [sequelize.literal('(SELECT volunteer.username FROM volunteer WHERE volunteer.v_id = canine.has_walked_pm)'), 'has_walked_pm'],
//         [sequelize.literal('(SELECT volunteer.username FROM volunteer WHERE volunteer.v_id = canine.has_potty_am)'), 'has_potty_am'],
//         [sequelize.literal('(SELECT volunteer.username FROM volunteer WHERE volunteer.v_id = canine.has_potty_pm)'), 'has_potty_pm'],
//             'k_id',
// ],
// include: [
//     {
//         model: Volunteer,
//         attributes: ['c_id', 'c_name', 'c_demeanor', 'has_walked_am', 'has_walked_pm', 'has_potty_am', 'has_potty_pm', 'k_id'],
//         include: {
//             model: Volunteer,
//             attributes: ['username']
//         }
//     },
//     {
//         model: Kennel,
//         attributes: ['k_name']
//     },
//     {
//         model: Demeanor,
//         attributes: ['d_desc']
//     }
// ]
//     })
//     .then(dbCanineData => {
//         if (!dbCanineData) {
//             res.status(404).json({ message: 'No Canine found with that id' });
//             return;
//         }

//         const canine = dbCanineData.get({ plain: true });

//         res.render('single-canine', {canine,
//             loggedIn: req.session.loggedIn
//         });
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json(err);
//     });
// });





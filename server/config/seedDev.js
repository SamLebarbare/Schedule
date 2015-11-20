'use strict';


var User = require('../api/user/user.model');
var Attribution = require('../api/attribution/attribution.model');
var Shift =  require('../api/shift/shift.model');

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
      numeroCoursier : 2,
    password: 'test',
    competences : ["Back-office", "Spécial"]
  }, {
    provider: 'local',
    role: 'admin',
    numeroCoursier : 1,
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin',
    competences : ["Spécial"]
  }, function() {
      console.log('finished populating users');
    }
  );
});
Attribution.find({}).remove(function() {
  Attribution.create({
    coursier : {},
    shifts : [],
    monthYear : {
      "07-2015": {
        1: {
          shifts : []
        }

      },
      "08-2015":{
        1: {
          shifts : []
        }
      }
    }
  })
});

Shift.find({}).remove(function() {
  Shift.create({
    "nom" : "C",
    "debut" : new Date("1970-01-01T07:30:00.000Z"),
    "fin" : new Date("1970-01-01T09:30:00.000Z"),
    "ville" : "Neuchâtel",
    "remarques" : "CC",
    "competences" : [ 
        "Back-office", 
        "Spécial"
    ],
    "jours" : [ 
        {
            "times" : 1,
            "nom" : "Vendredi",
            "id" : 5
        }
    ]
  }, {
   "nom" : "D",
    "debut" : new Date("1970-01-01T10:30:00.000Z"),
    "fin" : new Date("1970-01-01T16:00:00.000Z"),
    "ville" : "Yverdon",
    "remarques" : "DD",
    "competences" : [ 
        "Spécial", 
        "Back-office"
    ],
    "jours" : [ 
        {
            "times" : 2,
            "nom" : "Mercredi",
            "id" : 3
        }, 
        {
            "times" : 1,
            "nom" : "Lundi",
            "id" : 1
        }, 
        {
            "times" : 3,
            "nom" : "Samedi",
            "id" : 6
        }
    ]
  },{
    "nom" : "X",
    "debut" : new Date("1970-01-01T08:30:00.000Z"),
    "fin" : new Date("1970-01-01T09:00:00.000Z"),
    "ville" : "Lausanne",
    "competences" : [ 
        "Back-office"
    ],
    "jours" : [ 
        {
            "times" : 1,
            "nom" : "Mardi",
            "id" : 2
        }, 
        {
            "times" : 1,
            "nom" : "Jeudi",
            "id" : 4
        }, 
        {
            "times" : 1,
            "nom" : "Vendredi",
            "id" : 5
        }
    ]
    
  },{
    "nom" : "A",
    "debut" : new Date("1970-01-01T07:30:00.000Z"),
    "fin" : new Date("1970-01-01T08:00:00.000Z"),
    "ville" : "Lausanne",
    "remarques" : "Aa",
    "competences" : [ 
        "Back-office"
    ],
    "jours" : [ 
        {
            "times" : 1,
            "nom" : "Mardi",
            "id" : 2
        }, 
        {
            "times" : 1,
            "nom" : "Jeudi",
            "id" : 4
        }, 
        {
            "times" : 2,
            "nom" : "Mercredi",
            "id" : 3
        }
    ]
  },{
    

    "nom" : "B",
    "debut" : new Date("1970-01-01T07:30:00.000Z"),
    "fin" : new Date("1970-01-01T09:30:00.000Z"),
    "ville" : "Lausanne",
    "remarques" : "BB",
    "competences" : [ 
        "Back-office", 
        "Spécial"
    ],
    "jours" : [ 
        {
            "times" : 3,
            "nom" : "Mardi",
            "id" : 2
        }, 
        {
            "times" : 1,
            "nom" : "Jeudi",
            "id" : 4
        }, 
        {
            "times" : 1,
            "nom" : "Lundi",
            "id" : 1
        }
    ]

  } ,function() {
      console.log('finished populating users');
    }
  );
});






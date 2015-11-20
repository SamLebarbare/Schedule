'use strict';


var User = require('../api/user/user.model');
var Attribution = require('../api/attribution/attribution.model');
var Shift = require('../api/shift/shift.model');

User.find({}).remove(function() {
 User.create(
{
   provider: 'local',
   role: 'admin',
   name: 'Admin',
   email: 'admin@admin.com',
   numeroCoursier: 1,
   password: 'admin',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Cordonier',
   email: 'tristan.cordonier@velocite.ch',
   numeroCoursier: 9,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Mesgarzadeh',
   email: 'giv.mesgarzadeh@gmail.com',
   numeroCoursier: 57,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Kormann',
   email: 'paul.kormann@velocite.ch',
   numeroCoursier: 66,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Christinaz',
   email: 'caroline.christinaz@gmail.com',
   numeroCoursier: 67,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Scherrer',
   email: 'crikscherrer@gmail.com',
   numeroCoursier: 78,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Viret',
   email: 'fannyviret76@gmail.com',
   numeroCoursier: 81,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Colin',
   email: 'adrien_colin@yahoo.fr',
   numeroCoursier: 86,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Hunziker',
   email: 'pascalhun@hotmail.com',
   numeroCoursier: 89,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Payot',
   email: 'raoul.payot@velocite.ch',
   numeroCoursier: 94,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Andrade',
   email: 'aviegasa@outlook.com',
   numeroCoursier: 97,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Fournier',
   email: 'albanf25@live.fr',
   numeroCoursier: 103,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Pasquier',
   email: 'tristan.pasquier@velocite.ch',
   numeroCoursier: 106,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Assal',
   email: 'marc.assal@velocite.ch',
   numeroCoursier: 107,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Berthod',
   email: 'berthod_noemie@hotmail.com',
   numeroCoursier: 110,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Walbaum',
   email: 'simon.walbaum@bluewin.ch',
   numeroCoursier: 120,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Do',
   email: 'wdo@wdo.ch',
   numeroCoursier: 126,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Kohler',
   email: 'joyceko21@gmail.com',
   numeroCoursier: 130,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Aebi',
   email: 'mathias.aebi@gmail.com',
   numeroCoursier: 138,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Allaz',
   email: 'emmanuel.allaz@hotmail.com',
   numeroCoursier: 141,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Stoenica',
   email: 'florin.stoenica@velocite.ch',
   numeroCoursier: 143,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Porret',
   email: 'michael.porret@hotmail.fr',
   numeroCoursier: 144,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Vuille',
   email: 'jonas.vuille@velocite.ch',
   numeroCoursier: 146,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Pipoz',
   email: 'romain.pipoz@velocite.ch',
   numeroCoursier: 150,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Bourquin',
   email: 'lucien.bourquin@gmail.com',
   numeroCoursier: 151,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Czepiel',
   email: 'maciej.czepiel@velocite.ch',
   numeroCoursier: 152,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Corminboeuf',
   email: 'matila.corminboeuf@unil.ch',
   numeroCoursier: 154,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Hlad',
   email: 'marta.hlad@gmail.com',
   numeroCoursier: 155,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Borra',
   email: 'luca.borra@velocite.ch',
   numeroCoursier: 157,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Lançon',
   email: 'marc.lancon@velocite.ch',
   numeroCoursier: 158,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Good',
   email: 'good.simon@velocite.ch',
   numeroCoursier: 160,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Luy',
   email: 'jeansebastien.luy@velocite.ch',
   numeroCoursier: 161,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Van Zaen',
   email: 'hugo.vanzaen@velocite.ch',
   numeroCoursier: 162,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Orlandi',
   email: 'leon.orlandi@velocite.ch',
   numeroCoursier: 163,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Pilloud',
   email: 'vadim.pilloud@gmail.com',
   numeroCoursier: 165,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Grezet',
   email: 'line.grezet@velocite.ch',
   numeroCoursier: 166,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Roulet',
   email: 'charly.roulet@velocite.ch',
   numeroCoursier: 167,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Guibert',
   email: 'dorian.guibert@velocite.ch',
   numeroCoursier: 168,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Marchand',
   email: 'alric.marchand@velocite.ch',
   numeroCoursier: 169,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Cherubini',
   email: 'alexandre.cherubini@velocite.ch',
   numeroCoursier: 170,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Lehnherr',
   email: 'jeandavid.lehnherr@velocite.ch',
   numeroCoursier: 171,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Massart',
   email: 'colin.massart@velocite.ch',
   numeroCoursier: 172,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Muheim',
   email: 'christophe.muheim@velocite.ch',
   numeroCoursier: 174,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Mathys',
   email: 'luca.mathys@velocite.ch',
   numeroCoursier: 176,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Baggiolini',
   email: 'malo.baggiolini@velocite.ch',
   numeroCoursier: 177,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'Lehnherr',
   email: 'bruno.lehnherr@velocite.ch',
   numeroCoursier: 178,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'W.',
   email: '',
   numeroCoursier: 179,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'M.',
   email: '',
   numeroCoursier: 180,
   password: 'super',
   competences : ["Coursier"]
},{
   provider: 'local',
   name: 'M',
   email: '',
   numeroCoursier: 181,
   password: 'super',
   competences : ["Coursier"]
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
Shift.create(
{
   "nom" : "Non!",
   "debut" : new Date("1970-01-01T00:00:00.000Z"),
   "fin" : new Date("1970-01-01T23:59:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "Indisponible",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 0,
     "nom" : "",
     "id" : "",
     }
   ]
   },
{
   "nom" : "Cam",
   "debut" : new Date("1970-01-01T00:00:00.000Z"),
   "fin" : new Date("1970-01-01T00:00:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 0,
     "nom" : "",
     "id" : "",
     }
   ]
   },
{
   "nom" : "CT",
   "debut" : new Date("1970-01-01T07:00:00.000Z"),
   "fin" : new Date("1970-01-01T12:30:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "Appelle la Dispo sur Natel privé à 06h55",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "1",
   "debut" : new Date("1970-01-01T07:00:00.000Z"),
   "fin" : new Date("1970-01-01T12:00:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "Appelle le coursier CT sur le natel privé à 06h30",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "A",
   "debut" : new Date("1970-01-01T07:30:00.000Z"),
   "fin" : new Date("1970-01-01T13:00:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "Dispo Lausanne",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "3",
   "debut" : new Date("1970-01-01T07:30:00.000Z"),
   "fin" : new Date("1970-01-01T13:00:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "Appelle Dispo sur Natel privé à 7h00",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "2",
   "debut" : new Date("1970-01-01T07:45:00.000Z"),
   "fin" : new Date("1970-01-01T13:00:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "Appelle Dispo sur Natel privé à 7h15",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "A'",
   "debut" : new Date("1970-01-01T08:00:00.000Z"),
   "fin" : new Date("1970-01-01T13:30:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "Dispo Yverdon Neuchâtel IC ",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "E",
   "debut" : new Date("1970-01-01T08:00:00.000Z"),
   "fin" : new Date("1970-01-01T13:00:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "Appelle au bureau ou sur Natel Dispo à 7h30",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 0,
     "nom" : "",
     "id" : "",
     }
   ]
   },
{
   "nom" : "V",
   "debut" : new Date("1970-01-01T08:00:00.000Z"),
   "fin" : new Date("1970-01-01T18:30:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "Riviera",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "W'",
   "debut" : new Date("1970-01-01T08:00:00.000Z"),
   "fin" : new Date("1970-01-01T12:00:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "Riviera",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "G",
   "debut" : new Date("1970-01-01T08:30:00.000Z"),
   "fin" : new Date("1970-01-01T13:30:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "Appelle au bureau ou sur Natel Dispo à 8h00",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "a",
   "debut" : new Date("1970-01-01T08:30:00.000Z"),
   "fin" : new Date("1970-01-01T13:30:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "CoDispo Lausanne ATTENTION du 20.7 au 14.8 10h-15h",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "DS",
   "debut" : new Date("1970-01-01T08:45:00.000Z"),
   "fin" : new Date("1970-01-01T17:00:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "sms à 8h15 à Paul + appel à 9h18",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Samedi",
     "id" : "6",
     }
   ]
   },
{
   "nom" : "am",
   "debut" : new Date("1970-01-01T09:00:00.000Z"),
   "fin" : new Date("1970-01-01T13:30:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "Back-office",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "V'",
   "debut" : new Date("1970-01-01T09:30:00.000Z"),
   "fin" : new Date("1970-01-01T12:00:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "Riviera",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "W",
   "debut" : new Date("1970-01-01T09:30:00.000Z"),
   "fin" : new Date("1970-01-01T18:30:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "Riviera",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "D",
   "debut" : new Date("1970-01-01T10:00:00.000Z"),
   "fin" : new Date("1970-01-01T14:00:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "Appelle au bureau ou sur Natel Dispo à 9h30",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "K",
   "debut" : new Date("1970-01-01T10:00:00.000Z"),
   "fin" : new Date("1970-01-01T15:00:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "Appeler au bureau ou sur natel dispo à 9h30",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 0,
     "nom" : "",
     "id" : "",
     }
   ]
   },
{
   "nom" : "ABS",
   "debut" : new Date("1970-01-01T11:00:00.000Z"),
   "fin" : new Date("1970-01-01T17:00:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "Dispo Lausanne samedi",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Samedi",
     "id" : "6",
     }
   ]
   },
{
   "nom" : "Bell",
   "debut" : new Date("1970-01-01T11:00:00.000Z"),
   "fin" : new Date("1970-01-01T13:00:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 0,
     "nom" : "",
     "id" : "",
     }
   ]
   },
{
   "nom" : "SV",
   "debut" : new Date("1970-01-01T12:00:00.000Z"),
   "fin" : new Date("1970-01-01T17:00:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "Riviera",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Samedi",
     "id" : "6",
     }
   ]
   },
{
   "nom" : "F",
   "debut" : new Date("1970-01-01T12:30:00.000Z"),
   "fin" : new Date("1970-01-01T18:00:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "B",
   "debut" : new Date("1970-01-01T13:00:00.000Z"),
   "fin" : new Date("1970-01-01T18:30:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "Dispo Lausanne",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "4",
   "debut" : new Date("1970-01-01T13:00:00.000Z"),
   "fin" : new Date("1970-01-01T18:00:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "5",
   "debut" : new Date("1970-01-01T13:00:00.000Z"),
   "fin" : new Date("1970-01-01T18:00:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "6",
   "debut" : new Date("1970-01-01T13:00:00.000Z"),
   "fin" : new Date("1970-01-01T18:30:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 0,
     "nom" : "",
     "id" : "",
     }
   ]
   },
{
   "nom" : "8",
   "debut" : new Date("1970-01-01T13:30:00.000Z"),
   "fin" : new Date("1970-01-01T18:00:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "B'",
   "debut" : new Date("1970-01-01T13:30:00.000Z"),
   "fin" : new Date("1970-01-01T18:15:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "Dispo Yverdon Neuchâtel IC ",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "b",
   "debut" : new Date("1970-01-01T13:30:00.000Z"),
   "fin" : new Date("1970-01-01T19:00:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "CoDispo Lausanne ATTENTION du 15.7 au 16.8 a+b = 10h-15h",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "pm",
   "debut" : new Date("1970-01-01T13:30:00.000Z"),
   "fin" : new Date("1970-01-01T18:15:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "Back-office ",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "7",
   "debut" : new Date("1970-01-01T14:00:00.000Z"),
   "fin" : new Date("1970-01-01T19:00:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "H",
   "debut" : new Date("1970-01-01T14:00:00.000Z"),
   "fin" : new Date("1970-01-01T19:00:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "9",
   "debut" : new Date("1970-01-01T15:00:00.000Z"),
   "fin" : new Date("1970-01-01T19:15:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "N",
   "debut" : new Date("1970-01-01T16:00:00.000Z"),
   "fin" : new Date("1970-01-01T19:30:00.000Z"),
   "ville" : "Lausanne",
   "remarques" : "",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "3",
   "debut" : new Date("1970-01-01T07:45:00.000Z"),
   "fin" : new Date("1970-01-01T13:00:00.000Z"),
   "ville" : "Neuchâtel",
   "remarques" : "Appelle le 1(Y) sur le natel privé à 07h15",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "4",
   "debut" : new Date("1970-01-01T10:00:00.000Z"),
   "fin" : new Date("1970-01-01T13:00:00.000Z"),
   "ville" : "Neuchâtel",
   "remarques" : "Appelle la dispo à 10h00",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "SN",
   "debut" : new Date("1970-01-01T12:00:00.000Z"),
   "fin" : new Date("1970-01-01T17:00:00.000Z"),
   "ville" : "Neuchâtel",
   "remarques" : "Coursier samedi Neuchâtel (appelle la dispo à 12h00)",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Samedi",
     "id" : "6",
     }
   ]
   },
{
   "nom" : "5",
   "debut" : new Date("1970-01-01T13:00:00.000Z"),
   "fin" : new Date("1970-01-01T18:45:00.000Z"),
   "ville" : "Neuchâtel",
   "remarques" : "Appelle la dispo à 13h00",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     }
   ]
   },
{
   "nom" : "6",
   "debut" : new Date("1970-01-01T13:00:00.000Z"),
   "fin" : new Date("1970-01-01T16:00:00.000Z"),
   "ville" : "Neuchâtel",
   "remarques" : "Appelle la dispo à 13h00",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     }
   ]
   },
{
   "nom" : "5b",
   "debut" : new Date("1970-01-01T13:00:00.000Z"),
   "fin" : new Date("1970-01-01T19:45:00.000Z"),
   "ville" : "Neuchâtel",
   "remarques" : "Appelle la dispo à 13h00",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "6b",
   "debut" : new Date("1970-01-01T13:00:00.000Z"),
   "fin" : new Date("1970-01-01T16:00:00.000Z"),
   "ville" : "Neuchâtel",
   "remarques" : "Appelle la dispo à 13h00",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "1",
   "debut" : new Date("1970-01-01T07:15:00.000Z"),
   "fin" : new Date("1970-01-01T13:00:00.000Z"),
   "ville" : "Yverdon",
   "remarques" : "Attend l'appel du 3(N) à 7h15",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "a",
   "debut" : new Date("1970-01-01T09:00:00.000Z"),
   "fin" : new Date("1970-01-01T13:00:00.000Z"),
   "ville" : "Yverdon",
   "remarques" : "Appelle la dispo à 9h00",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "SY",
   "debut" : new Date("1970-01-01T12:00:00.000Z"),
   "fin" : new Date("1970-01-01T17:00:00.000Z"),
   "ville" : "Yverdon",
   "remarques" : "Coursier samedi Yverdon (appelle la dispo à 12h00)",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Samedi",
     "id" : "6",
     }
   ]
   },
{
   "nom" : "2",
   "debut" : new Date("1970-01-01T13:00:00.000Z"),
   "fin" : new Date("1970-01-01T18:15:00.000Z"),
   "ville" : "Yverdon",
   "remarques" : "",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 1,
     "nom" : "Lundi",
     "id" : "1",
     },
     {
     "times" : 1,
     "nom" : "Mardi",
     "id" : "2",
     },
     {
     "times" : 1,
     "nom" : "Mercredi",
     "id" : "3",
     },
     {
     "times" : 1,
     "nom" : "Jeudi",
     "id" : "4",
     },
     {
     "times" : 1,
     "nom" : "Vendredi",
     "id" : "5",
     }
   ]
   },
{
   "nom" : "b",
   "debut" : new Date("1970-01-01T13:00:00.000Z"),
   "fin" : new Date("1970-01-01T16:00:00.000Z"),
   "ville" : "Yverdon",
   "remarques" : "Appelle la dispo à 13h00",
   "competences" : ["Back-office", "Spécial"],
   "jours" : [
     {
     "times" : 0,
     "nom" : "",
     "id" : "",
     }
   ]
   },
function() {
   console.log('finished populating shifts');
}
);
}); 

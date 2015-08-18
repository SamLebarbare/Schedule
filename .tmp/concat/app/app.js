'use strict';

angular.module('velociteScheduleApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'ui.calendar',
  'checklist-model',
  'angularMoment',
  "xeditable"
  ])
  .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider", function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
     moment.locale('fr', {
    months : "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
    monthsShort : "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
    weekdays : "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
    weekdaysShort : "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
    weekdaysMin : "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        LTS : "HH:mm:ss",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
    },
    calendar : {
        sameDay: "[Aujourd'hui à] LT",
        nextDay: '[Demain à] LT',
        nextWeek: 'dddd [à] LT',
        lastDay: '[Hier à] LT',
        lastWeek: 'dddd [dernier à] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : "dans %s",
        past : "il y a %s",
        s : "quelques secondes",
        m : "une minute",
        mm : "%d minutes",
        h : "une heure",
        hh : "%d heures",
        d : "un jour",
        dd : "%d jours",
        M : "un mois",
        MM : "%d mois",
        y : "une année",
        yy : "%d années"
    },
    ordinalParse : /\d{1,2}(er|ème)/,
    ordinal : function (number) {
        return number + (number === 1 ? 'er' : 'ème');
    },
    meridiemParse: /PD|MD/,
    isPM: function (input) {
        return input.charAt(0) === 'M';
    },
    // in case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example)
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */
    // },
    meridiem : function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

    $urlRouterProvider
    //if you are logged, redirect to planning
      .otherwise('/planningCoursier');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  }])

  .factory('authInterceptor', ["$rootScope", "$q", "$cookieStore", "$location", function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  }])

  .run(["$rootScope", "$location", "Auth", function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (!loggedIn) {
          console.log(loggedIn)
          $location.path('/login');
        }
      });
    });
  }]).run(["editableOptions", function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
}]);
'use strict';

angular.module('velociteScheduleApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      });
  }]);
'use strict';

angular.module('velociteScheduleApp')
  .controller('LoginCtrl', ["$scope", "Auth", "$location", function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/planningCoursier');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

  }]);

'use strict';

angular.module('velociteScheduleApp')
  .controller('SettingsCtrl', ["$scope", "Auth", function ($scope, Auth) {
    $scope.errors = {};
    $scope.user = Auth.getCurrentUser();

    $scope.user.naissance = moment($scope.user.naissance).format("DD MMMM YYYY")
     $scope.user.createdOn = moment($scope.user.createdOn).format("DD MMMM YYYY")
    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Mot de passe changé.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Mot de passe incorrecte';
          $scope.message = '';
        });
      }
		};
}])

'use strict';

angular.module('velociteScheduleApp')
  .controller('SignupCtrl', ["$scope", "Auth", "$location", function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

  }]);

'use strict';

angular.module('velociteScheduleApp')
  .directive('coursierDay', function () {
      return{
        scope : {
          year : "=",
          day : "=",
          setShift : "=",
          monthNum : "=",
          returnAttributions: "=",
          checkDispo : "=",
          user: "=",
          monthYear : "="
        },
        templateUrl: 'app/coursierDayDirective/coursierDays.html',

        link : function  (scope, elem, attrs) {
          elem.addClass('coursierDay')

          scope.addDispoChange = function (newMonth, newYear) {
            elem.attr("date", (scope.day)+"-"+(newMonth+1)+"-"+newYear )  
            var dispo = scope.checkDispo(scope.day, newMonth, newYear, scope.user._id) 
             elem.removeClass("presentOff present absent city-bg-off city-bg-on noInfo noInfoOff Lausanne Yverdon Neuchâtel notDispoLausanne notDispoYverdon notDispoNeuchâtel")
                if(dispo){
                  if (dispo.type =="Dispo") {
                     elem.addClass("presentOff")
                    if (dispo.villes) {
                      scope.from = moment(dispo.start).format("H:mm")
                      scope.to = moment(dispo.end).format("H:mm")
                      scope.cities =  dispo.villes.join(", ");
                      $.each(dispo.villes, function  (i, ville) {
                         elem.addClass(ville)
                         elem.addClass("city-bg-off")
                      })
                    }
                  }else{
                     elem.addClass("absent")
                     $(".absent").removeClass('highDispo mediumDispo lowDispo busy')
                    }
                }else{
                   elem.addClass("noInfoOff")
                }
          }

          scope.getAttrShifts = function (attributions, monthYear){
             scope.daShifts = []
             if (attributions) {
                 if (attributions[scope.day]) {           
                  var daShifts = []
                  $.each(attributions[scope.day].shifts, function(i, shift){
                     if (shift.coursierAttributed._id  == scope.user._id) {
                          if (shift.title == 'Absent') {
                            elem.addClass("absent")
                            elem.removeClass('presentOff')
                          }else{
                             daShifts.push(shift);  
                          }
                      }
                    })
                    scope.daShifts = daShifts;        
                }
              };  
          }
          /*
            checks if the number of shifts/week has been exceeded
          */
          scope.checkShiftsPerWeek = function(dayOfWeek, day, month, year){
              var date = new Date(year, month, day)
              var monthYear = moment(date).format("MM-YYYY");
              var startWeek = moment(date).startOf('week')._d
              var endWeek = moment(date).endOf('week')._d
              var day = moment(date).format("D");
              elem.removeAttr('shiftsAttributed shiftsLeft shiftsWanted coursierId coursierName')
              for(var month in scope.user.dispos){
                if (monthYear == month) {
                  for(var week in scope.user.dispos[month]){
                     
                    if (scope.user.dispos[month][week].dispos.length > 0) {

                      var aDay = scope.user.dispos[month][week].dispos[0].start;
                       var startWeekDay = moment(aDay).startOf('week')._d
                    //if its during the week you clicked, get the weekly shifts of that week
                    if (moment(startWeekDay).isSame(startWeek)) {
                      var shiftsPerWeek = scope.user.dispos[month][week].shiftsWeek;
                      scope.remarques = scope.user.dispos[month][week].remarques;
                      var attributed = scope.getNumberOfAttributedShiftsWeek(scope.user._id, monthYear, startWeek, endWeek)
                      scope.setDispoBGInfo(startWeek, endWeek, shiftsPerWeek, attributed,moment(date)._d)
                    };
                    };
                  }
                };
              }
          }
          /*
            thanks to te gb color, tell the user how many shifts approx. are left for attribution
            or if it has already been exceeded
          */
          scope.setDispoBGInfo = function(startWeek, endWeek, wantedShifts, attributedShifts, date){
            if (moment(startWeek).isBefore(date) || moment(startWeek).isSame(date) ) {
              if (moment(date).isBefore(endWeek) || moment(date).isSame(endWeek)) {
                //set bg from mon till saturday
                if (date.getDay()  < 7 &&  date.getDay() >0) {  
                  if (!elem.hasClass("absent")) {
                    var shiftsLeft = (wantedShifts-attributedShifts)
                      if (attributedShifts>wantedShifts || attributedShifts == wantedShifts) {
                        elem.addClass("busyOff")
                      }else if( shiftsLeft <= 2 ){
                        elem.addClass("lowDispoOff")
                      }else if(shiftsLeft >=3 && shiftsLeft <=5){
                        elem.addClass("mediumDispoOff")
                      }else if(shiftsLeft >=6){
                        elem.addClass("highDispoOff")
                      }
                    $(".absent").removeClass('highDispo mediumDispo lowDispo busy')
                    elem.attr('shiftsAttributed', attributedShifts)
                    elem.attr('shiftsLeft', shiftsLeft)
                    elem.attr('shiftsWanted', wantedShifts)
                    elem.attr('coursierId', scope.user._id)
                    elem.attr('coursierName', scope.user.name);
                    //used in popover on cell
                    scope.shiftsLeft = shiftsLeft
                    scope.wantedShifts = wantedShifts
                    scope.attributedShifts = attributedShifts
                  };
                  
                };          
              };
            };
          }
          /*
              gets the number of already attributed shifts to the coursier
              for the given week. 
          */
          scope.getNumberOfAttributedShiftsWeek = function (coursierId, monthYear, startWeek, endWeek) {
              var attributed = 0;
              var startDay = parseInt(moment(startWeek).format("D"));
              var endDay = parseInt(moment(endWeek).format("D"));
              var startMonth = moment(startWeek).month()
              var endMonth =  moment(endWeek).month()
              var currentMonth =  scope.monthNum;
              //use only days within the month and not from the previous or next !
              if (startDay > endDay && startMonth < endMonth && endMonth == currentMonth ) {
                startDay = 1;
              }
              else if (startDay > endDay && startMonth < endMonth && startMonth == currentMonth){
                endDay = moment(startWeek).daysInMonth()             
              };
              // console.debug(startDay, endDay); 
              for(var day in  scope.attributions){
                //look for shifts during that week and count        
                if (day >=startDay && day <=endDay ) {
                   var shifts = scope.attributions[day].shifts;
                   for (var i = shifts.length - 1; i >= 0; i--) {
                     if(shifts[i].coursierAttributed._id == coursierId && !shifts[i].title){//title-> dont count the absent shift as a shift!
                      attributed++;
                     }
                   };
                };        
              }     
              return attributed
          }

          //update view on attribution passed !!!!!!!!!!!!!
           scope.$on("attrPassed", function(e, args){
            //set for the first attribution
            if (!scope.attributions) {
              scope.attributions = {}
            };
            if (!scope.attributions[args.monthYear]) {
              scope.attributions[args.monthYear] = {}
            };
            scope.attributions[args.monthYear]  = args.attributions[args.monthYear]
            //scope.addDispoMonthChange(scope.monthNum);
            scope.getAttrShifts(scope.attributions[args.monthYear], args.monthYear)
            scope.checkShiftsPerWeek(null, scope.day, scope.monthNum, scope.year)
           })
           //update on deletition
           scope.$on("delPassed",function(e, args){
            scope.attributions[args.day].shifts = args.shifts
           // scope.addDispoMonthChange(scope.monthNum);
            scope.getAttrShifts(scope.attributions, scope.monthYear)
            scope.checkShiftsPerWeek(null, scope.day, scope.monthNum, scope.year)
           })
          //WATCH MONTH
           scope.$watch("monthNum",function(newMonth,oldValue) {
             //  elem.removeClass('lowDispo mediumDispo highDispo lowDispoOff mediumDispoOff highDispoOff busy busyOff absent present Lausanne Yverdon Neuchâtel notDispoCity')
               var date = new Date(parseInt(scope.year), newMonth, scope.day)
               var dayOfWeek = date.getDay();
               var monthYear = moment(1+"-"+(newMonth+1)+"-"+scope.year, "D-M-YYYY").format("MM-YYYY")
               scope.attributions = scope.returnAttributions(monthYear)
               scope.shiftsLeft = scope.wantedShifts = scope.daShifts =scope.cities = scope.attributedShifts = scope.remarques = scope.from = scope.to = scope.villes = null
               scope.addDispoChange(newMonth, scope.year);
               scope.getAttrShifts(scope.attributions, monthYear)
               scope.checkShiftsPerWeek(dayOfWeek,scope.day,  newMonth, scope.year)
            });
           //WATCH YEAR
           scope.$watch("year",function(newYear,oldValue) {
            //  elem.removeClass('lowDispo mediumDispo highDispo lowDispoOff mediumDispoOff highDispoOff busy busyOff absent present Lausanne Yverdon Neuchâtel notDispoCity')
              var date = new Date(parseInt(newYear), scope.monthNum, scope.day)
              var dayOfWeek = date.getDay();
              var monthYear = moment(1+"-"+(scope.monthNum+1)+"-"+newYear,  "D-M-YYYY").format("MM-YYYY")
              scope.attributions = scope.returnAttributions(scope.monthYear)
              scope.shiftsLeft = scope.wantedShifts = scope.daShifts = scope.cities = scope.attributedShifts = scope.from = scope.to =scope.remarques = scope.villes = null
              scope.addDispoChange(scope.monthNum, newYear)
              scope.getAttrShifts(scope.attributions, monthYear)
              scope.checkShiftsPerWeek(dayOfWeek, scope.day, scope.monthNum, newYear)
            });
           scope.$watch("limitTo",function() {

              var date = new Date(parseInt(scope.year), scope.monthNum, scope.day)
              var dayOfWeek = date.getDay();
              var monthYear = moment(1+"-"+(scope.monthNum+1)+"-"+scope.year,  "D-M-YYYY").format("MM-YYYY")
              scope.attributions = scope.returnAttributions(monthYear)
              scope.shiftsLeft = scope.wantedShifts = scope.daShifts = scope.cities = scope.attributedShifts = scope.from = scope.to =scope.remarques = scope.villes = null
              scope.addDispoChange(scope.monthNum, scope.year)
              scope.getAttrShifts(scope.attributions, monthYear)
              scope.checkShiftsPerWeek(dayOfWeek, scope.day, scope.monthNum, scope.year)
            });
           scope.$watch("limitFrom",function() {
              var date = new Date(parseInt(scope.year), scope.monthNum, scope.day)
              var dayOfWeek = date.getDay();
              var monthYear = moment(1+"-"+(scope.monthNum+1)+"-"+scope.year,  "D-M-YYYY").format("MM-YYYY")
              scope.attributions = scope.returnAttributions(monthYear)
              scope.shiftsLeft = scope.wantedShifts = scope.daShifts = scope.cities = scope.attributedShifts = scope.from = scope.to =scope.remarques = scope.villes = null
              scope.addDispoChange(scope.monthNum, scope.year)
              scope.getAttrShifts(scope.attributions, monthYear)
              scope.checkShiftsPerWeek(dayOfWeek, scope.day, scope.monthNum, scope.year)
            });

          }
        }
   
  });
'use strict';

angular.module('velociteScheduleApp')
  .controller('CoursierDetailsCtrl', ["$scope", "$http", "$state", "shiftService", function ($scope,$http, $state, shiftService) {

    $http.get("api/users/"+$state.params.coursierId).success(function(coursier){
    	$scope.user = coursier;
        //if user has no departure date, set it to YES (will display "actif : oui ")
        if(!$scope.user.departOn){
            $scope.user.departOn = "Oui"
        }else{
            $scope.user.departOn = moment($scope.user.departOn).format("dddd D MMMM YYYY")
        }
    })
    $scope.addCompetences = false;
     $scope.back =function(){
    	$state.go("^");
    }

    $scope.showCompetences = function(){
    	var competences = shiftService.getCompetences()
    	$.each($scope.user.competences, function(j, userComp){
    		$.each(competences,function(i,competence){
    			if (userComp == competence) {
    				 competences.splice(i,1)
    			};
    		})
    	})
    	$scope.competences = competences
    	$scope.addCompetences = true;

    }
    $scope.deactivateCoursier = function(user){
        var departOn = new Date()
        user.departOn = departOn
       $http({
            method: 'PUT',
            url: "/api/users/deactivateCoursier",
            data: {
                coursier:  user
            }
          }).success(function(data, status){ 
            console.debug(data);
             $scope.user.departOn = moment(departOn).format("dddd D MMMM YYYY")
          }).error(function(err){
            console.debug(err);
          })

    }

    $scope.add = function(competences){
    	Array.prototype.push.apply(competences, $scope.user.competences);
    	 $http({
            method: 'PUT',
            url: "/api/users/addCompetences",
            data: {
            	competences:competences,
            	id: $scope.user._id
            }
          }).success(function(data, status){ 
          	$scope.user.competences = competences;
          	$scope.showCompetences()
          })
    }
  }]);

'use strict';

angular.module('velociteScheduleApp')
  .controller('AdminCtrl', ["$scope", "$http", "Auth", "User", "calendarService", function ($scope, $http, Auth, User, calendarService) {
    var date = new Date()
    var monthYear = moment(date).format("MM-YYYY")
    $scope.monthNames = calendarService.getMonths()// jan fev mars...
    $scope.years = [2015, 2016, 2017,2018]
    $scope.currentMonth = date.getMonth()
    $scope.currentYear = date.getFullYear()
    $scope.year = $scope.currentYear
    $scope.checkDispos = ''


    //Get all users and format 'coursier depuis'
    $http.get("api/users").success(function(users){
      $scope.total  = users.length
      for (var i = users.length - 1; i >= 0; i--) {
        users[i].createdOn = moment(users[i].createdOn).format("D MMMM YYYY")
        if (!users[i].departOn) {
          users[i].departOn = "présent"
        }else{
            users[i].departOn = moment(users[i].departOn).format("dddd D MMMM YYYY")
        }
      };
      $scope.users = users
      $scope.checkGivenDispos($scope.currentMonth, $scope.currentYear)
    })


   $scope.checkGivenDispos = function(month, year){
     var date = new Date(year, month, 1)
     var monthYear = moment(date).format("MM-YYYY")
     var users = $scope.users
      for (var i = users.length - 1; i >= 0; i--) {
         if (users[i].dispos) {
           if(users[i].dispos.hasOwnProperty(monthYear)){
              $scope.users[i].gaveDispos = true;
           }
           if(!users[i].dispos.hasOwnProperty(monthYear) || Object.keys(users[i].dispos[monthYear]).length == 0){

            $scope.users[i].gaveDispos = false;
           }
       }else{
           $scope.users[i].gaveDispos = false;
       }
      };
      $scope.users = users
   }


    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };
  }]);

'use strict';

angular.module('velociteScheduleApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('coursiers', {
        url: '/coursiers',
        templateUrl: 'app/coursiers/coursiers.html',
        controller: 'AdminCtrl'
      }).state('coursiers.details', {
        url: '/:coursierId',
        templateUrl: 'app/coursierDetails/coursierDetails.html',
        controller: 'CoursierDetailsCtrl'
      })
  }]);
'use strict';

angular.module('velociteScheduleApp')
  .controller('AdminCtrl', ["$scope", "$http", "Auth", "User", "calendarService", function ($scope, $http, Auth, User, calendarService) {
    var date = new Date()
    var monthYear = moment(date).format("MM-YYYY")
    $scope.monthNames = calendarService.getMonths()// jan fev mars...
    $scope.years = [2015, 2016, 2017,2018]
    $scope.currentMonth = date.getMonth()
    $scope.currentYear = date.getFullYear()
    $scope.year = $scope.currentYear
    $scope.checkDispos = ''


    //Get all users and format 'coursier depuis'
    $http.get("api/users").success(function(users){
      $scope.total  = users.length
      for (var i = users.length - 1; i >= 0; i--) {
        users[i].createdOn = moment(users[i].createdOn).format("D MMMM YYYY")
        if (!users[i].departOn) {
          users[i].departOn = "présent"
        }else{
            users[i].departOn = moment(users[i].departOn).format("dddd D MMMM YYYY")
        }
      };
      $scope.users = users
      $scope.checkGivenDispos($scope.currentMonth, $scope.currentYear)
    })


   $scope.checkGivenDispos = function(month, year){
     var date = new Date(year, month, 1)
     var monthYear = moment(date).format("MM-YYYY")
     var users = $scope.users
      for (var i = users.length - 1; i >= 0; i--) {
         if (users[i].dispos) {
           if(users[i].dispos.hasOwnProperty(monthYear)){
              $scope.users[i].gaveDispos = true;
           }
           if(!users[i].dispos.hasOwnProperty(monthYear) || Object.keys(users[i].dispos[monthYear]).length == 0){

            $scope.users[i].gaveDispos = false;
           }
       }else{
           $scope.users[i].gaveDispos = false;
       }
      };
      $scope.users = users
   }


    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };
    console.debug($scope.checkDispos);
  }]);

'use strict';

angular.module('velociteScheduleApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('coursierss', {
        url: '/coursiers',
        templateUrl: 'app/admin/coursiers.html',
        controller: 'AdminCtrl'
      }).state('coursierss.details', {
        url: '/:coursierId',
        templateUrl: 'app/coursierDetails/coursierDetails.html',
        controller: 'CoursierDetailsCtrl'
      })
  }]);
'use strict';

angular.module('velociteScheduleApp')
  .controller('CreateCoursierCtrl', ["$scope", "Auth", "$modal", "shiftService", "$http", function ($scope,Auth, $modal,shiftService, $http) {
  	$scope.competences = shiftService.getCompetences()
  	$scope.invalidNo = false;

var date1 = moment("2-6-2015", "D-M-YYYY")
var date2 = moment("4-5-2015","D-M-YYYY")

console.debug(moment(date1).diff(date2,"days"));
  	//init false by default
    $scope.user = {
    	ag : false,
    	permis : false,
    	mobility : false
    };

   	$http.get('api/users').success(function(users){
		$scope.user.numeroCoursier =  users.length+1
		$scope.users = users;
	})


    $scope.createCoursier = function(user){   	

    	console.log(user);
    	 $scope.submitted = true;
    	 //if(form.$valid) {
	        Auth.createUser(user)
		        .then( function() {
		          // Account created, redirect to home
		           var modalInstance = $modal.open({
		            templateUrl: 'app/createCoursier/createCoursierModal.html',//par rapport a l index.html
		            controller: ["$scope", "$modalInstance", function($scope, $modalInstance){
	                  $scope.cancel = function(){ $modalInstance.dismiss('cancel'); }
	                  }],
		            size: "sm"
		          });
		        })
		        .catch( function(err) {
		        	console.log(err)
		        	var modalInstance = $modal.open({
		            template: "<h2>Erreur s'\est produite",//par rapport a l index.html
		            controller: ["$scope", "$modalInstance", function($scope, $modalInstance){
		                  $scope.cancel = function(){ $modalInstance.dismiss('cancel'); }
		                  }],
		            size: "sm"
		          });
		          err = err.data;
		          $scope.errors = {};

		          // Update validity of form fields that match the mongoose errors
		          angular.forEach(err.errors, function(error, field) {
		            form[field].$setValidity('mongoose', false);
		            $scope.errors[field] = error.message;
		          });
		     	});
		  //} 
    }//create coursier

    $scope.okModal = function(){
    	$modalInstance.dismiss('cancel');
    }

  }]).directive("validateNo", function() {
    return {
    	scope:{
    		numero : "=",
    		coursiers : "=",
    	},
        link: function(scope, elem, attrs) {
        	scope.$watch("numero",function(newNo, oldNo){
          if (scope.coursiers) {
            for (var i = scope.coursiers.length - 1; i >= 0; i--) {
                  if(scope.coursiers[i].numeroCoursier == newNo){
                    scope.$parent.invalidNo = true;
                    return;
                  }else{
                    scope.$parent.invalidNo = false;
                  }
               };
          };
        	})//watch

        }
    }

})

'use strict';

angular.module('velociteScheduleApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('createCoursier', {
        url: '/createCoursier',
        templateUrl: 'app/createCoursier/createCoursier.html',
        controller: 'CreateCoursierCtrl'
      });
  }]);
'use strict';

angular.module('velociteScheduleApp')
  .controller('CreateShiftCtrl', ["$scope", "User", "$http", "$modal", "calendarService", "shiftService", function ($scope, User, $http,$modal, calendarService, shiftService) {
  	//time picker for inputs
    $(document).ready(function(){
    	$('input[type="time"]').timepicker({
    		timeFormat : 'H\\:i',
    		disableTimeRanges: [['00:00am', '6:00am'], ['09:00pm', '00:00am']]
    	});
    });
    // Use the User $resource to fetch all users
    $scope.users = User.query();
    $scope.competences = shiftService.getCompetences()
    $scope.shift = {
      competences : [],
      debut : new Date(),
      fin : new Date()
    };
    console.debug($scope.shift);
    $scope.shift.coursiers = null;
    $scope.selectedCompetences = [];
    $scope.isFalseHour = false;
    $scope.times = 1;
    //days of week with default times/day shift = 1
    $scope.days = shiftService.getWeekDays()
    $scope.cities = shiftService.getCities()
     //months for periode de validite
    $scope.months = calendarService.getMonths();

   /*
    sets the number of times a shift should be done per day
   */
   $scope.insertTimesPerDay = function(day, times){
    for (var i = 0; i < $scope.days.length; i++) {
      if (day == $scope.days[i].nom) {
        $scope.days[i].times = parseInt(times);
      };
    };
   }

  $scope.sortByCompetences = function  (competences) {
    console.log(competences)
    var competentUsers = []
    for (var i = $scope.users.length - 1; i >= 0; i--) {
     var ok = shiftService.containsAll(competences, $scope.users[i].competences); // true
      if (ok) {
        competentUsers.push($scope.users[i])
      };
    };
    $scope.competentUsers = competentUsers

  }
   /*
    create the shift with all its data
   */
    $scope.createShift = function(shift){
      console.debug(shift);
      if (shift.nom == null || shift.nom == '') {
         var modalInstance = $modal.open({
                templateUrl: 'app/createShift/shiftIncompleteModal.html',//par rapport a l index.html
                controller: ["$scope", "$modalInstance", function($scope, $modalInstance){
                  $scope.cancel = function(){ $modalInstance.dismiss('cancel'); }
                  }],
                size: "sm"
            });  
      }else{
          $http({
            method: 'POST',
            url: "/api/shifts",
            data: shift
          }).success(function(data, status){    
            var modalInstance = $modal.open({
                templateUrl: 'app/createShift/shiftCreatedModal.html',//par rapport a l index.html
                controller: ["$scope", "$modalInstance", function($scope, $modalInstance){
                  $scope.cancel = function(){ $modalInstance.dismiss('cancel'); }
                  }],
                size: "sm"
            });  
             console.log(data);
             console.log(status);
          }).error(function(err){
            console.log(err);
          }) 
      }
    
    }
    /*
      check if start hour isn't after ending or ending before start
    */
    $scope.checkHour = function(start, end){
     $scope.shift.debut = start;
     $scope.shift.fin = end;

      if (typeof start != 'undefined' && typeof end != 'undefined') {
        if (moment(start).isAfter(end, 'hour')) {
          $scope.isFalseHour = true;
        }else $scope.isFalseHour = false;
      };

    }



  }]);

'use strict';

angular.module('velociteScheduleApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('createShift', {
        url: '/createShift',
        templateUrl: 'app/createShift/createShift.html',
        controller: 'CreateShiftCtrl'
      });
  }]);
'use strict';

angular.module('velociteScheduleApp')
  .directive('doublonsCity', function () {
  
      return{
        scope : {
          year : "=",
          day : "=",
          monthNum : "=",
          dailyShifts : "=",
          returnAttributions: "=",
          monthYear : "="
        },
         templateUrl: 'app/doublonsCityDirective/doublonsCity.html',
    
        link : function  (scope, elem, attrs) {
          scope.attributions = null;
         
          /*
            checks if shift has already been attributed and how many times
            => manques par ville + nb de fois
            In this case -> check if too much OR if its not the day that shift should be done
          */
          scope.isAttributedShift = function (shift, day, month, year, attributions) {
              var date = new Date(year, month, (day+1));
              var day = moment( date ).format("D");  
              var dayId = date.getDay()
              //get the day
              for(var daDay in attributions){
                if (daDay == day) {
                  var times = 0;
                  var dayShifts = attributions[day].shifts
                  //for every shift attributed, if its the same as 
                  //count each attributed shift
                  for (var i = dayShifts.length - 1; i >= 0; i--) {
                    if (dayShifts[i].shiftID == shift._id || dayShifts[i]._id == shift._id) {
                      times++;   
                    }
                  };
                  
                }
              }       
              //if it has been attributed at least one time
              if (times > 0) {
                  //check if its the correct day for that shift
                  var shiftDayIds = []
                  for(var theDay in shift.jours){
                    shiftDayIds.push(shift.jours[theDay].id)
                  }
                  //if its incorrect day, show it with other bg
                  if ($.inArray(dayId, shiftDayIds) == -1) {
                    var daShift = {_id: shift._id, 
                      nom: shift.nom, invalidDay: true, 
                      ville : shift.ville, timesLeft : times,
                      competences:shift.competences, 
                      fin: shift.fin, debut: shift.debut
                    }
                     return daShift;
                  }
                  //else, its the good day, return how many times
                  else{
                    //check how many times on that day it sould be done!
                    for(theDay in shift.jours){
                      if (shift.jours[theDay].id == dayId) {
                        if (times > shift.jours[theDay].times) {
                           var daShift = {_id: shift._id, nom: shift.nom, enough: true, 
                            ville : shift.ville, timesLeft : Math.abs(shift.times-times),
                            competences:shift.competences, 
                            fin: shift.fin, debut: shift.debut
                          }
                           return daShift;
                        };
                      };
                    }


                  }
              }               
          }
          scope.checkShifts = function(day, month, year, attributions){
            var date = new Date(parseInt(year), month, day+1)
            var dayOfWeek = date.getDay();
            //will be checking for all the shifts
            scope.shifts =  scope.dailyShifts[scope.dailyShifts.length-1]
            scope.doubleShifts = [];
            if (scope.shifts) {
                 $.each(scope.shifts, function(i, shift){
                  var shift = scope.isAttributedShift(shift, scope.day, month, year, attributions) 
                    if (shift) {                  
                    scope.doubleShifts.push(shift)
                  };
                })   
            };          
          }
           //update view on attribution passed !!!!!!!!!!!!!
           scope.$on("attrPassed", function(e, args){
            scope.attributions = args.attributions[args.monthYear]
            scope.checkShifts(args.day, scope.monthNum, scope.year, scope.attributions)
           })
          //update on deletition
           scope.$on("delPassed",function(e, args){
            scope.attributions[args.day].shifts = args.shifts
            scope.checkShifts(args.day, scope.monthNum, scope.year, scope.attributions)
           })
          //WATCH MONTH and re render changes
           scope.$watch("monthNum",function(newMonth,oldValue) {
             scope.attributions = scope.returnAttributions(scope.monthYear)
             scope.checkShifts(scope.day, newMonth, scope.year, scope.attributions)
            });
           //WATCH YEARand re render changes
           scope.$watch("year",function(newYear,oldValue) {
             scope.attributions = scope.returnAttributions(scope.monthYear)
              scope.checkShifts(scope.day, scope.monthNum, newYear, scope.attributions)
           });
       
      }
     }
      
  });
'use strict';

angular.module('velociteScheduleApp')
  .controller('AttribuerShiftCtrl', ["$scope", "shifts", "$http", "preselectedDate", "preselectedShift", "coursier", "date", "allShifts", "AttributionsService", "attributions", "attributedShifts", function ($scope, shifts, $http, preselectedDate, preselectedShift, 
                      coursier, date, allShifts, AttributionsService, attributions, attributedShifts) {
    //->no shifts found => the user didnt give his dispos  (coming from setShift())
    if (shifts == null) {
      shifts = []
      $scope.wait = false;
      $scope.noDispo = true;
    };
    if(preselectedShift && moment(date).format("D-M-YYYY") == preselectedDate){
      $scope.preselectedShift = preselectedShift
    }
       //if any, you can delete one and sort them out
    if (attributedShifts){
      $scope.attributed = true;
      $scope.attributedShifts = attributedShifts.coursierShifts
    }; 
    shifts.push({nom: "Absence/vacances", 
                  _id: "nope",
                  ville: "Indisponible",
                  start: date,
                  title: 'Absent'
                })
    $scope.shifts = shifts;
    $scope.date = date;
    $scope.coursier = coursier
    $scope.wait = true;
    $scope.allShifts = allShifts

    //remove from select already enoughly attributed shifts
    $.each(attributedShifts.enoughAttr, function(i, enough){
      $.each($scope.shifts, function(j,shift){
        if (shift && enough) {
          if (shift._id == 
            enough._id) {
             $scope.shifts.splice(j, 1)
          };
        };
       
      })
    })
    //preselect the selected shift in manques, if exising in the shift list
    if(preselectedShift && moment(date).format("D-M-YYYY") == preselectedDate){
      $http.get("api/shifts/"+preselectedShift._id).success(function(shift){
        for (var i = $scope.shifts.length - 1; i >= 0; i--) {
           if($scope.shifts[i]['_id'] === shift['_id']){
                $scope.selectedShift = []
                $scope.selectedShift.push($scope.shifts[i]);
            }
        };
        
      })
    }

    /*
      returns the number of desired shifts per week
      on during the week of the clicked day. Calls getNumberOfAttributedShifts.
    */
    $scope.getDesiredShiftsWeekly = function (coursierId, date) {
      $http.get("api/users/"+coursierId).success(function(coursier) {
          var monthYear = moment(date).format("MM-YYYY");
          var startWeek = moment(date).startOf('week')._d
          var endWeek = moment(date).endOf('week')._d
          var day = moment(date).format("D");
          for(var month in coursier.dispos){
            if (monthYear == month) {
              for(var week in coursier.dispos[month]){
                 var aDay = coursier.dispos[month][week].dispos[0].start;
                 var startWeekDay = moment(aDay).startOf('week')._d
                //if its during the week you clicked, get the weekly shifts of that week
                if (moment(startWeekDay).isSame(startWeek)) {
                  $scope.shiftsWeekly = coursier.dispos[month][week].shiftsWeek; 
                  $scope.getNumberOfAttributedShifts(coursierId, monthYear, startWeek, endWeek)
                  $scope.wait = false;
                };
              }
            };
          }
      })
    
    }
    /*
        gets the number of already attributed shifts to the coursier
        for the given week. 
    */
    $scope.getNumberOfAttributedShifts = function (coursierId, monthYear, startWeek, endWeek) {
        var attributed = 0;
        var startDay = parseInt(moment(startWeek).format("D"));
        var endDay = parseInt(moment(endWeek).format("D"));

         var startMonth = moment(startWeek).month()
            var endMonth =  moment(endWeek).month()
            var currentMonth = new Date().getMonth();
              if (startDay > endDay && startMonth < endMonth && endMonth == currentMonth ) {
              startDay = 1;
            }
            else if (startDay > endDay && startMonth < endMonth && startMonth == currentMonth){
              endDay = moment(startWeek).daysInMonth()             
            };
        for(var day in  attributions[monthYear]){
          //look for shifts during that week and count        
          if (day >= startDay && day <=endDay ) {
             var shifts = attributions[monthYear][day].shifts;            

             for (var i = shifts.length - 1; i >= 0; i--) {
               if(shifts[i].coursierAttributed._id == coursierId){
                attributed++;
               }
             };
          };        
        } 
        $scope.attributed = attributed;      
        return;
    }
    /*
      returns the hours dispo of the clicked day
    */
    $scope.dispoHoursOfTheDay = function (coursier, date) {
      var monthYear = moment(date).format("MM-YYYY");
      var day = moment(date).format("DD-MM-YYYY")
        //for the month of the click date
       for(var month in coursier.dispos){
        if (monthYear == month) {
          //for every week
          var monthDispos = coursier.dispos[monthYear]
          for(var week in monthDispos){
            //look for the dispo day = click day
            for (var i = 0; i < monthDispos[week].dispos.length; i++) {
             var dispoDay = moment(monthDispos[week].dispos[i].start).format("DD-MM-YYYY")
              if (dispoDay == day) {
                //and get the hours of the dispo day
                $scope.dispoStart = monthDispos[week].dispos[i].start;
                $scope.dispoEnd = monthDispos[week].dispos[i].end;
              };
            };
          }
        };
       }
    }
      $scope.getDesiredShiftsWeekly(coursier._id, date)
      $scope.dispoHoursOfTheDay(coursier, date)
    
    $scope.close = function() {
       $scope.$dismiss();
       $(".colDaySelected").removeClass('colDaySelected');
     
    };
    $scope.deleteShift = function(coursier, date, shift){
      AttributionsService.deleteShift(coursier, date, shift);
       $(".colDaySelected").removeClass('colDaySelected');
        $scope.$close();
    }
    $scope.attribuer = function(shifts, coursier, date, otherShift) {
      //in components/attribution
      AttributionsService.setShift(shifts, coursier, date,otherShift);
      $(".colDaySelected").removeClass('colDaySelected');
       $(".lowPotential, .mediumPotential, .highPotential, .busy, .shiftManqueDaySelected").removeClass("lowPotential mediumPotential highPotential busy shiftManqueDaySelected")
      $scope.$close();

    };

}]);

  'use strict';

  angular.module('velociteScheduleApp')

  .controller('MainCtrl', ["$modal", "$state", "$scope", "$http", "User", "calendarService", "AttributionsService", "shiftService", "Auth", function ($modal,$state, $scope, $http, User, calendarService, AttributionsService, shiftService, Auth) {
      
      var date = new Date();
      var days = calendarService.getDays() // lu ma me...
      var months = calendarService.getMonths()// jan fev mars...

      $scope.monthNum = date.getMonth();
      $scope.year = date.getFullYear();
      $scope.today = moment(new Date()).format("D-M-YYYY")
      $scope.monthYear = moment(new Date()).format("MM-YYYY")
      $scope.cities = shiftService.getCities()
      $scope.isAdmin = Auth.isAdmin; //to show or not to show the first planning
      $scope.currentUser = Auth.getCurrentUser()
      $scope.loading = true;
      $scope.toggleAll = false;
      $scope.showAllPlanning = true;
      $scope.shiftSources = [];
      $scope.alreadySeen = [];
      $scope.formatedShifts = []
      $scope.number = 12;
      $scope.limitFrom = 0;
      $scope.limitTo = 12;
      $scope.dispoOn = false;
      $scope.noInfoOn = false;
      $scope.toggleCities = []
      $scope.citiesLeft = []
      $scope.citiesManques = []

  $(document).ready(function () {
    $("body").on('click','.cityManquesHeader',function(){
       $(this).next('tr').slideToggle('fast')
    });

    $("body").on('mouseover','.coursierDay',function(){
      $(".colHover").removeClass("colHover")
      $(this).closest('tr').addClass('colHover')
    });


    $(".planning").on('mousewheel',"#shiftsTable",function(e){
      e.preventDefault();
        if(e.originalEvent.wheelDelta /120 > 0) {
           $("#down").trigger('click')  
        }
        else{
          $("#up").trigger('click')
            
        }
       if ($scope.preselectedShift) {
          //you have to give some time to load first
          setTimeout(function(){
            var day = moment($scope.preselectedDate,"D-M-YYYY").format("D")
            var month = moment($scope.preselectedDate,"D-M-YYYY").format("M")
            var year = moment($scope.preselectedDate,"D-M-YYYY").format("YYYY")
            $scope.showPotentialCoursiers(day,(month-1),year,$scope.preselectedShift, $scope.preselectedEvent)
        },100)
      }
      if ($scope.dispoOn) {
         $(".presentOff").removeClass("presentOff").addClass("present");
      };
       if ($scope.noInfoOn) {
        $(".noInfoOff").removeClass("noInfoOff").addClass("noInfo");
      };
      if ($scope.toggleAll) {
         $("td.lowDispoOff").addClass('lowDispo').removeClass('lowDispoOff') 
         $("td.mediumDispoOff").addClass('mediumDispo') .removeClass('mediumDispoOff')  
         $("td.highDispoOff").addClass('highDispo') .removeClass('highDispoOff')  
         $("td.busyOff").addClass('busy').removeClass('busyOff');
      };
      $scope.toggleCityDispos(null)


    });

    $(document).keyup(function(e) {
      //when escaping attribution popover with "annuler"
       if (e.keyCode == 27) { 
          $(".colDaySelected").removeClass('colDaySelected')
      }
    });

    //because angular-fullcalendar was so sloooooow....
    $('#fullCal').fullCalendar({
          height: 620, width:400, aspectRatio: 0.4,firstDay: 1, //monday
          editable: false,allDaySlot: false,eventLimit: 3,minTime: "06:00:00", 
          maxTime: "21:00:00",lang : 'fr',
          header: {
            left: 'month agendaWeek',
            center: 'title',
            right: 'today prev,next'
          },
          eventAfterRender: function(evento, element) {
            var new_description = '<div>Shift: <b>'+evento.title+'</b></div>' +
               'de <strong>'+moment(evento.start).format("HH:mm")+"</strong> à <strong>"
               +moment(evento.end).format("HH:mm")+"</strong>"+
               '</br> Ville: <strong>' + evento.ville +"</strong>";
                element.empty().append(new_description);
          },//end eventrender
          viewRender: function(view, element) {
            var monthYear = moment(view.calendar.getDate()).format("MM-YYYY");
            //if didn't  see this month yet, download the attributions to cal
            if ($.inArray(monthYear, $scope.alreadySeen) == -1) {
              $scope.alreadySeen.push(monthYear)
              $http.get('api/attributions').success(function(attributions){
                $scope.attributions = attributions

             AttributionsService.getMyMonthlyShifts($scope.currentUser._id, monthYear, $scope.attributions, function (myShifts) {
              console.debug(myShifts);
                  AttributionsService.formatShiftsForCalendar(myShifts, function(formatedShifts){ 
                  $scope.formatedShifts = $scope.formatedShifts.concat(formatedShifts)    
                  $('#fullCal').fullCalendar('removeEventSource')
                  $('#fullCal').fullCalendar('removeEvents');
                   $('#fullCal').fullCalendar('addEventSource',$scope.formatedShifts);
                  })
              })//monthlyShifts
            })//get
          };//if       
          }//viewRender
      })
  })


  //render calendar on month or year change
  $scope.renderCalendar = function(month, year){
    var dateStart = new Date(year, month, 1)//1st of the month
    var dateEnd =  new Date(year, month+1, 0) //last day of the month
    $(".notDispoLausanne, .notDispoYverdon, .notDispoNeuchâtel").removeClass("notDispoLausanne notDispoYverdon notDispoNeuchâtel")
    //show the only coursiers that were active during that moment!
      // for (var i = $scope.coursiers.length - 1; i >= 0; i--) {
      //     if ( moment(dateStart, "MM-YYYY").isAfter( moment($scope.coursiers[i].createdOn), "MM-YYYY") ) {
      //       console.debug('is  before');
      //       console.debug(dateStart);
      //       console.debug($scope.coursiers[i].createdOn, $scope.coursiers[i].name);
      //       delete $scope.coursiers[i]
      //     };
      // };

    //if year == null, only month has changed -> load only dispos of this month
    if (year == null) {
      $scope.monthYear = moment(1+"-"+(month+1)+"-"+$scope.year,"D-M-YYYY").format("MM-YYYY")
      year = $scope.year
      $scope.loadAbsencesAndDispos($scope.coursiers, month)
    }else{
      $scope.monthYear = moment(1+"-"+($scope.monthNum+1)+"-"+year,"D-M-YYYY").format("MM-YYYY")
    }
    $scope.monthNum = parseInt(month);
    $scope.calendar = {
        year : year, //selected year
        month: months[$scope.monthNum], //selected month ('janvier','fevrier')
        monthNames: months,// array of mont hames
        daysNames : getDaysArray(year, $scope.monthNum), // get day name for each day of month
        days : new Date(year, $scope.monthNum+1,0).getDate(),//number of days in month
        monthDays : new Array(new Date(year, $scope.monthNum+1,0).getDate())
    }
    $scope.loading = false;
    
  } 
  //sets the preselected shift to null so you can 
  //set any shift
  $scope.unselectShift = function(){
    $scope.preselectedShift = null
    $(".lowPotential, .mediumPotential, .highPotential, .busyPotential, .shiftManqueDaySelected").removeClass("lowPotential mediumPotential highPotential busyPotential shiftManqueDaySelected")
    $(".shiftManqueDaySelected").removeClass("shiftManqueDaySelected")
  }
  //when searching for a numero-coursier, you have to
  //open the limits of the searching array
  $scope.searchNo = function(number){
    console.debug($scope.limitFrom, $scope.limitTo);
    if (number == '' || typeof number=== undefined) {
      $scope.limitFrom = 0
      $scope.limitTo =  $scope.number
    };
    for (var i = $scope.coursiers.length - 1; i >= 0; i--) {
      if(number == $scope.coursiers[i].numeroCoursier){
         $scope.limitFrom = 0
         $scope.limitTo = $scope.coursiers.length
      }
    };
  }
  /*
    //TODO - BY MONTH TOO!
    returns an array of shifts ordered by day of week
    array[0] = shifts of monday, array[1] = shifts on tuesday...
  */
  $scope.orderShiftsByDay = function(){
    var shiftsMon = []
    var shiftsTue = [] 
    var shiftsWed = [] 
    var shiftsTh = [] 
    var shiftsFr = [] 
    var shiftsSat = [];
    var allShifts = []
    if( typeof shifts == 'undefined'){
      shiftService.getShifts(function(shifts){
        for (var i = 0; i < shifts.length; i++) {
          for (var j = 0; j < shifts[i].jours.length; j++) {
            var jour = shifts[i].jours[j].id
            var shift = {   
                            shiftID : shifts[i]._id,
                            nom :shifts[i].nom, 
                            times: shifts[i].jours[j].times, 
                            ville: shifts[i].ville, 
                            _id: shifts[i]._id,
                            competences : shifts[i].competences,
                            debut : shifts[i].debut, 
                            fin: shifts[i].fin, 
                            jours : shifts[i].jours,
                            remarques : shifts[i].remarques
                         }
            if (jour == 1) {
              shiftsMon.push(shift)
            };
            if (jour == 2) {
              shiftsTue.push(shift)
            };
            if (jour == 3) {
              shiftsWed.push(shift)
            };
            if (jour == 4) {
               shiftsTh.push(shift)
            };
            if (jour == 5) {
              shiftsFr.push(shift)
            };
            if (jour == 6) {
               shiftsSat.push(shift)
            };
          };
            allShifts.push(shift)

        };
         var shiftsJour = [shiftsMon, shiftsTue, shiftsWed, shiftsTh, shiftsFr, shiftsSat, allShifts]
         $scope.dailyShifts = shiftsJour;
      });
    }
  }
  $scope.orderShiftsByDay();
  /*
    show, by day, who could possibly do the shift.
    Green -> is able, is present and nbshifts/week ok
    Blue -> is able, present but nbshifts/week not ok
    Orange -> is not able but present + city ok
    Gray -> is not able, busy, but city+hours ok
    Called in HTML, Calls -> sortPotentialCoursiers()
  */
  $scope.showPotentialCoursiers = function(day,month,year, shift, event){
    $(".lowPotential, .mediumPotential, .highPotential, .busyPotential, .shiftManqueDaySelected").removeClass("lowPotential mediumPotential highPotential busyPotential shiftManqueDaySelected")
    $(event.target).addClass('shiftManqueDaySelected')
    var date = moment(new Date(year, month, day)).format("D-M-YYYY");
    var theDay = moment(new Date(year, month, day)).format("D")
    $scope.preselectedShift = shift;
    $scope.preselectedDate = date;
    $scope.preselectedEvent = event
    var arePresentDispos = [];
    //get every one on dispo on that day
    for(var day in $scope.lesPresences){
      if (day == theDay) {
        arePresentDispos = $scope.lesPresences[day]
      };
    }
    $('td.coursierDay').each( function(){
      var attributedShifts = $(this).attr('shiftsAttributed');
      var shiftsLeft = $(this).attr('shiftsLeft');
      var shiftsWanted = $(this).attr('shiftsWanted');
      var cellCoursierId = $(this).attr('coursierid');
      var cellDate = $(this).attr('date');
       //get the cells (colummn) of the selected day
      if (cellDate == date) {
        if (cellCoursierId) {
          $scope.sortPotentialCoursiers(cellCoursierId, shiftsLeft, shiftsWanted, attributedShifts, date, shift, arePresentDispos, $(this) )
        };
       };
    })
  }
  /*
    highlights the coursiers that could be potentially chosen to do a shift
    called in showPotentialCoursiers()
  */
  $scope.sortPotentialCoursiers = function(coursierId, shiftsLeft, shiftsWanted, attributedShifts, date, shift, arePresentDispos, cell){
      var cell = { this : cell, attributedShifts : attributedShifts, shiftsLeft : shiftsLeft, shiftsWanted : shiftsWanted, coursierId :coursierId}
      //convert to minutes
      var shiftStart = moment.duration( moment(shift.debut).format("H:mm")).asMinutes()
      var shiftEnd =  moment.duration( moment(shift.fin).format("H:mm")).asMinutes()
      var coursiers = $scope.coursiers
      //get the present coursier
      for (var i = coursiers.length - 1; i >= 0; i--) {
        for (var j = arePresentDispos.length - 1; j >= 0; j--) {
           if(arePresentDispos[j].coursierId == coursiers[i]._id){
             var coursier = coursiers[i];
             //get the present date == cell date
             if (cell.coursierId == coursier._id) {
                //convert to minutes
                var dispoStart = moment.duration(moment(arePresentDispos[j].start).format("H:mm")).asMinutes()
                var dispoEnd = moment.duration(moment(arePresentDispos[j].end).format("H:mm")).asMinutes()
                var isBetweenHours = $scope.isDispoBetweenShiftHours(dispoStart, dispoEnd, shiftStart, shiftEnd);
                var isInCity = arePresentDispos[j].villes.indexOf(shift.ville)
                var isBusy = parseInt(attributedShifts)>parseInt(shiftsWanted) || parseInt(attributedShifts)==parseInt(shiftsWanted)
                var isCapable = shiftService.containsAll(shift.competences, coursier.competences)
                //everything ok, green
                if (isCapable && isBetweenHours && (isInCity != -1) && !isBusy) {
                  cell.this.addClass('highPotential')
                //can but is busy, blue
                }else if(isCapable && isBetweenHours && (isInCity != -1) && isBusy){
                  cell.this.addClass('mediumPotential')
                //cant but is available, orange
                }else if(!isCapable && isBetweenHours && (isInCity != -1) && !isBusy){
                  cell.this.addClass('lowPotential')
                //cant, is busy, but is hours and city is ok
                }else if(!isCapable && isBetweenHours && (isInCity != -1) && isBusy){
                  cell.this.addClass('busyPotential');
                }
             };
           }
        }; 
      };
    }
  /*
      gets the user attributed shifts + the shifts that haven't
      been attributed enough times on that day-> will be shown in the selection menu
  */
  $scope.getAttributedShifts = function (attributions, date, coursierId){
      var day = moment(date).format("D");
      var coursierShifts = [];
      var attrShiftsDay = []
      var enoughAttr = []
      var dayId = date.getDay()
      var dayShifts = $scope.dailyShifts[dayId-1];
      var dayShift = {}
      var countShift = {}
      //get how many times a shift has to be done on that day
      for(var theShift in dayShifts){
        var currenShift = dayShifts[theShift];  
        for (var i = currenShift.jours.length - 1; i >= 0; i--) {
          if(currenShift.jours[i].id == dayId){
            dayShift[currenShift.nom] = currenShift
            dayShift[currenShift.nom].times = currenShift.jours[i].times
          }
        };
      }
     //all attributed shifts on that day + of the coursier 
     if(attributions) {
         if (attributions[day]) {        
          var dailyAttr = attributions[day].shifts
          $.each(attributions[day].shifts, function(i, shift){
             if (shift.coursierAttributed._id  == coursierId) {
                coursierShifts.push(shift);  
              }
            })                     
        };
       }; 
      //check the shifts that are attributed enough times
      if (dailyAttr){ 
        for (var i = dailyAttr.length - 1; i >= 0; i--) {
          if (!countShift[dailyAttr[i].nom]) {
            countShift[dailyAttr[i].nom] = 0
          }
          countShift[dailyAttr[i].nom]++
        };
       $.each(dayShift, function(shift, count){
          if (dayShift[shift] && dayShift[shift].times <= countShift[shift]) {
            enoughAttr.push(dayShift[shift])
          };
       })
      }
      var shifts = {coursierShifts: coursierShifts, enoughAttr: enoughAttr}
      return shifts; 
     
    }

  /*
    Shows a list of sorted out shifts with corresponding
    hours, cities and capabilities of coursier.
    If there is a preselected shift, it automatically attributes the shift
    to the cell if its the same day as the selected shift day
  */
    $scope.setShift = function(day, month,year, user){
      if (Auth.isAdmin()) {
        var date = new Date(year, month, day)
        var formatedDate = moment(date).format("D-M-YYYY")
        var day =  moment(date).format("D")
        var dayOfWeek = moment(date).day()
        //attribute the selected shift automatically
        if($scope.preselectedShift && formatedDate == $scope.preselectedDate){
           AttributionsService.setShift([$scope.preselectedShift], user, date, null);
           $scope.preselectedShift = null
           $(".lowPotential, .mediumPotential, .highPotential, .busy, .shiftManqueDaySelected").removeClass("lowPotential mediumPotential highPotential busy shiftManqueDaySelected")
           return;
        }
        var day_shifts = $scope.dailyShifts[dayOfWeek-1]
        var presences = $scope.lesPresences
        //Get attributed shifts for that coursier on that day
        var attributedShifts  = $scope.getAttributedShifts($scope.attributions[0].monthYear[$scope.monthYear], date, user._id)
        //there are no presences sent yet
        if(Object.keys(presences).length == 0){
           $scope.showPopover(null, user, date, null, attributedShifts);  
           return;  
        }
       var index = 0;
       var max = Object.keys(presences).length 
        //check if the day clicked is an dispo present day
        for(var theDay in presences){
          index++;
          if (theDay == day) {
            for (var i =  presences[day].length - 1; i >= 0; i--) {
              var dispo = presences[day][i]
              if(dispo.coursierId == user._id){
                var dispoHours = $scope.getDispoHoursAndDay(dispo);
                var time_shifts = $scope.compareDiposHoursAndShift(dispoHours, day_shifts);
                var time_city_shifts  = $scope.compareDispoCityAndShift(time_shifts, dispo);
                var time_city_able_shifts = $scope.compareUserAndShift(time_city_shifts, user._id, user.competences); 
                //show the select screen, give it the date, found shifts and the complete user.
                $scope.showPopover(time_city_able_shifts, user, date, day_shifts, attributedShifts);  
                return;
              //no dispo found!
              }else if (i == 0){
                $scope.showPopover(null, user, date, null, attributedShifts);  
                return;  
            }
          };
        //there are presences, but none of the user
        }else if(index == max){
            $scope.showPopover(null, user, date, null, attributedShifts);  
            return;   
        }
      }
    };//isAdmin

    }
  $scope.showPopover = function(shifts, coursier, date, dayShifts,attributedShifts, event){
    var dateCol = moment(date).subtract(1, 'months')
    var dateCol = moment(dateCol).format('D-M-YYYY')
    $("col[date="+dateCol+"]").addClass('colDaySelected');
    $modal.open({
          templateUrl: "app/main/setShiftModal.html",
          animation: false,
          backdrop: false,
          size: "sm",
          windowClass: "modalWindow",
          resolve: {// what we send to the modal  as 'index'
              shifts : function(){
                return shifts;
              },
              coursier: function(){
                return coursier;
              },
              date: function(){
                return date;
              },
              attributions : function () {
                return $scope.attributions[0].monthYear
              },
              dayShifts : function () {
                 return dayShifts
              },
              allShifts :function(){
                return $scope.shifts
              },
              preselectedShift : function(){
                return $scope.preselectedShift
              },
              preselectedDate : function(){
                return $scope.preselectedDate
              },
              attributedShifts : function(){
                  return attributedShifts
              }
          },
          controller: 'AttribuerShiftCtrl'
      });
   }
  /*
    tell if user is permited to do a shift, selected at the creation of shift
  */
  $scope.compareUserAndShift = function(shifts, userId, userCompetences){
    var capableShifts = [];
    for (var i = 0; i < shifts.length; i++) {
      //if user has all competences needed for this shift
        var ok = shiftService.containsAll(shifts[i].competences, userCompetences)
        if (ok) {
            var shift = {
              nom : shifts[i].nom, 
              shiftID: shifts[i]._id,
              _id: shifts[i]._id,
              ville : shifts[i].ville, 
              jours : shifts[i].jours,
              remarques : shifts[i].remarques,
              debut :shifts[i].debut,
              fin: shifts[i].fin
            }
            capableShifts.push(shift)
        };
    };
    return capableShifts;
  }
  /*
    returns an array of shifts that have the same city as those
    specified in the dispo. @shifts already are sorted by dispo's time range
    Called in setShift()
  */
  $scope.compareDispoCityAndShift = function(shifts, dispo){
    var dispo_city_shifts = [];
    for (var i = 0; i < shifts.length; i++) {
      var shiftCity = shifts[i].ville;
        //get dispo cities
        for (var h = 0; h < dispo.villes.length; h++) {
          //compare them
          if( shiftCity.toLowerCase() == dispo.villes[h].toLowerCase() ){
            dispo_city_shifts.push(shifts[i])
          }
        };
    
    };
    return dispo_city_shifts;
  }
  /*
    returns true if the dispo hours are between the beginning and end of the shift hours.
    Hours are in minutes.
  */
  $scope.isDispoBetweenShiftHours = function(dispoStart, dispoEnd, shiftStart, shiftEnd){
   // console.log("dispo start "+ dispoStart, "dispo end "+ dispoEnd, "shift start "+shiftStart, "shiftend "+shiftEnd);
    if (parseInt(dispoStart) <= parseInt(shiftStart)
      && parseInt(dispoEnd) >= parseInt(shiftEnd)) {
         return true;
    }
  }

  /*
    returns array of shifts that can be done within dispoHours time range
  */
  $scope.compareDiposHoursAndShift = function(dispoHours, dailyShifts){
     var shifts = [];
     //convert date hours to minutes  => easier to compare
     var dispoStart = moment.duration(dispoHours.start).asMinutes()
     var dispoEnd = moment.duration(dispoHours.end).asMinutes()
      for (var i = 0; i < dailyShifts.length; i++) {
        var shift = dailyShifts[i];
        var shiftStart = moment.duration(moment(shift.debut).format("H:mm")).asMinutes();
        var shiftEnd = moment.duration(moment(shift.fin).format("H:mm")).asMinutes();
        var isBetween = $scope.isDispoBetweenShiftHours(dispoStart, dispoEnd, shiftStart, shiftEnd)
       // console.debug(isBetween, shift.nom, moment(shift.debut).format("H:mm"), moment(shift.fin).format("H:mm"));
         if (isBetween) {
            shifts.push(shift);
          };     
      };
      return shifts;
  }

  /*
    get formatted start and end hours and day of a dispo (presence)
  */
  $scope.getDispoHoursAndDay = function(presence){
      var data = {
        start : moment(presence.start).format("H:mm"),
        end : moment(presence.end).format("H:mm"),
        day : new Date(presence.start).getDay()
      }
      return data;
   }
   /*
    highlights the coursiers who work today
   */
  $scope.todaysCoursiers = function(){
    var today = moment(new Date()).format("D-M-YYYY")
    $(".colDaySelected, .rowDaySelected").removeClass("colDaySelected rowDaySelected")
    $(".attributedShift").each(function() {
      if( $(this).parent().attr('date') == today ){
         $(this).parent().closest('tr').addClass('rowDaySelected')
      } 
    });
  }
   /*
     highlights the coursiers that work on the given day
   */
  $scope.whoWorksOn = function(day, month, year){
    $(".colDaySelected, .rowDaySelected").removeClass("colDaySelected rowDaySelected")
    var date = new Date(year, month, day)
    var dateCol = moment(new Date(year, month-1, day) ).format("D-M-YYYY")
    var workingDay = moment(date).format("D-M-YYYY");
    $(".attributedShift").each(function() {
      if( $(this).parent().attr('date') == workingDay ){
        $("col[date="+dateCol+"]").addClass('colDaySelected');
         $(this).parent().closest('tr').addClass('rowDaySelected')
      } 
    });
  }
  /*
    load all coursiers.
    Callback : load absences and dispos of coursiers
  */
  $scope.loadCoursiers = function(){
    $http.get("/api/users").success(function(coursiers){    
          $scope.coursiers = coursiers;
          $scope.loadAbsencesAndDispos($scope.coursiers, new Date())
    })
  }
  //load shifts and coursiers
  shiftService.getShifts(function(shifts){
    $scope.shifts = shifts;
    $scope.loadCoursiers();
  });

   //update view on attribution passed !!!!! -> in coursierDay directive
  $scope.$on('attribution', function(event, args) {
       if (!$scope.attributions[0].monthYear[args.monthYear]) {
          $scope.attributions[0].monthYear[args.monthYear] = {}
       };
       if(!$scope.attributions[0].monthYear[args.monthYear][args.day]){
         $scope.attributions[0].monthYear[args.monthYear][args.day] = {}
         $scope.attributions[0].monthYear[args.monthYear][args.day].shifts = []
       }
       var shifts = [args.shift]
       $scope.attributions[0].monthYear[$scope.monthYear][args.day].shifts.push.apply(  $scope.attributions[0].monthYear[$scope.monthYear][args.day].shifts, shifts)
       $scope.$broadcast('attrPassed', {attributions: $scope.attributions[0].monthYear ,monthYear : args.monthYear})
       
  });

  $scope.$on("deletitionShift", function(event,args){
    var shifts = $scope.attributions[0].monthYear[args.monthYear][args.day].shifts
    for (var i = shifts.length - 1; i >= 0; i--) {
       if (shifts[i].coursierAttributed._id  == args.coursier._id) {
        if (shifts[i]._id == args.shift._id) {
          shifts.splice(i,1)
        };
      }; 
    };
    $scope.attributions[0].monthYear[args.monthYear][args.day].shifts = shifts
    $scope.$broadcast("delPassed", {day:args.day, monthYear: args.monthYear, shifts : $scope.attributions[0].monthYear[args.monthYear][args.day].shifts})
  })
  /*
    load absences and dispos of every coursier 
    into absences[] and presences[] 
    Sort into objects with daily attributes
  */
  $scope.loadAbsencesAndDispos = function(coursiers, date){
    //if date ==  only the month
    if (typeof date == 'string' || typeof date =="number") {
      var newDateString = 1+"-"+(parseInt(date)+1)+"-"+$scope.year;
      var newDate = moment(newDateString, "DD-MM-YYYY")
      var moisAnnee = moment(newDate).format("MM-YYYY")
      $scope.monthNum = moment(newDate).month();
    }else{
      var moisAnnee = moment(date).format("MM-YYYY")
      $scope.monthNum = moment(date).month()
    }
    var disponibilites  = {}
    var lesPresences = {}
    for (var i = 0; i < coursiers.length; i++) {
       if (coursiers[i].dispos) {
        var coursierId = coursiers[i]._id;
       //get the months
       for(var month in coursiers[i].dispos){
          if (month == moisAnnee) {
           var month = coursiers[i].dispos[month]
          //get the weeks
           for(var week in month){
              var day = month[week].dispos;
              //get days with absence or presence
              if (day) {
                   for (var j = 0; j < day.length; j++) {
                var dayNo = moment(day[j].start).format("D")
                if (!disponibilites[dayNo]) {
                  disponibilites[dayNo] = []
                }
                if (!lesPresences[dayNo]) {
                   lesPresences[dayNo] = []
                };
                day[j].coursierId = coursierId
                if (day[j].title == "Dispo") {
                  lesPresences[dayNo].push(day[j])
                }
                disponibilites[dayNo].push(day[j])
              }//end get days 
              };
                 
           }
        };//end get months
      };//var month in coursiers[i].dispos

      }
    };//end for
    $scope.lesPresences = lesPresences
    $scope.disponibilites = disponibilites
    //now we have all the dispos and absences - we can load the calendar
    $scope.renderCalendar($scope.monthNum, $scope.year)
  }

  /*
    get day name for each day of month
  */
  function getDaysArray(year, month) {
        var date = new Date(year, month, 1);
        var result = [];
        while (date.getMonth() == month) {
          result.push(days[date.getDay()]);
          date.setDate(date.getDate()+1);
        }
        return result;
  }
  //toggle planning between all coursiers and monthly personnal view
  $scope.togglePlanning = function(){
    if ($scope.showAllPlanning == true) {
        $scope.showAllPlanning = false
    }else{ 
        $scope.showAllPlanning = true
    }
    $('#fullCal').fullCalendar('removeEventSource')
    $('#fullCal').fullCalendar('removeEvents');
    $('#fullCal').fullCalendar('addEventSource',$scope.formatedShifts);
  }

  $scope.isToday= function(day, month, year){
    var date = new Date(year, month, day)
    var day = moment(date).format("D-M-YYYY")
    if (day == $scope.today) {
      return 'today';
    };
  }

  $scope.toggleIsPresent = function(){
      if ($(".present").length > 0) {
        $(".present").removeClass("present").addClass("presentOff");
        $scope.dispoOn = false
      }else{
        $(".presentOff").removeClass("presentOff").addClass("present");
         $scope.dispoOn = true
      }
  }
  $scope.toggleNoInfo = function(){
      if ($(".noInfo").length > 0) {
        $(".noInfo").removeClass("noInfo").addClass("noInfoOff");
        $scope.noInfoOn = false
      }else{
        $(".noInfoOff").removeClass("noInfoOff").addClass("noInfo");
         $scope.noInfoOn = true
      }
  }

  // on click on td "manques" -> show who is NOT present in a @city
  $scope.toggleCityDispos = function (city) {

     if( $.inArray(city, $scope.toggleCities) == -1){
      $scope.toggleCities.push(city)
     }else{
      $scope.toggleCities.splice($.inArray(city, $scope.toggleCities), 1)
     }
     var citiesLeft = []
     for (var i = $scope.cities.length - 1; i >= 0; i--) {
        if($.inArray($scope.cities[i], $scope.toggleCities) == -1 ){
          citiesLeft.push($scope.cities[i])
        }
     };
     for (var i = $scope.toggleCities.length - 1; i >= 0; i--) {
        $(".manques"+$scope.toggleCities[i]).addClass('notDispo'+$scope.toggleCities[i]) 

        $("td.coursierDay:not(."+$scope.toggleCities[i]+"):not(.noInfo):not(.noInfoOff):not(.absent)")
                              .addClass("city-bg-on notDispo"+$scope.toggleCities[i])
     };
     for (var i = citiesLeft.length - 1; i >= 0; i--) {
       $(".manques"+citiesLeft[i]).removeClass('notDispo'+citiesLeft[i])
                                  .addClass('city-bg-off')

       $("td.coursierDay.notDispo"+citiesLeft[i]).removeClass("notDispo"+citiesLeft[i])
     
     };
  }


  $scope.returnAttributions = function(monthYear){
    if ($scope.attributions.length != 0) {
        return $scope.attributions[0].monthYear[monthYear]
      };
  }
  $scope.toggleShiftsLevel = function(toggleAll,event){
    if (toggleAll) {
     $("td.lowDispo").addClass('lowDispoOff').removeClass('lowDispo') 
     $("td.mediumDispo").addClass('mediumDispoOff') .removeClass('mediumDispo')  
     $("td.highDispo").addClass('highDispoOff') .removeClass('highDispo')  
     $("td.busy").addClass('busyOff').removeClass('busy');
  
     $scope.toggleAll = false;    
   }else if (!toggleAll){
      $("td.lowDispoOff").addClass('lowDispo').removeClass('lowDispoOff') 
     $("td.mediumDispoOff").addClass('mediumDispo') .removeClass('mediumDispoOff')  
     $("td.highDispoOff").addClass('highDispo') .removeClass('highDispoOff')  
     $("td.busyOff").addClass('busy').removeClass('busyOff');
     $scope.toggleAll = true;
   }  
  }
  //====================== TODO - DISPO LEVEL BY CITY =======================
  // $scope.toggleBusy = function(){
  //    if($(".busyOff").length > 0 ) {
  //      $(".busyOff").removeClass('busyOff').addClass('busy')
  //    }else{
  //       $(".busy").removeClass('busy').addClass('busyOff')
  //    }
  // }
  // $scope.toggleLowDispo = function(){
  //   if($(".lowDispoOff").length > 0 ) {
  //       $(".lowDispoOff").removeClass('lowDispoOff').addClass('lowDispo')
  //    }else{
  //       $(".lowDispo").removeClass('lowDispo').addClass('lowDispoOff')
  //    }
  // }
  // $scope.toggleMediumDispo = function(){
  //     if($(".mediumDispoOff").length > 0 ) {
  //       $(".mediumDispoOff").removeClass('mediumDispoOff').addClass('mediumDispo')
  //    }else{
  //       $(".mediumDispo").removeClass('mediumDispo').addClass('mediumDispoOff')
  //    }
  // }
  // $scope.toggleHighDispo = function(){
  //    if($(".highDispoOff").length > 0 ) {
  //       $(".highDispoOff").removeClass('highDispoOff').addClass('highDispo')
  //    }else{
  //       $(".highDispo").removeClass('highDispo').addClass('highDispoOff')
  //    }
  // }
  // $scope.toggleDispoLevelCity = function(city, level){
  //   //there is a space at the end...
  //     var city = city.substring(0, city.length - 1);
  //    if (level == 'lowDispo') {
  //      if ($(".lowDispoOff").length >0) {
  //        $("td."+city+"."+level+"Off").addClass('dispoLevelCityLow').removeClass(level+"Off")
  //      }else{
  //       $("td."+city+"."+level).addClass('dispoLevelCityLow').removeClass(level+"Off")
  //      }
  //    }
  //    else if(level =='mediumDispo'){
  //      $("td."+city+"."+level+"Off").addClass('dispoLevelCityMedium').removeClass(level+"Off")

  //    }
  //    else if(level =='highDispo'){
  //      $("td."+city+"."+level+"Off").addClass('dispoLevelCityHigh').removeClass(level+"Off")
  //     }
  // }
//===========================================================================
  /* 
    checks if the date given has been 
    defined as dispo of the coursier (userId);
    if it is, returns the dispo infos  
  */
  $scope.checkDispo = function(day, month,year, userId){
    if (typeof $scope.disponibilites != 'undefined') {
      var theDay = moment(new Date(year, month, day)).format("D");
      var theYear = moment(new Date(year, month, day)).format("YYYY");
      var dispos = $scope.disponibilites// created in loadAbsencesAndDispos
      for(var day in dispos){
          if (day == theDay) {
            for(var dispo in dispos[day]){
               if (dispos[day][dispo].coursierId == userId) {
                 var currDispo = dispos[day][dispo]
                 if (theYear == moment(currDispo).format("YYYY")) {//get for the current year only
                    if(typeof dispos[day][dispo].villes != undefined) {
                     var villes = currDispo.villes
                    }else{
                      var villes = [];
                    }
                  var theDispo = {type: currDispo.title, villes: villes, start : currDispo.start, end: currDispo.end};
                 };
               };
            }
          };
      }
      return theDispo ;
    };
  }
  var show = true;
  $scope.showHiddenShifts = function(){
    if (show) {
       $(".shiftHidden").css('display','block')
       show = false
    }else{
      $(".shiftHidden").css('display','none')
      show = true
    }
  }
  //on moushewheel down
  $scope.up = function(){
    if ($scope.limitTo >= $scope.coursiers.length) {
      return
    }else{
       $scope.limitFrom++
        $scope.limitTo++
    }
  }
  //on moushewheel up
  $scope.down = function(){
    if ($scope.limitFrom <= 0) {
      return
    }else{
        $scope.limitFrom--
        $scope.limitTo--

    };
  }
  //on change the ng-model= number input
  $scope.limitCoursiers = function(number){
    var max = $scope.coursiers.length
    var limitTo = $scope.limitTo
      if ($scope.preselectedShift) {
      setTimeout(function(){
        var day = moment($scope.preselectedDate,"D-M-YYYY").format("D")
        var month = moment($scope.preselectedDate,"D-M-YYYY").format("M")
        var year = moment($scope.preselectedDate,"D-M-YYYY").format("YYYY")
        $scope.showPotentialCoursiers(day,(month-1),year,$scope.preselectedShift, $scope.preselectedEvent)
      },100) 
    }
    if (number =="tous") {
      $scope.limitFrom = 0 
      $scope.limitTo = max
      return
    }else{

      if (number >= max) {
        $scope.limitTo = max
      }else{
        $scope.limitTo = $scope.limitFrom+number
      }
      if ($scope.limitFrom <= 0) {
        $scope.limitFrom = 0
      }
       };
  }
  }])
  .filter('limitFromTo', function(){
    return function (input, left, right) {
        if(input === undefined || left === undefined) return input;
        if(right === undefined){
            right = left;
            left =  0;
        }
        return input.slice(left,right);//string and array all have this method
    };
 })  
//  .directive('manquesCitys', function(){
//       return {
//         scope: {
//           day : "=",
//           dayOfWeek : "=",
//           monthNum : "=",
//           year : "=",
//           dailyShifts : "=",
//           city : "=",
//           monthYear : "=",
//           returnAttributions: "=",
//           showPotentialCoursiers: "="
//         },
//         link: function  (scope, elem, attrs) {
//            elem.addClass('manquesCell');
//            scope.attributions = scope.returnAttributions(scope.monthYear)
         
//           /*
//             checks if shift has already been attributed and how many times
//             => manques par ville + nb de fois
//             Returns 'enough' if times attributed == times needed
//             Returns object with name and left attributions needed, if not.
//           */
//           scope.isAttributedShift = function (shift, day, month, year, attributions) {
//               var day = moment(new Date(parseInt(year), parseInt(month), parseInt(day+1) ) ).format("D");
//                   //get the day
//                   for(var daDay in attributions){
//                     if (daDay == day) {
//                       var dayShifts = attributions[day].shifts
//                       //for every shift attributed, if its the same as 
//                       //in the daily shift list, count how many times, if times >0 retun true
//                       var times = 0;
//                       for (var i = dayShifts.length - 1; i >= 0; i--) {
//                         if (dayShifts[i].shiftID == shift._id ||  dayShifts[i]._id == shift._id) {
//                           times++;     
//                         }
//                       };
//                     }
//                   }       
//                 //if it has been attributed at least one time
//                 if (times > 0) {
//                   //attributed the needed times
//                   if (times == shift.times || times > shift.times) {
//                      var daShift = {_id: shift._id, nom: shift.nom, enough: true, ville : shift.ville, timesLeft : 0,competences:shift.competences, fin: shift.fin, debut: shift.debut}
//                    //attributed less than needed
//                   }else{
//                     var daShift = {_id: shift._id, nom: shift.nom, enough: false, timesLeft : parseInt(shift.times-times), ville : shift.ville, competences:shift.competences,fin: shift.fin, debut: shift.debut}
//                   } 
//                 //there is no attribution -> so manques
//                 }else{
//                   var daShift = { _id: shift._id, nom: shift.nom, enough: false, timesLeft : parseInt(shift.times), ville : shift.ville, competences: shift.competences, fin: shift.fin, debut: shift.debut}  
//                 } 
//                 return daShift;
//           }


//           scope.checkShifts = function(dayOfWeek, day, month, year, attributions){
//             var date = new Date(parseInt(year), month, day+1)
//             var dayOfWeek = date.getDay();
//             scope.shifts =  scope.dailyShifts[dayOfWeek-1]
//             scope.checkedShifts = []
//             if (scope.shifts) {
//                  $.each(scope.shifts, function(i, shift){
//                   var shift = scope.isAttributedShift(shift, scope.day, month, year, attributions) 
//                     scope.checkedShifts.push(shift)
//                   });
//             }; 
            
//           }
//           //update view on attribution passed !!!!!!!!!!!!!
//            scope.$on("attrPassed", function(e, args){
//             var date = new Date(parseInt(scope.year), scope.monthNum, scope.day+1)
//             var dayOfWeek = date.getDay();
//             scope.attributions = args.attributions[args.monthYear]
//             scope.checkShifts(dayOfWeek, scope.day,  scope.monthNum, scope.year, scope.attributions)
//            })
//           //update on deletition
//           scope.$on("delPassed",function(e, args){
//             var date = new Date(parseInt(scope.year), scope.monthNum, scope.day+1)
//             var dayOfWeek = date.getDay();
//             scope.attributions[args.day].shifts = args.shifts
//             scope.checkShifts(dayOfWeek, scope.day,  scope.monthNum, scope.year, scope.attributions)
//            })
//           //WATCH MONTH and re render changes
//            scope.$watch("monthNum",function(newMonth,oldValue) {
//               var date = new Date(parseInt(scope.year), newMonth, scope.day+1)
//               var dayOfWeek = date.getDay();
//               scope.attributions = scope.returnAttributions(scope.monthYear)
//                scope.checkShifts(dayOfWeek, scope.day, newMonth, scope.year, scope.attributions)
        
//             });
//            //WATCH YEARand re render changes
//            scope.$watch("year",function(newYear,oldValue) {
//               var date = new Date(parseInt(newYear), scope.monthNum, scope.day+1)
//               var dayOfWeek = date.getDay();
//               scope.attributions = scope.returnAttributions(scope.monthYear)
//                scope.checkShifts(dayOfWeek,scope.day, scope.monthNum, newYear,scope.attributions)
//             });
//         },       
//       template: '<p ng-repeat="daShift in checkedShifts" ng-click ="showPotentialCoursiers(day+1, monthNum, year, daShift, $event)" ng-class="daShift.enough !=true ? \'bg-danger\' : \'shiftHidden\' " ' 
//      + '  class="shiftsByCity"> '
//      +' {{daShift.ville == city ? (daShift.enough === true ? daShift.nom : daShift.nom+"("+daShift.timesLeft+")") : null}}</p>  '
//     }
//   })
//   .directive('coursierDays', function() {
//       return{
//         scope : {
//           year : "=",
//           day : "=",
//           setShift : "=",
//           monthNum : "=",
//           returnAttributions: "=",
//           checkDispo : "=",
//           user: "=",
//           monthYear : "="
//         },
//         link : function  (scope, elem, attrs) {
//           elem.addClass('coursierDay')

//           scope.addDispoChange = function (newMonth, newYear) {
//             elem.attr("date", (scope.day)+"-"+(newMonth+1)+"-"+newYear )  
//             var dispo = scope.checkDispo(scope.day, newMonth, newYear, scope.user._id) 
//              elem.removeClass("presentOff present absent city-bg-off city-bg-on noInfo noInfoOff Lausanne Yverdon Neuchâtel")
//                 if(dispo){
//                   if (dispo.type =="Dispo") {
//                      elem.addClass("presentOff")
//                     if (dispo.villes) {
//                       scope.from = moment(dispo.start).format("H:mm")
//                       scope.to = moment(dispo.end).format("H:mm")
//                       scope.cities =  dispo.villes.join(", ");
//                       $.each(dispo.villes, function  (i, ville) {
//                          elem.addClass(ville)
//                          elem.addClass("city-bg-off")
//                       })
//                     }
//                   }else{
//                      elem.addClass("absent")
//                      $(".absent").removeClass('highDispo mediumDispo lowDispo busy')
//                     }
//                 }else{
//                    elem.addClass("noInfoOff")
//                 }
//           }

//           scope.getAttrShifts = function (attributions, monthYear){
//              scope.daShifts = []
//              if (attributions) {
//                  if (attributions[scope.day]) {           
//                   var daShifts = []
//                   $.each(attributions[scope.day].shifts, function(i, shift){
//                      if (shift.coursierAttributed._id  == scope.user._id) {
//                           if (shift.title == 'Absent') {
//                             elem.addClass("absent")
//                           }else{
//                              daShifts.push(shift);  
//                           }
//                       }
//                     })
//                     scope.daShifts = daShifts;        
//                 }
//               };  
//           }
//           /*
//             checks if the number of shifts/week has been exceeded
//           */
//           scope.checkShiftsPerWeek = function(dayOfWeek, day, month, year){
//               var date = new Date(year, month, day)
//               var monthYear = moment(date).format("MM-YYYY");
//               var startWeek = moment(date).startOf('week')._d
//               var endWeek = moment(date).endOf('week')._d
//               var day = moment(date).format("D");
//               elem.removeAttr('shiftsAttributed shiftsLeft shiftsWanted coursierId coursierName')
//               for(var month in scope.user.dispos){
//                 if (monthYear == month) {
//                   for(var week in scope.user.dispos[month]){
//                      var aDay = scope.user.dispos[month][week].dispos[0].start;
//                      var startWeekDay = moment(aDay).startOf('week')._d
//                     //if its during the week you clicked, get the weekly shifts of that week
//                     if (moment(startWeekDay).isSame(startWeek)) {
//                       var shiftsPerWeek = scope.user.dispos[month][week].shiftsWeek;
//                       scope.remarques = scope.user.dispos[month][week].remarques;
//                       var attributed = scope.getNumberOfAttributedShiftsWeek(scope.user._id, monthYear, startWeek, endWeek)
//                       scope.setDispoBGInfo(startWeek, endWeek, shiftsPerWeek, attributed,moment(date)._d)
//                     };
//                   }
//                 };
//               }
//           }
//           /*
//             thanks to te gb color, tell the user how many shifts approx. are left for attribution
//             or if it has already been exceeded
//           */
//           scope.setDispoBGInfo = function(startWeek, endWeek, wantedShifts, attributedShifts, date){
//             if (moment(startWeek).isBefore(date) || moment(startWeek).isSame(date) ) {
//               if (moment(date).isBefore(endWeek) || moment(date).isSame(endWeek)) {
//                 //set bg from mon till saturday
//                 if (date.getDay()  < 7 &&  date.getDay() >0) {  
//                   if (!elem.hasClass("absent")) {
//                     var shiftsLeft = (wantedShifts-attributedShifts)
//                       if (attributedShifts>wantedShifts || attributedShifts == wantedShifts) {
//                         elem.addClass("busyOff")
//                       }else if( shiftsLeft <= 2 ){
//                         elem.addClass("lowDispoOff")
//                       }else if(shiftsLeft >=3 && shiftsLeft <=5){
//                         elem.addClass("mediumDispoOff")
//                       }else if(shiftsLeft >=6){
//                         elem.addClass("highDispoOff")
//                       }
//                     $(".absent").removeClass('highDispo mediumDispo lowDispo busy')
//                     elem.attr('shiftsAttributed', attributedShifts)
//                     elem.attr('shiftsLeft', shiftsLeft)
//                     elem.attr('shiftsWanted', wantedShifts)
//                     elem.attr('coursierId', scope.user._id)
//                     elem.attr('coursierName', scope.user.name);
//                     //used in popover on cell
//                     scope.shiftsLeft = shiftsLeft
//                     scope.wantedShifts = wantedShifts
//                     scope.attributedShifts = attributedShifts
//                   };
                  
//                 };          
//               };
//             };
//           }
//           /*
//               gets the number of already attributed shifts to the coursier
//               for the given week. 
//           */
//           scope.getNumberOfAttributedShiftsWeek = function (coursierId, monthYear, startWeek, endWeek) {
//               var attributed = 0;
//               var startDay = parseInt(moment(startWeek).format("D"));
//               var endDay = parseInt(moment(endWeek).format("D"));
//               var startMonth = moment(startWeek).month()
//               var endMonth =  moment(endWeek).month()
//               var currentMonth =  scope.monthNum;
//               //use only days within the month and not from the previous or next !
//               if (startDay > endDay && startMonth < endMonth && endMonth == currentMonth ) {
//                 startDay = 1;
//               }
//               else if (startDay > endDay && startMonth < endMonth && startMonth == currentMonth){
//                 endDay = moment(startWeek).daysInMonth()             
//               };
//               // console.debug(startDay, endDay); 
//               for(var day in  scope.attributions){
//                 //look for shifts during that week and count        
//                 if (day >=startDay && day <=endDay ) {
//                    var shifts = scope.attributions[day].shifts;
//                    for (var i = shifts.length - 1; i >= 0; i--) {
//                      if(shifts[i].coursierAttributed._id == coursierId && !shifts[i].title){//title-> dont count the absent shift as a shift!
//                       attributed++;
//                      }
//                    };
//                 };        
//               }     
//               return attributed
//           }

//           //update view on attribution passed !!!!!!!!!!!!!
//            scope.$on("attrPassed", function(e, args){
//             //set for the first attribution
//             if (!scope.attributions) {
//               scope.attributions = {}
//             };
//             if (!scope.attributions[args.monthYear]) {
//               scope.attributions[args.monthYear] = {}
//             };
//             scope.attributions[args.monthYear]  = args.attributions[args.monthYear]
//             //scope.addDispoMonthChange(scope.monthNum);
//             scope.getAttrShifts(scope.attributions[args.monthYear], args.monthYear)
//             scope.checkShiftsPerWeek(null, scope.day, scope.monthNum, scope.year)
//            })
//            //update on deletition
//            scope.$on("delPassed",function(e, args){
//             scope.attributions[args.day].shifts = args.shifts
//            // scope.addDispoMonthChange(scope.monthNum);
//             scope.getAttrShifts(scope.attributions, scope.monthYear)
//             scope.checkShiftsPerWeek(null, scope.day, scope.monthNum, scope.year)
//            })
//           //WATCH MONTH
//            scope.$watch("monthNum",function(newMonth,oldValue) {
//                elem.removeClass('lowDispo mediumDispo highDispo lowDispoOff mediumDispoOff highDispoOff busy busyOff absent present Lausanne Yverdon Neuchâtel')
//                var date = new Date(parseInt(scope.year), newMonth, scope.day)
//                var dayOfWeek = date.getDay();
//                var monthYear = moment(1+"-"+(newMonth+1)+"-"+scope.year, "D-M-YYYY").format("MM-YYYY")
//                scope.attributions = scope.returnAttributions(monthYear)
//                scope.shiftsLeft = scope.wantedShifts = scope.daShifts =scope.cities = scope.attributedShifts = scope.remarques = scope.from = scope.to = scope.villes = null
//                scope.addDispoChange(newMonth, scope.year);
//                scope.getAttrShifts(scope.attributions, monthYear)
//                scope.checkShiftsPerWeek(dayOfWeek,scope.day,  newMonth, scope.year)
//             });
//            //WATCH YEAR
//            scope.$watch("year",function(newYear,oldValue) {
//               elem.removeClass('lowDispo mediumDispo highDispo lowDispoOff mediumDispoOff highDispoOff busy busyOff absent present Lausanne Yverdon Neuchâtel')
//               var date = new Date(parseInt(newYear), scope.monthNum, scope.day)
//               var dayOfWeek = date.getDay();
//               var monthYear = moment(1+"-"+(scope.monthNum+1)+"-"+newYear,  "D-M-YYYY").format("MM-YYYY")
//               scope.attributions = scope.returnAttributions(scope.monthYear)
//               scope.shiftsLeft = scope.wantedShifts = scope.daShifts = scope.cities = scope.attributedShifts = scope.from = scope.to =scope.remarques = scope.villes = null
//               scope.addDispoChange(scope.monthNum, newYear)
//               scope.getAttrShifts(scope.attributions, monthYear)
//               scope.checkShiftsPerWeek(dayOfWeek, scope.day, scope.monthNum, newYear)
//             });
//            scope.$watch("limitTo",function() {
//               var date = new Date(parseInt(scope.year), scope.monthNum, scope.day)
//               var dayOfWeek = date.getDay();
//               var monthYear = moment(1+"-"+(scope.monthNum+1)+"-"+scope.year,  "D-M-YYYY").format("MM-YYYY")
//               scope.attributions = scope.returnAttributions(monthYear)
//               scope.shiftsLeft = scope.wantedShifts = scope.daShifts = scope.cities = scope.attributedShifts = scope.from = scope.to =scope.remarques = scope.villes = null
//               scope.addDispoChange(scope.monthNum, scope.year)
//               scope.getAttrShifts(scope.attributions, monthYear)
//               scope.checkShiftsPerWeek(dayOfWeek, scope.day, scope.monthNum, scope.year)
//             });
//            scope.$watch("limitFrom",function() {
//               var date = new Date(parseInt(scope.year), scope.monthNum, scope.day)
//               var dayOfWeek = date.getDay();
//               var monthYear = moment(1+"-"+(scope.monthNum+1)+"-"+scope.year,  "D-M-YYYY").format("MM-YYYY")
//               scope.attributions = scope.returnAttributions(monthYear)
//               scope.shiftsLeft = scope.wantedShifts = scope.daShifts = scope.cities = scope.attributedShifts = scope.from = scope.to =scope.remarques = scope.villes = null
//               scope.addDispoChange(scope.monthNum, scope.year)
//               scope.getAttrShifts(scope.attributions, monthYear)
//               scope.checkShiftsPerWeek(dayOfWeek, scope.day, scope.monthNum, scope.year)
//             });


//         },//link
//         template:'<div class="dispoInfo"  tooltip="De {{from != null ? from : \'?\'}} à {{to != null ? to : \'?\'}} &#8232; '
//                 + ' {{cities != null ? \'Villes: \'+cities : \'?\'}} {{remarques != null ? \'--- \'+remarques : \'\' }} ---{{shiftsLeft != null ? \'Shifts restants:\'+ shiftsLeft : \'\'}}" '
//                 + 'tooltip-placement="top"  tooltip-append-to-body="true" tooltip-trigger="mouseenter" > </div>'
//                 +' <span city="{{shift.ville}}"  ng-repeat="shift in daShifts track by $index" ng-class="daShifts != null ? \'attributedShift\' : \'\'  "  '
//                 +' popover="Remarques: {{shift.remarques}} || A {{shift.ville}} de {{shift.debut | date : \'H:mm\'}} à  {{shift.fin | date : \'H:mm\'}}" '
//                 +'   popover-placement="top"  '
//                 +'  popover-trigger="mouseenter">'+
//               '{{shift.nom}}{{$last ? "" : "+"}}</span>'
//       }
//     })
//   .directive('doublonss', function  () {
//       return{
//         scope : {
//           year : "=",
//           day : "=",
//           monthNum : "=",
//           dailyShifts : "=",
//           returnAttributions: "=",
//           monthYear : "="
//         },
//         link : function  (scope, elem, attrs) {
//           scope.attributions = null;
         
//           /*
//             checks if shift has already been attributed and how many times
//             => manques par ville + nb de fois
//             In this case -> check if too much OR if its not the day that shift should be done
//           */
//           scope.isAttributedShift = function (shift, day, month, year, attributions) {
//               var date = new Date(year, month, (day+1));
//               var day = moment( date ).format("D");  
//               var dayId = date.getDay()
//               //get the day
//               for(var daDay in attributions){
//                 if (daDay == day) {
//                   var times = 0;
//                   var dayShifts = attributions[day].shifts
//                   //for every shift attributed, if its the same as 
//                   //count each attributed shift
//                   for (var i = dayShifts.length - 1; i >= 0; i--) {
//                     if (dayShifts[i].shiftID == shift._id || dayShifts[i]._id == shift._id) {
//                       times++;   
//                     }
//                   };
                  
//                 }
//               }       
//               //if it has been attributed at least one time
//               if (times > 0) {
//                   //check if its the correct day for that shift
//                   var shiftDayIds = []
//                   for(var theDay in shift.jours){
//                     shiftDayIds.push(shift.jours[theDay].id)
//                   }
//                   //if its incorrect day, show it with other bg
//                   if ($.inArray(dayId, shiftDayIds) == -1) {
//                     var daShift = {_id: shift._id, 
//                       nom: shift.nom, invalidDay: true, 
//                       ville : shift.ville, timesLeft : times,
//                       competences:shift.competences, 
//                       fin: shift.fin, debut: shift.debut
//                     }
//                      return daShift;
//                   }
//                   //else, its the good day, return how many times
//                   else{
//                     //check how many times on that day it sould be done!
//                     for(theDay in shift.jours){
//                       if (shift.jours[theDay].id == dayId) {
//                         if (times > shift.jours[theDay].times) {
//                            var daShift = {_id: shift._id, nom: shift.nom, enough: true, 
//                             ville : shift.ville, timesLeft : Math.abs(shift.times-times),
//                             competences:shift.competences, 
//                             fin: shift.fin, debut: shift.debut
//                           }
//                            return daShift;
//                         };
//                       };
//                     }


//                   }
//               }               
//           }
//           scope.checkShifts = function(day, month, year, attributions){
//             var date = new Date(parseInt(year), month, day+1)
//             var dayOfWeek = date.getDay();
//             //will be checking for all the shifts
//             scope.shifts =  scope.dailyShifts[scope.dailyShifts.length-1]
//             scope.doubleShifts = [];
//             if (scope.shifts) {
//                  $.each(scope.shifts, function(i, shift){
//                   var shift = scope.isAttributedShift(shift, scope.day, month, year, attributions) 
//                     if (shift) {                  
//                     scope.doubleShifts.push(shift)
//                   };
//                 })   
//             };          
//           }
//            //update view on attribution passed !!!!!!!!!!!!!
//            scope.$on("attrPassed", function(e, args){
//             scope.attributions = args.attributions[args.monthYear]
//             scope.checkShifts(args.day, scope.monthNum, scope.year, scope.attributions)
//            })
//           //update on deletition
//            scope.$on("delPassed",function(e, args){
//             scope.attributions[args.day].shifts = args.shifts
//             scope.checkShifts(args.day, scope.monthNum, scope.year, scope.attributions)
//            })
//           //WATCH MONTH and re render changes
//            scope.$watch("monthNum",function(newMonth,oldValue) {
//              scope.attributions = scope.returnAttributions(scope.monthYear)
//              scope.checkShifts(scope.day, newMonth, scope.year, scope.attributions)
//             });
//            //WATCH YEARand re render changes
//            scope.$watch("year",function(newYear,oldValue) {
//              scope.attributions = scope.returnAttributions(scope.monthYear)
//               scope.checkShifts(scope.day, scope.monthNum, newYear, scope.attributions)
//            });
//        }, 
//         template:'<span class="shiftsDoubles" ng-class="shift.invalidDay === true ? \'bg-warning\': \'\' " ng-repeat="shift in doubleShifts">{{shift.timesLeft>1 ? shift.nom+"("+shift.timesLeft+")" : shift.nom}}</span>'

//       }
//   })


'use strict';

angular.module('velociteScheduleApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('planningCoursier', {
        url: '/planningCoursier',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
 
  }]);
'use strict';
/*
	separation de la directive trouvee dans main.js
	Il faut la faire fonctionner, je n-y suis pas arrive.
	elle a un nom different pour ne pas faire de collision
*/
angular.module('velociteScheduleApp')
  .directive('manquesCity', function () {
    return {
         scope: {
          day : "=",
          dayOfWeek : "=",
          monthNum : "=",
          year : "=",
          dailyShifts : "=",
          city : "=",
          monthYear : "=",
          returnAttributions: "=",
          showPotentialCoursiers: "="
        },
      templateUrl: 'app/manquesDirective/manques.html',
        link: function  (scope, elem, attrs) {
           elem.addClass('manquesCell');
           scope.attributions = scope.returnAttributions(scope.monthYear)
         
          /*
            checks if shift has already been attributed and how many times
            => manques par ville + nb de fois
            Returns 'enough' if times attributed == times needed
            Returns object with name and left attributions needed, if not.
          */
          scope.isAttributedShift = function (shift, day, month, year, attributions) {
              var day = moment(new Date(parseInt(year), parseInt(month), parseInt(day+1) ) ).format("D");
                  //get the day
                  for(var daDay in attributions){
                    if (daDay == day) {
                      var dayShifts = attributions[day].shifts
                      //for every shift attributed, if its the same as 
                      //in the daily shift list, count how many times, if times >0 retun true
                      var times = 0;
                      for (var i = dayShifts.length - 1; i >= 0; i--) {
                        if (dayShifts[i].shiftID == shift._id ||  dayShifts[i]._id == shift._id) {
                          times++;     
                        }
                      };
                    }
                  }       
                //if it has been attributed at least one time
                if (times > 0) {
                  //attributed the needed times
                  if (times == shift.times || times > shift.times) {
                    
                     var daShift = {_id: shift._id, nom: shift.nom, enough: true, ville : shift.ville, timesLeft : 0,competences:shift.competences, fin: shift.fin, debut: shift.debut}
                   //attributed less than needed
                  }else{
                    var daShift = {_id: shift._id, nom: shift.nom, enough: false, timesLeft : parseInt(shift.times-times), ville : shift.ville, competences:shift.competences,fin: shift.fin, debut: shift.debut}
                  } 
                //there is no attribution -> so manques
                }else{
                  var daShift = { _id: shift._id, nom: shift.nom, enough: false, timesLeft : parseInt(shift.times), ville : shift.ville, competences: shift.competences, fin: shift.fin, debut: shift.debut}  
                } 
                return daShift;
          }


          scope.checkShifts = function(dayOfWeek, day, month, year, attributions){
            var date = new Date(parseInt(year), month, day+1)
            var dayOfWeek = date.getDay();
            scope.shifts =  scope.dailyShifts[dayOfWeek-1]
            scope.checkedShifts = []
            if (scope.shifts) {
                 $.each(scope.shifts, function(i, shift){
                  var shift = scope.isAttributedShift(shift, scope.day, month, year, attributions) 
                    scope.checkedShifts.push(shift)
                  });
            }; 
            
          }
          //update view on attribution passed !!!!!!!!!!!!!
           scope.$on("attrPassed", function(e, args){
            var date = new Date(parseInt(scope.year), scope.monthNum, scope.day+1)
            var dayOfWeek = date.getDay();
            scope.attributions = args.attributions[args.monthYear]
            scope.checkShifts(dayOfWeek, scope.day,  scope.monthNum, scope.year, scope.attributions)
           })
          //update on deletition
          scope.$on("delPassed",function(e, args){
            var date = new Date(parseInt(scope.year), scope.monthNum, scope.day+1)
            var dayOfWeek = date.getDay();
            scope.attributions[args.day].shifts = args.shifts
            scope.checkShifts(dayOfWeek, scope.day,  scope.monthNum, scope.year, scope.attributions)
           })
          //WATCH MONTH and re render changes
           scope.$watch("monthNum",function(newMonth,oldValue) {
              var date = new Date(parseInt(scope.year), newMonth, scope.day+1)
              var dayOfWeek = date.getDay();
              scope.attributions = scope.returnAttributions(scope.monthYear)
               scope.checkShifts(dayOfWeek, scope.day, newMonth, scope.year, scope.attributions)
        
            });
           //WATCH YEARand re render changes
           scope.$watch("year",function(newYear,oldValue) {
              var date = new Date(parseInt(newYear), scope.monthNum, scope.day+1)
              var dayOfWeek = date.getDay();
              scope.attributions = scope.returnAttributions(scope.monthYear)
               scope.checkShifts(dayOfWeek,scope.day, scope.monthNum, newYear,scope.attributions)
            });
        },
    //        template: '<p ng-repeat="daShift in checkedShifts" ng-click ="showPotentialCoursiers(day+1, monthNum, year, daShift, $event)" ' 
  //    + '  class="shiftsByCity"  ng-class="daShift.enough !=true ? \'bg-danger\' : \'shiftHidden\' " > '
  //    +' {{daShift.ville == city ? ( daShift.timesLeft <= 1 ? daShift.nom : daShift.nom+"("+daShift.timesLeft+")"    )  : null }}</p>  '
  //   }     
  
    };
  });
'use strict';

angular.module('velociteScheduleApp')
  .controller('MonthYearCtrl', ["$scope", "$http", "calendarService", function ($scope, $http,calendarService) {
    $scope.months = calendarService.getMonths();
    var date = new Date()
    $scope.years = [2014, 2015, 2016, 2017,2018]
    $scope.currentMonth = date.getMonth()
    $scope.currentYear = date.getFullYear()
    $scope.year = $scope.currentYear
    $scope.monthYears = {}

    $scope.isAnterior =function(monthYear){
    	var monthDate = moment(monthYear.name, "MM-YYYY")
    	var currMonthDate = moment(date)
    	if ( moment(currMonthDate).isBefore(monthDate) || moment(currMonthDate).isSame(monthDate,"month") ) {
    		return false
    	}else{
    		return true;
    	}
    } 

  
    $scope.openMonth = function (month){
    	$http({
            method: 'PUT',
            url: "/api/monthYears/"+month._id+"/open",
            data: {
              active : true
            }
          })
    	for (var i = $scope.monthYears.length -1; i >= 0; i--) {

    		if($scope.monthYears[i]._id == month._id){
    			$scope.monthYears[i].active = true;
    			return
    		}
    	};
    }
    $scope.closeMonth = function (month){
    	$http({
            method: 'PUT',
            url: "/api/monthYears/"+month._id+"/close",
            data: {
              active : false
            }
          })
    	for (var i = $scope.monthYears.length - 1; i >= 0; i--) {
    		if($scope.monthYears[i]._id == month._id){
    			$scope.monthYears[i].active = false;
    			return
    		}
    	};
    }


    $scope.initMonthYears = function(year){
    	for (var i = 0; i < $scope.months.length ; i++) {
    		var monthYear = moment(new Date(year, i, 1)).format("MM-YYYY")
    		$http({
            method: 'POST',
            url: "/api/monthYears",
            data: {
            	year : year,
            	active : false,
            	monthNum : i,
            	monthName : $scope.months[i],
            	name : monthYear
            }
          }).success(function(data, status){    
             console.log(data);
             console.log(status);
          }).error(function(err){
            console.log(err);
          }) 
    	};
    	$scope.getMonthYears(year)
   	}
   	$scope.getMonthYears = function(year){
       $http.get("api/monthYears/year/"+year).success(function(monthYears, status) {
			if (monthYears.length == 0) {
				$scope.initMonthYears($scope.year)
			}else{
				$scope.monthYears = monthYears
			}
    	}).error(function(err){
    		console.debug(err);
    	})
     }
     $scope.getMonthYears($scope.currentYear)



    	

}])

'use strict';

angular.module('velociteScheduleApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('monthYear', {
        url: '/monthYear',
        templateUrl: 'app/monthYear/monthYear.html',
        controller: 'MonthYearCtrl'
      });
  }]);
  'use strict';

  angular.module('velociteScheduleApp')
    .controller('SendDisposCtrl', ["$scope", "$http", "$modal", "calendarService", "Auth", "shiftService", function ($scope, $http,$modal,calendarService, Auth, shiftService) {

    //var $doc = angular.element(document);
    var index = 0; //for event delete
    //checkbox default  checked
    $scope.laus_check = false;
    $scope.yv_check = false;
    $scope.cities =  shiftService.getCities()
    $scope.neuch_check = false;
    $scope.isBefore  =  false;
    $scope.months = calendarService.getMonths();
    $scope.monthYear;
    var monthYear = moment(new Date()).format("MM-YYYY")
    $scope.dispos = {};
    $scope.villes = [];
    $scope.forgotCity = false;
    $scope.drag = false
    $scope.loaded = false;
    $scope.forgotShiftsWeek = false
    $scope.weekDispos =  []; // everyday dispo per week
    $scope.eventSources = [$scope.weekDispos];
    $scope.dispoType  = true; // true = disponible, false = absent
    $scope.forgotRemarques = true;
    $scope.user = Auth.getCurrentUser();
    $scope.alreadySeen = []
    var date = new Date()
    var year = date.getFullYear()

    //get months for this and next year
    $http.get("api/monthYears/year/"+year).success(function(monthYears){
      $scope.monthYears = monthYears
        $http.get("api/monthYears/year/"+(year+1)).success(function(monthYears2){
             $scope.monthYears = $scope.monthYears.concat(monthYears2)
        })
    })

    /* config calendar */
    $scope.calendarConfig = {    
      calendarDispos:{
        height: 660,
        firstDay: 1, //monday
        lang : 'fr',
        selectable:true, //time range
        editable: false,
        timezone: 'local',
        minTime: "06:00:00", 
       	maxTime: "21:00:00",
       // events: $scope.myDispos,
        header:{
          left: 'agendaWeek',
          center: 'title',
          right: 'today prev,next'
        },
        defaultView: 'agendaWeek',
       //get visible weekly date range, ex 15-21 june 2015
       viewRender: function(view, element) {
            var weekStart = view.start.date();
            var weekEnd = view.end.date();
            var monthStart = view.start._d.getMonth();
            var monthEnd = view.end._d.getMonth();
            var monthYearStart = moment(view.start._d).format("MM-YYYY");
            var monthYearEnd = moment(view.end._d).format("MM-YYYY");

            //init name of the displayed month
            //useful for displaying month names in veryfiDispos.html
            // for example 28 juin - 2 juillet
            if (monthEnd == monthStart) {
               $scope.week = weekStart+" - "+weekEnd+" "+$scope.months[monthStart]
            }else{
               $scope.week = weekStart+" "+$scope.months[monthStart]+" - "+weekEnd+" "+$scope.months[monthEnd]
            }
            $scope.monthYear = monthYearStart
            $scope.monthYearStart = monthYearStart
            $scope.monthYearEnd = moment(view.end).format("MM-YYYY")
            $scope.viewStart = view.start
            $scope.viewEnd = view.end
            $scope.loadDispos($scope.week, monthYearStart, monthYearEnd ) 

            if ($scope.dispos[$scope.monthYear]) {
               if ($scope.dispos[$scope.monthYear][$scope.week]) {
                if ($scope.dispos[$scope.monthYear][$scope.week].dispos.length == 0) {
                  $scope.forgotShiftsWeek = true
                  $scope.forgotRemarques = true
                };
                if ($scope.dispos[$scope.monthYearEnd][$scope.week]) {
                  if ($scope.dispos[$scope.monthYearEnd][$scope.week].dispos.length == 0) {
                    delete $scope.dispos[$scope.monthYearEnd][$scope.week]
                    $scope.forgotShiftsWeek = true
                    $scope.forgotRemarques = true
                  };
                };
                if ($scope.dispos[monthYearStart][$scope.week].remarques) {
                  $scope.forgotRemarques = false
                };
                if ($scope.dispos[monthYearStart][$scope.week].shiftsWeek) {
                    $scope.forgotShiftsWeek = false
                };
              };
            };
            //different rules if the week starts in different month that it ends
            if (monthYearStart != monthYearEnd) {
              //f there is only the ending month, you should see the shiftsWeek and remarques in both cases
              if ($scope.dispos[monthYearEnd] && !$scope.dispos[monthYearStart]) {
                $scope.dispos[monthYearStart] = {}
                $scope.dispos[monthYearStart][$scope.week] = {}
                if ($scope.dispos[monthYearEnd][$scope.week].shiftsWeek) {
                  $scope.dispos[monthYearStart][$scope.week].shiftsWeek = $scope.dispos[monthYearEnd][$scope.week].shiftsWeek
                  $scope.forgotShiftsWeek = false
                };
                if ($scope.dispos[monthYearEnd][$scope.week].remarques) {
                   $scope.dispos[monthYearStart][$scope.week].remarques =   $scope.dispos[monthYearEnd][$scope.week].remarques
                   $scope.forgotRemarques = false; 
                };
              //if there is the ending month and starting month but nothing in the same week...
              }else if($scope.dispos[monthYearEnd] && !$scope.dispos[monthYearStart][$scope.week] ){
                $scope.dispos[monthYearStart][$scope.week] = {}
                 if ($scope.dispos[monthYearEnd][$scope.week].shiftsWeek) {
                  $scope.dispos[monthYearStart][$scope.week].shiftsWeek = $scope.dispos[monthYearEnd][$scope.week].shiftsWeek
                  $scope.forgotShiftsWeek = false
                };
                if ($scope.dispos[monthYearEnd][$scope.week].remarques) {
                   $scope.dispos[monthYearStart][$scope.week].remarques =   $scope.dispos[monthYearEnd][$scope.week].remarques
                   $scope.forgotRemarques = false; 
                };
              }
            };

              if (!$scope.dispos[$scope.monthYear]) {
                 $scope.forgotShiftsWeek = true
                 $scope.forgotRemarques = true
              }else if( !$scope.dispos[$scope.monthYear][$scope.week] ){
                 $scope.forgotShiftsWeek = true;
                 $scope.forgotRemarques = true
              }

            $('#calendar').fullCalendar('removeEventSource')
            $('#calendar').fullCalendar('removeEvents');
            $('#calendar').fullCalendar('addEventSource', $scope.weekDispos);
            console.log($scope.dispos[monthYearStart][$scope.week])
            console.log($scope.dispos[monthYearEnd][$scope.week])
        },
        select: function(start, end) {
        
          //if click is before now
          if (moment(start).isBefore(new Date(), "day") ) {
            $scope.isBefore = true;
            return
          }else{
            $scope.isBefore = false;
          }
          //if the month is closed
          if (!$scope.isOpenMonth(start)) {
            $scope.monthClosedInfo = {
              show : true,
              name : $scope.months[start._d.getMonth()]
            };
            return;
          }else{
            $scope.monthClosedInfo = false;
          }
      
            $scope.monthYear = moment(start._d).format("MM-YYYY");
            var startHour = start._d.getHours()+":"+start._d.getMinutes();
            var endHour = end._d.getHours()+":"+end._d.getMinutes();
          
          //if you dragged...
          if (moment(end).isAfter(moment(start), "day") && !(startHour == endHour)  ) {
            $scope.drag = true;
          }else{
            $scope.drag = false
          }
          console.debug($scope.villes);
          if ($scope.villes.length == 0) {
            $scope.forgotCity = true
          }else{
            $scope.forgotCity = false
          }
       
           //if it has the same starting and ending hours 
           //-> it's all day, restrict the starting and ending hours
           if (startHour == endHour) {
              var allDay = true;
              var startTime = moment(start).hour(4)
              var endTime = moment(end).hour(19)
           }else{
              var allDay = false;
              var startTime = start;
              var endTime = end;
           }
           //assign the dispo type (absent/present)
           if ($scope.dispoType == true) {
              var className = "presentDispo"; //blue
              var title = "Dispo"
           }else{
              var className = "absentDispo"; //red
              var title = "Absent"
              var villes = null;
              $scope.forgotCity = false
           }

           //create the dispo variable
           var dispo =  { index : index, title: title, start: startTime,
            end: endTime, stick: true, villes : villes, allDay : allDay, 
            className: className+" data-id="+index
           };
           index++;
          //replace a dispo if selected on the same day
          if ( ($scope.dispos[$scope.monthYear] && $scope.villes.length != 0) || ($scope.dispos[$scope.monthYear]  && dispo.title == 'Absent') ) {
              if ($scope.dispos[$scope.monthYear][$scope.week]) {
                if ($scope.dispos[$scope.monthYear][$scope.week].dispos) {
                  var dispos = $scope.dispos[$scope.monthYear][$scope.week].dispos
                  for (var i = dispos.length - 1; i >= 0; i--) {
                    console.log(moment(dispos[i].start), dispo.start)
                    if( moment(dispos[i].start).isSame(dispo.start,"day") ){
                      $scope.dispos[$scope.monthYear][$scope.week].dispos.splice(i,1)
                      for (var  j = $scope.weekDispos.length - 1; j >= 0; j--) {
                        if( moment($scope.weekDispos[j].start).isSame(dispo.start,"day")){
                          $scope.weekDispos.splice(j,1)                          
                           $('#calendar').fullCalendar('removeEventSource')
                           $('#calendar').fullCalendar('removeEvents');
                           $('#calendar').fullCalendar('addEventSource', $scope.weekDispos);
                          }
                      };
                    }
                  };
                };
              };
           }
          //too short, it will just delete other event
          var dispoStart = moment.duration(dispo.start).asMinutes()
          var dispoEnd = moment.duration(dispo.end).asMinutes()
          if (dispoEnd-dispoStart <= 60 ) {

  
            return
          };
           console.debug($scope.forgotShiftsWeek);
          //show forgot city modal
          if ($scope.forgotCity && dispo.title != 'Absent') {
             var modalInstance = $modal.open({
              template: '<div class="modal-header"> '
             + '<h3 class="modal-title">Erreur</h3> </div>'
             + '  <div class="modal-body"> <p>Sélectionne une ville!</p>'
                    
              +  '</div><div class="modal-footer">'

               +     '<button class="btn btn-primary" ng-click="cancel()">ok</button></div>',
              controller: ["$scope", "$modalInstance", function($scope, $modalInstance){
                  $scope.cancel = function(){ 
                      $modalInstance.dismiss('cancel'); 
                  }
               }],
              size: "sm"
          });
          };
            //show forgot shifts modal
          if ($scope.forgotShiftsWeek &&  dispo.title != 'Absent') {
             var modalInstance = $modal.open({
              template: '<div class="modal-header"> '
             + '<h3 class="modal-title">Erreur</h3> </div>'
             + '  <div class="modal-body"> <p>Mets tes shifts par semaine!</p>'
                    
              +  '</div><div class="modal-footer">'

               +     '<button class="btn btn-primary" ng-click="cancel()">ok</button></div>' ,
              controller: ["$scope", "$modalInstance", function($scope, $modalInstance){
                  $scope.cancel = function(){ 
                      $modalInstance.dismiss('cancel'); 
                  }
               }],
              size: "sm"
          });
          };
            //show forgot remarques modal
          if ($scope.forgotRemarques &&  dispo.title != 'Absent') {
             var modalInstance = $modal.open({
              template: '<div class="modal-header"> '
             + '<h3 class="modal-title">Erreur</h3> </div>'
             + '  <div class="modal-body"> <p>Mets tes remarques!</p>'
                    
              +  '</div><div class="modal-footer">'

               +     '<button class="btn btn-primary" ng-click="cancel()">ok</button></div>',
              controller: ["$scope", "$modalInstance", function($scope, $modalInstance){
                  $scope.cancel = function(){ 
                      $modalInstance.dismiss('cancel'); 
                  }
               }],
              size: "sm"
          });
          };
          //everything ok,  push!!
         if ((!$scope.drag && !$scope.forgotCity && !$scope.forgotShiftsWeek && !$scope.isBefore && !$scope.forgotRemarques) || $scope.dispoType ==false)  {

              //init for the first click
              if (!$scope.dispos[$scope.monthYearStart]) {
                $scope.dispos[$scope.monthYearStart] = {}
              };
              if (!$scope.dispos[$scope.monthYearStart][$scope.week]) {
                $scope.dispos[$scope.monthYearStart][$scope.week] = {}
              };
              if(!$scope.dispos[$scope.monthYearStart][$scope.week].dispos){
                $scope.dispos[$scope.monthYearStart][$scope.week].dispos = []
              }
              if (!$scope.dispos[$scope.monthYearEnd]) {
                $scope.dispos[$scope.monthYearEnd] = {}
              };
              if (!$scope.dispos[$scope.monthYearEnd][$scope.week]) {
                $scope.dispos[$scope.monthYearEnd][$scope.week] = {}
              };
              if(!$scope.dispos[$scope.monthYearEnd][$scope.week].dispos){
                $scope.dispos[$scope.monthYearEnd][$scope.week].dispos = []
              }
              //if the week finished in differents months, do some stuff
              if (moment($scope.viewStart).month() != moment($scope.viewEnd).month() ) {
                  //...so there are no shifts nor remarques yet -> forgot
                  if (!$scope.dispos[$scope.monthYearEnd][$scope.week]) {
                     $scope.forgotShiftsWeek = true;
                     $scope.forgotRemarques = true;
                  }
                  //if you start with ending month, there is no starting month
                  if(!$scope.dispos[$scope.monthYearStart]){
                      $scope.dispos[$scope.monthYear][$scope.week].shiftsWeek = $scope.shiftsWeek
                      $scope.dispos[$scope.monthYear][$scope.week].remarques = $scope.remarques
                      $scope.forgotShiftsWeek = false;
                     $scope.forgotRemarques = false;
                  }
                  //if there is a starting month, copy shifts and remarques to the same week of the next month
                  if ($scope.dispos[$scope.monthYearStart][$scope.week].shiftsWeek) {
                    $scope.dispos[$scope.monthYear][$scope.week].shiftsWeek 
                        = angular.copy($scope.dispos[$scope.monthYearStart][$scope.week].shiftsWeek)
                    $scope.forgotShiftsWeek = false;
                  };
                  //same as above
                  if ($scope.dispos[$scope.monthYearStart][$scope.week].remarques) {
                       $scope.dispos[$scope.monthYear][$scope.week].remarques 
                        = angular.copy($scope.dispos[$scope.monthYearStart][$scope.week].remarques)          
                       $scope.forgotRemarques = false;
                  };

              };
              dispo.villes = angular.copy($scope.villes)
              $scope.dispos[$scope.monthYear][$scope.week].dispos.push(dispo)
              $scope.weekDispos.push(dispo)
              console.log( $scope.dispos)
          };
        },//end select
        /*
          add cities to dispo cell
        */
        eventAfterRender: function(evento, element) {
         if (evento.villes != null  && evento.title != "Absent") {
          var villes = evento.villes.join(', ');        
          var new_description = '<strong>Villes: </strong><br/>' + villes + '<br/>';       
          element.append(new_description);
         };
          
        }//end eventrender
      }
  	}//calendarConfig
  /*
    checks if the month of date clicked 
    is opened for new dispos or not (active)
  */
  $scope.isOpenMonth = function(date){
      var monthNum = date._d.getMonth()
      var year = date._d.getFullYear()
      for (var i = $scope.monthYears.length - 1; i >= 0; i--) {
        if ($scope.monthYears[i].monthNum == monthNum && $scope.monthYears[i].year ==year) {
          return $scope.monthYears[i].active
        };
      };
    }


  $scope.inputShiftsWeek = function(number){
    console.log($scope.monthYearStart, $scope.monthYearEnd,number)
    if(!number){
      $scope.forgotShiftsWeek = true
      return
    }
    $scope.shiftsWeek = number;
    $scope.forgotShiftsWeek = false
    if (!$scope.dispos[$scope.monthYear]) {
      $scope.dispos[$scope.monthYear] = {}
    };
    if (!$scope.dispos[$scope.monthYear][$scope.week]) {
      $scope.dispos[$scope.monthYear][$scope.week] = {}
    };
    $scope.dispos[$scope.monthYear][$scope.week].shiftsWeek = number

    if (moment($scope.viewStart).month() != moment($scope.viewEnd).month() ) {
       if (!$scope.dispos[$scope.monthYearEnd]) {
          $scope.dispos[$scope.monthYearEnd] = {}
        };
        if (!$scope.dispos[$scope.monthYearEnd][$scope.week]) {
          $scope.dispos[$scope.monthYearEnd][$scope.week] = {}
        };
      $scope.dispos[$scope.monthYearEnd][$scope.week].shiftsWeek = number
    }; 
  }
  $scope.inputRemarques =function (remarques){
   
    if (!remarques ||  remarques == '') {
       remarques = 'Pas de remarques';
     }
   
    $scope.remarques = remarques;
    $scope.forgotRemarques = false

    if (!$scope.dispos[$scope.monthYear]) {
      $scope.dispos[$scope.monthYear] = {}
    };
    if (!$scope.dispos[$scope.monthYear][$scope.week]) {
      $scope.dispos[$scope.monthYear][$scope.week] = {}
    };

   
    if (moment($scope.viewStart).month() != moment($scope.viewEnd).month() ) {

     if (!$scope.dispos[$scope.monthYearEnd]) {
        $scope.dispos[$scope.monthYearEnd] = {}
      };
      if (!$scope.dispos[$scope.monthYearEnd][$scope.week]) {
        $scope.dispos[$scope.monthYearEnd][$scope.week] = {}
      };
      $scope.dispos[$scope.monthYearEnd][$scope.week].remarques = remarques

    }; 

   $scope.dispos[$scope.monthYearStart][$scope.week].remarques = remarques
   $scope.dispos[$scope.monthYearEnd][$scope.week].remarques = remarques
   console.debug($scope.dispos[$scope.monthYearStart]);
    console.debug($scope.dispos[$scope.monthYearStart][$scope.week]);
    console.debug($scope.dispos[$scope.monthYearStart]);
    

    console.debug(remarques);

 }

  $scope.loadDispos = function(theWeek, monthYearStart, monthYearEnd){
    if (monthYearStart == monthYearEnd) {
      var months= [monthYearStart]
    }else{
      var months= [monthYearStart, monthYearEnd]
    }

   for (var j = months.length - 1; j >= 0; j--) {
    var monthYear = months[j] 
    if ($scope.user.dispos) {
      for(var month in $scope.user.dispos){
        if (monthYear == month &&  $.inArray(monthYear, $scope.alreadySeen) == -1 ) {
          $scope.alreadySeen.push(monthYear)

          for(var week in $scope.user.dispos[monthYear]){
            if ($scope.user.dispos[monthYear][week].dispos) {
               for (var i = $scope.user.dispos[monthYear][week].dispos.length - 1; i >= 0; i--) {
               $scope.weekDispos.push($scope.user.dispos[monthYear][week].dispos[i])
            };
            };
           
           if (!$scope.dispos[monthYear]) {
              $scope.dispos[monthYear] = {}
           };
           if (!$scope.dispos[monthYear][week]) {
              $scope.dispos[monthYear][week] = {}
           };
           if ($scope.dispos[monthYear][week].dispos) {
              $scope.dispos[monthYear][week].dispos = []
           };

           $scope.dispos[monthYear][week].dispos = $scope.user.dispos[monthYear][week].dispos
           $scope.dispos[monthYear][week].shiftsWeek = $scope.user.dispos[monthYear][week].shiftsWeek
           $scope.dispos[monthYear][week].remarques = $scope.user.dispos[monthYear][week].remarques
               
          }
        }else if($.inArray(monthYear, $scope.alreadySeen) != -1){
          return;
        }
      }
    };    
  }
   console.log($scope.dispos)
  }
    /**
      Dispo dispoType
      true = disponible, false = absent
    */
  $scope.toggleDispoType = function(type){
      if (type == 'present') {
        $scope.dispoType = true;
      }else{
        $scope.dispoType = false;
      }
    }
$scope.checkForgots = function(){
       //show forgot city modal
      if ($scope.forgotCity) {
         var modalInstance = $modal.open({
          template: '<div class="modal-header"> '
         + '<h3 class="modal-title">Erreur</h3> </div>'
         + '  <div class="modal-body"> <p>Sélectionne une ville!</p>'
                
          +  '</div><div class="modal-footer">'

           +     '<button class="btn btn-primary" ng-click="cancel()">ok</button></div>',
          controller: ["$scope", "$modalInstance", function($scope, $modalInstance){
              $scope.cancel = function(){ 
                  $modalInstance.dismiss('cancel'); 
              }
           }],
          size: "sm"
      });
      };
        //show forgot shifts modal
      if ($scope.forgotShiftsWeek) {
         var modalInstance = $modal.open({
          template: '<div class="modal-header"> '
         + '<h3 class="modal-title">Erreur</h3> </div>'
         + '  <div class="modal-body"> <p>Mets tes shifts par semaine!</p>'
                
          +  '</div><div class="modal-footer">'

           +     '<button class="btn btn-primary" ng-click="cancel()">ok</button></div>' ,
          controller: ["$scope", "$modalInstance", function($scope, $modalInstance){
              $scope.cancel = function(){ 
                  $modalInstance.dismiss('cancel'); 
              }
           }],
          size: "sm"
      });
      };
        //show forgot remarques modal
      if ($scope.forgotRemarques ) {
         var modalInstance = $modal.open({
          template: '<div class="modal-header"> '
         + '<h3 class="modal-title">Erreur</h3> </div>'
         + '  <div class="modal-body"> <p>Mets tes remarques!</p>'
                
          +  '</div><div class="modal-footer">'

           +     '<button class="btn btn-primary" ng-click="cancel()">ok</button></div>',
          controller: ["$scope", "$modalInstance", function($scope, $modalInstance){
              $scope.cancel = function(){ 
                  $modalInstance.dismiss('cancel'); 
              }
           }],
          size: "sm"
      });
      };
      if ($scope.forgotRemarques || $scope.forgotShiftsWeek) {
        return true;
      };
}
    $(document).ready(function(){
      //for checking on week change
      $("body").on('mouseup',".fc-prev-button",function(e){
        console.log($scope.monthYearEnd, $scope.monthYearStart)
        if($scope.dispos[$scope.monthYearEnd] || $scope.dispos[$scope.monthYearStart]){
          if ($scope.dispos[$scope.monthYearEnd][$scope.week] || $scope.dispos[$scope.monthYearStart][$scope.week] ) {
            if ($scope.dispos[$scope.monthYearEnd][$scope.week].dispos.length > 0   ||  $scope.dispos[$scope.monthYearStart][$scope.week].dispos.length >0  ) {  
              // if ($scope.checkForgots()) {
              //     $("#calendar").fullCalendar('next')
              //     return
              // };
            };
          };
        }
      })
      $("body").on('mouseup',".fc-next-button",function(e){
        if($scope.dispos[$scope.monthYearEnd] || $scope.dispos[$scope.monthYearStart]){
          if ($scope.dispos[$scope.monthYearEnd][$scope.week] || $scope.dispos[$scope.monthYearStart][$scope.week] ) {
            if ($scope.dispos[$scope.monthYearEnd][$scope.week].dispos.length > 0  ||  $scope.dispos[$scope.monthYearStart][$scope.week].dispos > 0  ) {
              //  if ($scope.checkForgots()) {
              //    $("#calendar").fullCalendar('prev')
              //   return
              // };
            };
          };
        }
      })
    })
  }]);

'use strict';

angular.module('velociteScheduleApp')
  .config(["$stateProvider", function ($stateProvider) {

    $stateProvider
      .state('sendDispos', {
        url: '/sendDispos',
        templateUrl: 'app/sendDispos/sendDispos.html',
        controller: 'SendDisposCtrl'
      })
      .state('sendDispos.verify', {
        url: '/verify/',
        params : {dispos: null},
        templateUrl: 'app/sendDispos/verifyDispos.html',
        controller: 'VerifyDisposCtrl'
      });
  }]);
'use strict';

angular.module('velociteScheduleApp')
  .controller('VerifyDisposCtrl', ["$scope", "$state", "Auth", "$http", "$modal", function ($scope, $state, Auth, $http, $modal) {
  	$scope.dispos = $state.params; //used in ng-click sendDispos(dispos)
  	//$scope.noDispos = true;


    $scope.verify = function(dispos){
		$scope.month = dispos[Object.keys(dispos)[0]]; //returns the containings of the month object.
	    var weeks = [];	// nb shift, remarques & dispos per week
	    var names = []; //ex 10 - 17 juin
	    var index = 0;

	    //if some dispos have been entered
	    if($scope.dispos.dispos != null){
	    	for (var month in $scope.month) {
    		for (var week in $scope.month[month]){
               console.debug($scope.month);
    			if (!$scope.month[month][week].dispos) {
    				delete $scope.month[month][week]
    			}else{
    				$scope.noDispos = false;
    				weeks[index] = $scope.month[month][week];
	    			names[index] = week;
	    			index++;
    			}
    		}
    	};
			$scope.weeks = weeks;
			$scope.names = names;		
		//if not, show info
	    }else{
	    	$scope.noDispos = true;
	    }
    	
    }
    $scope.verify($scope.dispos)


    /*
    	update the user with given availbilities
    	@dispos - availbilites object
    */
    $scope.sendDispos = function(dispos){
        console.debug(dispos);
    	$scope.user = Auth.getCurrentUser();
    if (!$scope.noDispos) {
        

       for(var monthYear in dispos.dispos){
           var dispo = dispos.dispos[monthYear]
            $http({
                method: 'PUT',
                url: "/api/users/"+$scope.user._id+"/dispos",// in server->user->index.js & user.controller
                data: { dispos : dispo, id : $scope.user._id, monthYear : monthYear }
            })
            .success(function(data, status){    
                 console.log(data);
                 console.log('sucess updating dispos');
            })
            .error(function(err){
                console.log('error while updating dipos!')
                console.log(err);
            }) 

        };
       var modalInstance = $modal.open({
            templateUrl: 'app/sendDispos/disposSent.html',//par rapport a l index.html
            controller: ["$scope", "$modalInstance", function($scope, $modalInstance){
                $scope.cancel = function(){ 
                    $modalInstance.dismiss('cancel'); 
                    $state.go("planningCoursier")

                }
                $scope.close = function(){ 
                    $modalInstance.dismiss('cancel'); 
                }
             }],
            size: "sm"
        });
    	
    };
    }
    $scope.sendDispos($scope.dispos)
    $scope.back = function(){
    	$state.go("^");
    }
	
}])
'use strict';

angular.module('velociteScheduleApp')
  .controller('ShiftDetailsCtrl', ["$scope", "$http", "$state", "shiftService", function ($scope, $http, $state, shiftService) {
  	$scope.showAddCoursiers = false;
  	$scope.selectedCoursiers = [];
    $scope.villes = shiftService.getCities()
  	shiftService.getShift($state.params.shiftId, function(shift){
  		$scope.shift = shift;
  	});

    $scope.back =function(){
    	$state.go("^");
    }
    /*
      loads the only coursiers that the shift 
      doesnt have yet.
    */
   	$scope.loadCoursiers = function () {
      $scope.coursiers = []
  		$http.get("api/users").success(function (coursiers) {
  			$.each(coursiers, function(i, coursier){
         // console.debug(shiftService.containsAll(shift.competences, coursier.competences));
          if (shiftService.containsAll($scope.shift.competences, coursier.competences)) {
            $scope.coursiers.push(coursier)
          };
        })
  			$scope.showAddCoursiers = true;
  		});
   	}
    $scope.loadCoursiers()

    /*
      update the shift with new coursiers
    */
   	$scope.addCoursiers = function (coursiers) {
   		 $http({
            method: 'PUT',
            url: "/api/shifts/"+$scope.shift._id,
            data: {
            	coursiers:coursiers
            }
          }).success(function(data, status){ 
          	console.log(data)
          	console.log(status)
          })
   	}
    $scope.editStart = function(start){
       $http({
            method: 'PUT',
            url: "/api/shifts/"+$scope.shift._id+"/editStart",
            data: {
              start:start
            }
          })
    }
    $scope.editEnd = function(end){
       $http({
            method: 'PUT',
            url: "/api/shifts/"+$scope.shift._id+"/editEnd",
            data: {
              end:end
            }
          })
    }
    $scope.editCity = function(city){
       $http({
            method: 'PUT',
            url: "/api/shifts/"+$scope.shift._id+"/editCity",
            data: {
              city:city
            }
          })
    }
    $scope.editName = function(name){
       $http({
            method: 'PUT',
            url: "/api/shifts/"+$scope.shift._id+"/editName",
            data: {
              name:name
            }
          })
    }
  
   	
}]);

'use strict';

angular.module('velociteScheduleApp')
  .controller('ShiftsCtrl', ["$scope", "$http", "$state", "shiftService", function ($scope, $http, $state, shiftService) {
    
    $http.get("/api/shifts").success(function(shifts){
    	$scope.shifts = shifts;
    })

}]);

'use strict';

angular.module('velociteScheduleApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('shifts', {
        url: '/shifts',
        templateUrl: 'app/shifts/shifts.html',
        controller: 'ShiftsCtrl'
      })
      .state('shifts.details', {
        url: '/:shiftId',
        templateUrl: 'app/shiftDetails/shiftDetails.html',
        controller: 'ShiftDetailsCtrl'
      })
    
  }]);
'use strict';

angular.module('velociteScheduleApp')
  .factory('AttributionsService', ["$resource", "$http", "$rootScope", function ($resource, $http,$rootScope) {
    return {
      setShift: function (shifts, coursier, date, otherShift){
        if (shifts == null) {
          shifts = [otherShift]
        };
        var monthYear = moment(date).format("MM-YYYY");
        var day = moment(date).format("D")
        $http.put("api/attributions/:id/setShift",
            {
              shifts : shifts,
              coursier : coursier,
              date : date,
              monthYear : monthYear,
              day : day
            }
          ).success(function(data, status){
            var daShift = shifts[0]
            daShift.coursierAttributed = {
              _id : coursier._id
            }
            $rootScope.$broadcast("attribution", {shift: daShift, 
                                            monthYear : monthYear, day: day, 
                                            coursier : coursier, date: date, })
          }).error(function(err){
            console.log(err)
          })
      },
      deleteShift : function(coursier, date, shift){
        var day = moment(date).format("D")
        var monthYear = moment(date).format("MM-YYYY")
        console.debug(shift, coursier, day, monthYear);
        if(shift){
             $http.put("api/attributions/:id/deleteShift",
            {
              shift : shift,
              coursier : coursier,
              monthYear : monthYear,
              day : day
            }
          ).success(function(data, status){
            console.debug(data, status);
          $rootScope.$broadcast("deletitionShift", 
               {shift:shift, day:day, monthYear:monthYear, coursier:coursier}
               )
          }).error(function(err){
            console.log(err)
          })
        }
      

      },
      formatShiftsForCalendar: function (shifts, callback) {

        var formatedShifts = []
        for (var i = shifts.length - 1; i >= 0; i--) {
          var day = shifts[i].date
          var startHours = moment(shifts[i].debut).hours()
          var endHours = moment(shifts[i].fin).hours()
          var startMinutes= moment(shifts[i].debut).minutes()
          var endMinutes = moment(shifts[i].fin).minutes()
         
          var start = moment(day).hours(startHours).minutes(startMinutes)
          var end = moment(day).hours(endHours).minutes(endMinutes)
          var color = function(ville){
            if (ville =="Lausanne") {
              return "#1F992F"
            };
            if (ville =="Neuchâtel") {
              return "#9f30ff"
            };
            // if (ville =="Yverdon") {
            //   return "#1F992F"
            // };
          }

          var shift = {
            title : shifts[i].nom,
            start : start._d,
            end : end._d,
            ville : shifts[i].ville,
            backgroundColor: color(shifts[i].ville)
          }
          formatedShifts.push(shift)
        };
        callback(formatedShifts);
      },
      getMyMonthlyShifts: function  (coursierId, monthYear, attributions, callback) {
        console.log(coursierId, monthYear, attributions)
        var attr = attributions[0].monthYear;
        var myMonthlyShifts = []
        for(var month in attr){
          if (month == monthYear) {
            for(var day in attr[monthYear]){
              for (var i = attr[monthYear][day].shifts.length - 1; i >= 0; i--) {
                if(attr[monthYear][day].shifts[i].coursierAttributed._id == coursierId){
                  var date = moment(day+"-"+monthYear, "D-MM-YYYY");
                  attr[monthYear][day].shifts[i].date = date;
                  myMonthlyShifts.push(attr[monthYear][day].shifts[i])
                }
              };
            }
          };
        }
       
        callback(myMonthlyShifts)
      }
    }
    
  }]);

'use strict';

angular.module('velociteScheduleApp')
  .factory('Auth', ["$location", "$rootScope", "$http", "User", "$cookieStore", "$q", function Auth($location, $rootScope, $http, User, $cookieStore, $q) {
    var currentUser = {};
    if($cookieStore.get('token')) {
      currentUser = User.get();
    }

    return {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function(user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/auth/local', {
          email: user.email,
          password: user.password
        }).
        success(function(data) {
          $cookieStore.put('token', data.token);
          currentUser = User.get();
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          this.logout();
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
      },

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function() {
        $cookieStore.remove('token');
        currentUser = {};
      },

      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createUser: function(user, callback) {
        var cb = callback || angular.noop;

        return User.save(user,
          function(data) {
            console.debug(user);
            console.log(data)
            //dont login after register!
            // $cookieStore.put('token', data.token);
            // currentUser = User.get();
            // return cb(user);
            

          },
          function(err) {
            this.logout();
            return cb(err);
          }.bind(this)).$promise;
      },

      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changePassword: function(oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.changePassword({ id: currentUser._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function() {
        return currentUser;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return currentUser.hasOwnProperty('role');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function(cb) {
        if(currentUser.hasOwnProperty('$promise')) {
          currentUser.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
        } else if(currentUser.hasOwnProperty('role')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin: function() {
        return currentUser.role === 'admin';
      },

      /**
       * Get auth token
       */
      getToken: function() {
        return $cookieStore.get('token');
      }
    };
  }]);

'use strict';

angular.module('velociteScheduleApp')
  .factory('User', ["$resource", function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  }]);

'use strict';

angular.module('velociteScheduleApp')
  .factory('calendarService', function () {
  	var months =['Janvier','Février','Mars','Avril',"Mai",'Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
  	var days = ['di','lu','ma','me','je','ve','sa'] //0 = dimanche, 1 = lundi with .getDay()
    

  	return{
  		getMonths: function(){
  			return  months;
  		},
  		getDays :function(){
  			return days;
  		}

  	}
    


});

'use strict';

angular.module('velociteScheduleApp')
  .factory('Modal', ["$rootScope", "$modal", function ($rootScope, $modal) {
    /**
     * Opens a modal
     * @param  {Object} scope      - an object to be merged with modal's scope
     * @param  {String} modalClass - (optional) class(es) to be applied to the modal
     * @return {Object}            - the instance $modal.open() returns
     */
    function openModal(scope, modalClass) {
      var modalScope = $rootScope.$new();
      scope = scope || {};
      modalClass = modalClass || 'modal-default';

      angular.extend(modalScope, scope);

      return $modal.open({
        templateUrl: 'components/modal/modal.html',
        windowClass: modalClass,
        scope: modalScope
      });
    }

    // Public API here
    return {

      /* Confirmation modals */
      confirm: {

        /**
         * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
         * @param  {Function} del - callback, ran when delete is confirmed
         * @return {Function}     - the function to open the modal (ex. myModalFn)
         */
        delete: function(del) {
          del = del || angular.noop;

          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed staight to del callback
           */
          return function() {
            var args = Array.prototype.slice.call(arguments),
                name = args.shift(),
                deleteModal;

            deleteModal = openModal({
              modal: {
                dismissable: true,
                title: 'Confirm Delete',
                html: '<p>Are you sure you want to delete <strong>' + name + '</strong> ?</p>',
                buttons: [{
                  classes: 'btn-danger',
                  text: 'Delete',
                  click: function(e) {
                    deleteModal.close(e);
                  }
                }, {
                  classes: 'btn-default',
                  text: 'Cancel',
                  click: function(e) {
                    deleteModal.dismiss(e);
                  }
                }]
              }
            }, 'modal-danger');

            deleteModal.result.then(function(event) {
              del.apply(event, args);
            });
          };
        }
      }
    };
  }]);

'use strict';

/**
 * Removes server error when user updates input
 */
angular.module('velociteScheduleApp')
  .directive('mongooseError', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        element.on('keydown', function() {
          return ngModel.$setValidity('mongoose', true);
        });
      }
    };
  });
'use strict';

angular.module('velociteScheduleApp')
  .controller('NavbarCtrl', ["$scope", "$location", "Auth", function ($scope, $location, Auth) {


    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
    $scope.toggleCollapse = function(){
      if (!$scope.isCollapsed) {
        $scope.isCollapsed = true
      };
    }
    //toggle planning between all coursiers and monthly personnal view
$scope.togglePlanning = function(planningAdmin){
  if (planningAdmin) {
     $scope.isAdmin = function(){
      return false;
     } 
      $scope.toggleButtonText = "Tous les coursiers"
      $scope.toggleHeaderText = "Mon planning"
  }else{
     $scope.isAdmin = function(){
      return true;
     }
      $scope.toggleButtonText = "Mon planning"
      $scope.toggleHeaderText = "Tous les coursiers"
  }
}
  }]);
'use strict';

angular.module('velociteScheduleApp')
  .factory('shiftService', ["$http", function ($http) {

  	return{
  		getShift: function(shiftId, callback){
  			$http.get("/api/shifts/"+shiftId).success(function(shift){        
           callback(shift);
        })
  		},
  		getShifts :function(callback){
  			$http.get("/api/shifts/").success(function(shifts){        
           callback(shifts);
        })
  		},
      formatHoursMinutes : function(shift){
        console.debug('qwewqe');
        if(shift.length > 1){
          for (var i = shift.length - 1; i >= 0; i--) {
            if(typeof shift[i].debut != 'undefined'){
              shift[i].debut = moment(shift[i].debut).format("H")+"h:"+ moment(shift[i].debut).format("mm")
              shift[i].fin =   moment(shift[i].fin).format("H")+"h:"+ moment(shift[i].fin).format("mm")
            }
          };
        }else{
          if (typeof shift.debut != 'undefined') {
            shift.debut = moment(shift.debut).format("H")+"h:"+ moment(shift.debut).format("mm")
            shift.fin = moment(shift.fin).format("H")+"h:"+ moment(shift.fin).format("mm")
          };
           
        } 

      },
      getWeekDays : function(){
        return [ 
              {id:1, nom : 'Lundi', times: 1},
              {id:2, nom : 'Mardi', times: 1},
              {id:3, nom : 'Mercredi', times: 1},
              {id:4, nom : 'Jeudi', times: 1},
              {id:5, nom : 'Vendredi', times: 1},
              {id:6, nom : 'Samedi', times: 1}
            ]
      },
      getCompetences:function(){
        return ["Back-office","Spécial", "Coursier", "Dispatcheur", "CTiste"]
      },
      getCities : function(){
        return ["Lausanne", "Yverdon","Neuchâtel"]
              },
      containsAll: function(needles, haystack){ 
        for(var i = 0 , len = needles.length; i < len; i++){
           if($.inArray(needles[i], haystack) == -1) return false;
        }
        return true;
      }

  	}
    


}]);

angular.module('velociteScheduleApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/account/login/login.html',
    "<div class=container><div class=row><div class=col-sm-12><h1 id=loginTitle>Login</h1></div><div class=col-sm-10><form class=\"form loginForm\" name=form ng-submit=login(form) novalidate><div class=form-group><label>E-mail</label><input name=email class=\"form-control login-input\" ng-model=user.email required></div><div class=form-group><label>Mot de passe</label><input type=password name=password class=\"form-control login-input\" ng-model=user.password required></div><div class=\"form-group has-error\"><p class=help-block ng-show=\"form.email.$error.required && form.password.$error.required && submitted\">Retnre ton adresse E-mail</p><p class=help-block ng-show=\"form.email.$error.email && submitted\">E-mail invalide</p><p class=help-block>{{ errors.other }}</p></div><div><button class=\"btn btn-inverse btn-lg btn-login\" type=submit>Login</button></div></form></div></div><hr></div>"
  );


  $templateCache.put('app/account/settings/settings.html',
    "<div class=container id=settings><div class=row><div class=col-sm-12><h3>Changer le mot de passe</h3></div><div class=col-sm-12><form class=\"form col-md-3\" name=form ng-submit=changePassword(form) novalidate><div class=form-group><label>Mot de passe actuel</label><input type=password name=password class=form-control ng-model=user.oldPassword mongoose-error><p class=help-block ng-show=form.password.$error.mongoose>{{ errors.other }}</p></div><div class=form-group><label>Nouveau mot de passe</label><input type=password name=newPassword class=form-control ng-model=user.newPassword ng-minlength=3 required><p class=help-block ng-show=\"(form.newPassword.$error.minlength || form.newPassword.$error.required) && (form.newPassword.$dirty || submitted)\">Le mot de passe doit avoir au moins 3 charactères</p></div><p class=help-block>{{ message }}</p><button class=\"btn btn-lg btn-primary\" type=submit>changer</button></form><div class=col-md-4><h3>Personnel</h3><p><label>Nom:</label>{{user.name}}</p><p><label>Prénom:</label>{{user.prenom}}</p><p><label>Date de naissance:</label>{{user.naissance}}</p><p><label>Email:</label>{{user.email}}</p><p><label>Fixe:</label>{{user.adresse.telFixe}}</p><p><label>Portable:</label>{{user.adresse.telPortable}}</p><h3>Adresse</h3><p><label>Rue:</label>{{user.adresse.rue}}</p><p><label>Ville:</label>{{user.adresse.ville}}</p><p><label>NPA:</label>{{user.adresse.npa}}</p></div><div class=col-md-4><h3>Permis</h3><p><label>AG:</label>{{user.ag == true ? \" Oui\":\" Non\"}}</p><p><label>Permis de conduire:</label>{{user.permis == true ? \" Oui\":\" Non\"}}</p><p><label>Mobility:</label>{{user.mobility == true ? \" Oui\":\" Non\"}}</p><h3>Vélocité</h3><p><label>Coursier depuis:</label>{{user.createdOn}}</p><p><label>Actif:</label>{{}}</p></div></div></div></div>"
  );


  $templateCache.put('app/account/signup/signup.html',
    "<div class=container><div class=row><div class=col-sm-12><h1>Sign up</h1></div><div class=col-sm-12><form class=form name=form ng-submit=register(form) novalidate><div class=form-group ng-class=\"{ 'has-success': form.name.$valid && submitted,\r" +
    "\n" +
    "                                            'has-error': form.name.$invalid && submitted }\"><label>Name</label><input name=name class=form-control ng-model=user.name required><p class=help-block ng-show=\"form.name.$error.required && submitted\">A name is required</p></div><div class=form-group ng-class=\"{ 'has-success': form.email.$valid && submitted,\r" +
    "\n" +
    "                                            'has-error': form.email.$invalid && submitted }\"><label>Email</label><input name=email class=form-control ng-model=user.email required mongoose-error><p class=help-block ng-show=\"form.email.$error.email && submitted\">Doesn't look like a valid email.</p><p class=help-block ng-show=\"form.email.$error.required && submitted\">What's your email address?</p><p class=help-block ng-show=form.email.$error.mongoose>{{ errors.email }}</p></div><div class=form-group ng-class=\"{ 'has-success': form.password.$valid && submitted,\r" +
    "\n" +
    "                                            'has-error': form.password.$invalid && submitted }\"><label>Password</label><input type=password name=password class=form-control ng-model=user.password ng-minlength=3 required mongoose-error><p class=help-block ng-show=\"(form.password.$error.minlength || form.password.$error.required) && submitted\">Password must be at least 3 characters.</p><p class=help-block ng-show=form.password.$error.mongoose>{{ errors.password }}</p></div><div><button class=\"btn btn-inverse btn-lg btn-login\" type=submit>Sign up</button> <a class=\"btn btn-default btn-lg btn-register\" href=/login>Login</a></div></form></div></div><hr></div>"
  );


  $templateCache.put('app/coursierDayDirective/coursierDays.html',
    "<div class=dispoInfo tooltip=\"De {{from != null ? from : '?' }} à {{to != null ? to : '?' }}  \r" +
    "\n" +
    "              {{cities != null ? 'Villes: '+cities : '?'}} \r" +
    "\n" +
    "              {{remarques != null ? '---' +remarques : '' }} \r" +
    "\n" +
    "              ---{{shiftsLeft != null ? 'Shifts restants:'+ shiftsLeft : '' }}\" tooltip-placement=top tooltip-append-to-body=true tooltip-trigger=mouseenter></div><span city={{shift.ville}} ng-repeat=\"shift in daShifts track by $index\" ng-class=\"daShifts != null ? 'attributedShift' : ''  \" popover=\"Remarques: {{shift.remarques}} || A {{shift.ville}} de {{shift.debut | date : 'H:mm'}} à  {{shift.fin | date : 'H:mm'}}\" popover-placement=top popover-trigger=mouseenter>{{shift.nom}}{{$last ? \"\" : \" \"}}</span>"
  );


  $templateCache.put('app/coursierDetails/coursierDetails.html',
    "<div class=\"bg-primary text-center title\"><h2>Détails du coursier</h2></div><div class=container><div class=col-md-2></div><div class=col-md-4><h3>Personnel</h3><p><label>Nom:</label><span editable-text=user.name>{{user.name}}</span></p><p><label>Prénom:</label><span editable-text=user.prenom>{{user.prenom}}<span></span></span></p><p><label>Date de naissance:</label>{{user.naissance | amDateFormat:'dddd D MMMM YYYY'}}</p><p><label>Email:</label><span editable-email=user.email>{{user.email}}</span></p><p><label>No coursier:</label><span editable-number=user.numeroCoursier>#{{user.numeroCoursier}}</span></p><!--    <p><label>Fixe: </label> {{user.adresse.telFixe}}</p>\r" +
    "\n" +
    "        <p><label>Portable: </label> {{user.adresse.telPortable}}</p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <h3>Adresse</h3>\r" +
    "\n" +
    "        <p><label>Rue: </label> {{user.adresse.rue}}</p>\r" +
    "\n" +
    "        <p><label>Ville: </label> {{user.adresse.ville}}</p>\r" +
    "\n" +
    "        <p><label>NPA: </label> {{user.adresse.npa}}</p>\r" +
    "\n" +
    "    --></div><div class=col-md-4><h3>Permis</h3><p><label>AG:</label>{{user.ag == true ? \" Oui\":\" Non\"}}</p><p><label>Permis de conduire:</label>{{user.permis == true ? \" Oui\":\" Non\"}}</p><p><label>Mobility:</label>{{user.mobility == true ? \" Oui\":\" Non\"}}</p><h3>Vélocité</h3><p><label>Coursier depuis:&nbsp;</label>{{user.createdOn | amDateFormat:'dddd D MMMM YYYY'}}</p><p><label>Actif:&nbsp;</label>{{user.departOn == \"Oui\" ? user.departOn : \"non - depuis \"+user.departOn}}</p><button ng-show=\"user.departOn == 'Oui' \" class=\"btn btn-danger\" ng-click=deactivateCoursier(user)>Désactiver</button><h3>Compétences</h3><p ng-repeat=\"com in user.competences\">{{com}}</p><div ng-show=addCompetences id=addCompetences><ul class=coursiersCheckbox><li ng-repeat=\"competence in competences track by $index\"><input type=checkbox checklist-value=competence checklist-model=user.newCompetences><label class=checkboxText>{{competence != null ? competence : null}}</label></li></ul></div><button class=\"btn-primary btn\" ng-show=!addCompetences ng-click=showCompetences()>Ajouter des compétences</button> <button ng-show=addCompetences class=\"btn btn-success\" ng-click=add(user.newCompetences)>Ajouter</button></div></div><div class=\"text-center back\"><button ng-click=back() class=\"btn btn-info btn-lg\">Retour</button></div>"
  );


  $templateCache.put('app/coursiers/coursiers.html',
    "<div ui-view=\"\"><div class=\"bg-primary text-center title\"><h3>Liste des coursiers</h3></div><div class=container><p>Total: <b>{{total}}</b> coursiers</p><form class=\"form-inline search col-md-6\"><div class=\"form-group row\"><label>Recherche</label><input ng-model=searchCoursier> <button class=btn ng-class=\"checkDispos == '' ? ' btn-success' :'btn-danger' \" ng-click=\"checkDispos = !checkDispos\">{{checkDispos == '' ? 'Qui a donné ses dispos' : 'Qui n\\'a pas donné' }}</button> <button class=\"btn btn-sm\" ng-click=\"checkDispos = '' \">Tous</button></div></form><table class=\"table table-striped table-bordered\"><tr><th class=shiftsHeaders>No coursier</th><th class=shiftsHeaders>Nom</th><th class=shiftsHeaders>Prénom</th><th class=shiftsHeaders>Compétences</th><th class=shiftsHeaders>Donné ses dispos pour<select ng-model=month ng-change=\"checkGivenDispos(month, year)\"><option ng-repeat=\"month in monthNames\" value={{$index}} ng-selected=\"$index == currentMonth\">{{month}}</option></select><select ng-model=year ng-change=\"checkGivenDispos(month, year)\"><option ng-repeat=\"year in years\" value={{year}} ng-selected=\"year == currentYear\">{{year}}</option></select></th><th class=shiftsHeaders>Coursier depuis</th><!--   <th class=\"shiftsHeaders\">Coursier jusqu'à</th> --><th><span class=\"glyphicon glyphicon-trash pull-right\"></span></th></tr><tr ng-repeat=\"user in users | filter: \r" +
    "\n" +
    "             { name: searchCoursier, \r" +
    "\n" +
    "             gaveDispos : checkDispos} \r" +
    "\n" +
    "        |orderBy: 'numeroCoursier' \"><td>#{{user.numeroCoursier}}</td><td><a ui-sref=coursiers.details({coursierId:user._id})>{{user.name}}</a></td><td>{{user.prenom}}</td><td><span ng-repeat=\"com in user.competences\">{{com}}{{$last ? \"\" : \", \"}}</span></td><td><b ng-style=\"user.gaveDispos != true ? {color: 'red'} : '' \">{{user.gaveDispos === true ? 'Oui' : \"Non\"}}</b></td><td>{{user.createdOn}}</td><!--        <td>{{user.departOn}}</td> --><td><a ng-click=delete(user) class=trash><span class=\"glyphicon glyphicon-trash pull-right\"></span></a></td></tr></table></div></div>"
  );


  $templateCache.put('app/createCoursier/createCoursier.html',
    "<div class=\"bg-primary text-center title\"><h3>Créer un coursier</h3></div><div class=container><form class=\"form-horizontal col-md-6\"><div class=form-group><label class=\"col-sm-3 control-label\">Prénom</label><div class=col-sm-9><input ng-model=user.prenom class=form-control></div></div><div class=form-group><label class=\"col-sm-3 control-label\">Nom*</label><div class=col-sm-9><input ng-model=user.name class=form-control></div></div><div class=form-group><label class=\"col-sm-3 control-label\">Date de naissance</label><div class=col-sm-9><datepicker ng-model=user.naissance show-weeks=true></datepicker></div></div><div class=form-group><label class=\"col-sm-3 control-label\">E-mail*</label><div class=col-sm-9><input type=email ng-model=user.email class=form-control pattern=^@]+@^@]+\\.[a-zA-Z]{2,6} required></div></div><!--   <h3>Adresse</h3>\r" +
    "\n" +
    "   <div class=\"form-group\">\r" +
    "\n" +
    "    <label class=\"col-sm-3 control-label\">Rue et no</label>\r" +
    "\n" +
    "    <div class=\"col-sm-9\">\r" +
    "\n" +
    "      <input type=\"text\" ng-model=\"user.adresse.rue\" class=\"form-control\" >\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "   <div class=\"form-group\">\r" +
    "\n" +
    "    <label class=\"col-sm-3 control-label\">Ville</label>\r" +
    "\n" +
    "    <div class=\"col-sm-9\">\r" +
    "\n" +
    "      <input type=\"text\" ng-model=\"user.adresse.ville\" class=\"form-control\" >\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "   <div class=\"form-group\">\r" +
    "\n" +
    "    <label class=\"col-sm-3 control-label\">NPA</label>\r" +
    "\n" +
    "    <div class=\"col-sm-9\">\r" +
    "\n" +
    "      <input type=\"text\" ng-model=\"user.adresse.npa\" class=\"form-control\" >\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "   <div class=\"form-group\">\r" +
    "\n" +
    "    <label class=\"col-sm-3 control-label\">Tél. fixe</label>\r" +
    "\n" +
    "    <div class=\"col-sm-9\">\r" +
    "\n" +
    "      <input type=\"text\" ng-model=\"user.telFixe\" class=\"form-control\" >\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "   <div class=\"form-group\">\r" +
    "\n" +
    "    <label class=\"col-sm-3 control-label\">Tél. portable</label>\r" +
    "\n" +
    "    <div class=\"col-sm-9\">\r" +
    "\n" +
    "      <input type=\"text\" ng-model=\"user.telPortable\" class=\"form-control\" >\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "   <div class=\"form-group\">\r" +
    "\n" +
    "    <label class=\"col-sm-3 control-label\">No compte</label>\r" +
    "\n" +
    "    <div class=\"col-sm-9\">\r" +
    "\n" +
    "      <input type=\"text\" ng-model=\"user.compteBanc\" class=\"form-control\" >\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    " --><div class=form-group><label class=\"col-sm-3 control-label\">Mot de passe*</label><div class=col-sm-9><input ng-model=user.password class=form-control></div></div></form><div class=\"form-horizontal col-md-6\"><h4>Numéro coursier*: # <b><input type=number validate-no ng-model=user.numeroCoursier coursiers=users numero=user.numeroCoursier invalid-no=validNo value={{user.numeroCoursier}} min=0></b></h4><h4 ng-show=invalidNo class=bg-danger>Ce numéro existe déjà!</h4><div class=\"col-sm-4 col-md-12\"><h4>Compétences</h4><ul class=coursierOthersCheckbox><li ng-repeat=\"competence in competences\"><label class=checkboxText><input type=checkbox checklist-value=competence checklist-model=user.competences>{{competence}}</label></li></ul></div><div class=\"col-sm-4 col-md-12\"><h4>Rôle*</h4><ul class=coursierOthersCheckbox><li><label class=checkboxText><input type=radio value=admin name=role ng-model=user.role>Admin</label></li><li><label class=checkboxText><input type=radio value=user name=role ng-model=user.role>Coursier</label></li></ul></div><div class=\"col-sm-4 col-md-12\"><h4>Autres</h4><ul class=coursierOthersCheckbox><li><label class=checkboxText><input type=checkbox ng-model=user.mobility> Mobility</label></li><li><label class=checkboxText><input type=checkbox ng-model=user.ag> Abonnement Général</label></li><li><label class=checkboxText><input type=checkbox ng-model=user.permis> Permis de conduire</label></li></ul></div></div><div class=text-center><button class=\"btn btn-success btn-lg\" ng-click=createCoursier(user)>Créer coursier</button></div></div><!-- container -->"
  );


  $templateCache.put('app/createCoursier/createCoursierModal.html',
    "<div class=modal-header><h3 class=modal-title>Coursier créé</h3></div><div class=modal-body><p>Nouveau coursier a été bien ajouté</p></div><div class=modal-footer><button class=\"btn btn-primary\" ng-click=cancel()>ok</button></div>"
  );


  $templateCache.put('app/createShift/createShift.html',
    "<div class=\"bg-primary text-center title\"><h3>Créer un shift</h3></div><div class=container><form class=\"form-horizontal col-md-12\"><div class=col-md-6><div class=form-group><label class=col-sm-2>Nom</label><div class=col-sm-8><input ng-model=shift.nom required class=form-control onblur=checkValidity(this)></div></div><p class=help-block ng-show=\"form.name.$error.required && submitted\">Un nom est requis</p><!-- heures du shift --><div class=\"form-group col-xs-6 col-sm-4 col-md-5\"><label>Début</label><timepicker arrowkeys=true show-meridian=false ng-model=shift.debut ng-change=\"checkHour(shift.debut, shift.fin)\" hour-step=1 minute-step=10></timepicker></div><div class=\"form-group col-xs-7 col-sm-9 col-md-8\"><label>Fin</label><timepicker arrowkeys=true show-meridian=false ng-model=shift.fin ng-change=\"checkHour(shift.debut, shift.fin)\" hour-step=1 minute-step=10></timepicker></div><br><h3 class=\"text-danger text-center\" ng-show=isFalseHour>Le début et fin se chévauchent</h3><div class=\"form-group col-xs-6\"><label class=\"col-sm-4 control-label\">Période de vailidité</label><div class=col-sm-6>De<select ng-model=shift.periodeIn><option ng-repeat=\"month in months\" value={{$index}}>{{month}}</option></select>à<select ng-model=shift.periodeOut><option ng-repeat=\"month in months\" value={{$index}}>{{month}}</option></select></div></div><div id=villesJoursShift><!-- villes --><h3>Villes</h3><ul class=villesCheckbox><li ng-repeat=\"city in cities\"><label class=checkboxText><input name=villes type=radio value={{city}} ng-model=shift.ville> {{city}}</label></li></ul></div><h3 class=\"col-md-12 col-sm-12 col-xs-12\" popover=\"Par défaut 1 par jour selectionné\" popover-placement=rigth popover-trigger=mouseenter popover-append-to-body=true>Jours de la semaine</h3><table class=\"table table-striped\"><tr><td>Jours</td><td ng-repeat=\"day in days\"><label class=checkboxText><input type=checkbox checklist-value=day checklist-model=shift.jours ng-change=enableTimes()>{{day.nom}}</label></td></tr><tr><td>Fois</td><td ng-repeat=\"day in days\"><select class=timesSelect ng-change=\"insertTimesPerDay(day.nom, times)\" ng-model=times><option selected>1</option><option>2</option><option>3</option></select></td></tr></table></div><!-- first column --><div class=col-md-6><h4>Remarques/description</h4><textarea ng-model=shift.remarques rows=4 cols=60></textarea><h3>Compétences nécessaires</h3><ul class=villesCheckbox><li ng-repeat=\"competence in competences\"><label class=checkboxText><input type=checkbox checklist-value=competence checklist-model=shift.competences ng-click=sortByCompetences(shift.competences)> {{competence}}</label></li></ul><h3>Liste des coursiers</h3><ul id=listeCoursiers><li ng-repeat=\"user in competentUsers\"><p><b># {{user.numeroCoursier}}</b>{{user.name}} {{user.prenom}}</p></li></ul></div></form><div class=text-center><button class=\"btn btn-primary btn-lg text-center\" ng-click=createShift(shift)>Créer le shift</button></div></div><!-- container -->"
  );


  $templateCache.put('app/createShift/shiftCreatedModal.html',
    "<div class=modal-header><h3 class=modal-title>Shift créé</h3></div><div class=modal-body><p>Le shift a été bien créé</p></div><div class=modal-footer><button class=\"btn btn-primary\" ng-click=cancel()>ok</button></div>"
  );


  $templateCache.put('app/createShift/shiftIncompleteModal.html',
    "<div class=modal-header><h3 class=modal-title>Erreur</h3></div><div class=modal-body><p>Vouz avez oublié de remplir tous les champs</p></div><div class=modal-footer><button class=\"btn btn-primary\" ng-click=cancel()>ok</button></div>"
  );


  $templateCache.put('app/doublonsCityDirective/doublonsCity.html',
    "<span class=shiftsDoubles ng-class=\"shift.invalidDay === true ? 'bg-warning': '' \" ng-repeat=\"shift in doubleShifts\">{{shift.timesLeft>1 ? shift.nom+\"(\"+shift.timesLeft+\")\" : shift.nom}}</span>"
  );


  $templateCache.put('app/main/main.html',
    "\r" +
    "\n" +
    " <div class=\"text-center\" ng-show=\"loading\"> <img src=\"assets/images/loading.gif\">\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "      <div class=\"theContainer\" ng-show=\"!loading\">\r" +
    "\n" +
    "        <!-- show first monthly calendar to non admin -->\r" +
    "\n" +
    "        <div ng-show=\"!showAllPlanning\">\r" +
    "\n" +
    "        \r" +
    "\n" +
    "      <div  id=\"fullCal\"></div>\r" +
    "\n" +
    "       <button  id=\"fullCalSwitch\" class=\"btn btn-primary  btn-sm\"  ng-click=\"togglePlanning()\">{{showAllPlanning != true ? 'Tous les coursiers' : \r" +
    "\n" +
    "      ''}}</button>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <!-- show all coursiers calendar to admin -->\r" +
    "\n" +
    "      <div id=\"theCalendar\" ng-show=\"showAllPlanning\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"col-md-5 col-sm-5\" id=\"monthYearSelect\">\r" +
    "\n" +
    "          <!-- select the month we are in -->\r" +
    "\n" +
    "            <select ng-model=\"month\" \r" +
    "\n" +
    "            ng-change=\"renderCalendar(month)\">\r" +
    "\n" +
    "              <option \r" +
    "\n" +
    "              ng-repeat=\"months in calendar.monthNames\" \r" +
    "\n" +
    "              value=\"{{$index}}\"  \r" +
    "\n" +
    "                ng-selected=\"calendar.monthNames[monthNum] == calendar.monthNames[$index]\">{{calendar.monthNames[$index]}}</option>\r" +
    "\n" +
    "            </select >\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <!-- select the year we are in -->\r" +
    "\n" +
    "            <select ng-model=\"year\" \r" +
    "\n" +
    "            ng-change=\"renderCalendar(monthNum,year)\">\r" +
    "\n" +
    "              <option>2014</option>\r" +
    "\n" +
    "              <option ng-selected=\"year == calendar.year\">\r" +
    "\n" +
    "              2015</option>\r" +
    "\n" +
    "              <option>2016</option>\r" +
    "\n" +
    "              <option>2017</option>\r" +
    "\n" +
    "            </select>\r" +
    "\n" +
    "  <button class=\"btn btn-primary  btn-sm\"  ng-click=\"togglePlanning()\">{{showAllPlanning == true ? 'Mon planning' : ''}}</button>\r" +
    "\n" +
    "<span id=\"searchName\">Nom &nbsp;<input class=\"searchName\" ng-model=\"search.name\"></span>\r" +
    "\n" +
    "<span># <input class=\"searchNo\" ng-model=\"search.no\" ng-change=\"searchNo(search.no)\"></span>\r" +
    "\n" +
    "              \r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "     \r" +
    "\n" +
    "        <div class=\"text-centered\" >\r" +
    "\n" +
    "         <!--  previous and next buttons (month) -->\r" +
    "\n" +
    "          <h4 class=\"col-md-3 col-sm-3 col-xs-4\" id=\"monthNavigation\"> \r" +
    "\n" +
    "             <button id=\"prevMonth\"  class=\"btn btn-success btn-sm\" ng-click=\"renderCalendar(monthNum-1)\" ><</button>\r" +
    "\n" +
    "             {{calendar.month}} {{calendar.year}}\r" +
    "\n" +
    "             <button id=\"nextMonth\"  class=\"btn btn-success btn-sm\" ng-click=\"renderCalendar(monthNum+1)\">></button>\r" +
    "\n" +
    "          </h4>       \r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    " <div class=\"col-md-4 col-sm-4 col-xs-7\" id=\"headButtons\">\r" +
    "\n" +
    "  <div class=\"dropdown\">\r" +
    "\n" +
    "    <button class=\"btn btn-success  dropdown-toggle\" type=\"button\"  data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\">\r" +
    "\n" +
    "      Dispos\r" +
    "\n" +
    "      <span class=\"caret\"></span>\r" +
    "\n" +
    "    </button>\r" +
    "\n" +
    "    <ul class=\"dropdown-menu\" aria-labelledby=\"dropdownMenu1\">\r" +
    "\n" +
    "      <li class=\"bg-info\"><a ng-click=\"toggleIsPresent()\">Dispos</a></li>\r" +
    "\n" +
    "      <li class=\"bg-warning\"><a ng-click=\"toggleNoInfo()\">No info</a></li>\r" +
    "\n" +
    "      <li class=\"bg-danger\"> \r" +
    "\n" +
    "        <a ng-click=\"toggleShiftsLevel(toggleAll)\">Nb shifts</a>\r" +
    "\n" +
    "      </li>\r" +
    "\n" +
    "      <li class=\"\"> \r" +
    "\n" +
    "        <a ng-click=\"showHiddenShifts()\">Montrer/cacher les shifts attribués</a>\r" +
    "\n" +
    "      </li>\r" +
    "\n" +
    "      <li><a ng-click=\"todaysCoursiers()\">Qui roule AJD </a></li>\r" +
    "\n" +
    "      <li><a> Qui roule le: <select ng-model=\"workingDay\" ng-change=\"whoWorksOn(workingDay, monthNum, year, $event)\"> <option ng-repeat=\"key in calendar.monthDays track by $index\"> {{$index+1}}</option></select> </a> </li>\r" +
    "\n" +
    "    </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<!--   <div class=\"dropdown\" ng-show=\"isAdmin()\">\r" +
    "\n" +
    "    <button class=\"btn btn-info dropdown-toggle \" type=\"button\"  data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\">\r" +
    "\n" +
    "      Shifts \r" +
    "\n" +
    "      <span class=\"caret\"></span>\r" +
    "\n" +
    "    </button>\r" +
    "\n" +
    "    <ul class=\"dropdown-menu text-centered wantedShifts\" aria-labelledby=\"dropdownMenu1\">\r" +
    "\n" +
    "      <li ><a ng-click=\"toggleBusy()\">Assez ou trop</a></li>\r" +
    "\n" +
    "      <li class=\"bg-danger\"><a ng-click=\"toggleLowDispo()\">Peu dispo (<3) </a> \r" +
    "\n" +
    "          <select ng-model=\"citySelected\" ng-change=\"toggleDispoLevelCity(citySelected, 'lowDispo')\" ><option ng-repeat=\"city in cities\">{{city}} </option></select>  \r" +
    "\n" +
    "      </li>\r" +
    "\n" +
    "      <li class=\"bg-info\"><a ng-click=\"toggleMediumDispo()\">Moyen dispo (>4)</a> \r" +
    "\n" +
    "            <select ng-model=\"citySelected2\" ng-change=\"toggleDispoLevelCity(citySelected2, 'mediumDispo')\" ><option ng-repeat=\"city in cities\">{{city}} </option></select>  \r" +
    "\n" +
    "      </li>\r" +
    "\n" +
    "      <li class=\"bg-success\"><a ng-click=\"toggleHighDispo()\">Très dispo (>8)</a> \r" +
    "\n" +
    "           <select ng-model=\"citySelected3\" ng-change=\"toggleDispoLevelCity(citySelected3, 'highDispo')\" ><option ng-repeat=\"city in cities\">{{city}} </option></select>   \r" +
    "\n" +
    "      </li>\r" +
    "\n" +
    "    </ul>\r" +
    "\n" +
    "  </div> -->\r" +
    "\n" +
    "   <div class=\"dropdown\">  \r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <button id=\"down\" class=\"glyphicon glyphicon-arrow-up btn\" ng-click=\"down()\"></button>\r" +
    "\n" +
    "    <input type=\"number\" class=\"searchNo\" ng-model=\"number\" ng-change=\"limitCoursiers(number)\" min=\"1\" max=\"{{coursiers.length}}\">\r" +
    "\n" +
    "    <button class=\"btn btn-sm btn-info\" ng-click=\"limitCoursiers('tous')\">Tous</button>\r" +
    "\n" +
    "   <button  id=\"up\" class=\"glyphicon glyphicon-arrow-down btn\" ng-click=\"up()\"></button>\r" +
    "\n" +
    "   <button class=\"btn btn-warning\" ng-show=\"preselectedShift\" ng-click=\"unselectShift()\">Desélectionner</button>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "      <div class=\"wrapper\">\r" +
    "\n" +
    "          <table class=\"planning shifts\">\r" +
    "\n" +
    "         <!-- colonnes pour la css et les weekends,+1 car une colonne pour users -->\r" +
    "\n" +
    "         <col></col>\r" +
    "\n" +
    "         <col class=\"column\" ng-repeat=\"numDay in calendar.monthDays track by $index\" ng-class=\"isToday($index+1, monthNum, year)\" data-dayNameCol=\"{{calendar.daysNames[$index]}}\" date=\"{{$index+1}}-{{monthNum}}-{{year}}\"/>\r" +
    "\n" +
    "         \r" +
    "\n" +
    "       <thead>\r" +
    "\n" +
    "         <!-- les jours du mois-->\r" +
    "\n" +
    "            <tr class=\"bg-active\"> \r" +
    "\n" +
    "              <th id=\"coursierTH\">Coursier|Jour</th>\r" +
    "\n" +
    "               <th class=\"monthDay\" ng-repeat=\"numDay in calendar.monthDays track by $index\" > {{$index+1}}\r" +
    "\n" +
    "               </th>\r" +
    "\n" +
    "            </tr>\r" +
    "\n" +
    "        </thead>\r" +
    "\n" +
    "        <tbody id=\"shiftsTable\">\r" +
    "\n" +
    "          <!-- rangs avec nom du coursier et les jours. On ajoute la class myRow à l'endroit de notre login id-->\r" +
    "\n" +
    "          <tr ng-repeat=\"user in coursiers | orderBy: 'numeroCoursier':reverse | filter: {name: search.name, numeroCoursier: search.no } | limitFromTo:limitFrom:limitTo\"  class=\" {{currentUser._id == user._id ? 'myRow coursierName' : ''}} \">\r" +
    "\n" +
    "              <td  class=\"coursierTD\"\r" +
    "\n" +
    "                  popover=\"Email: {{user.email}} portable: {{user.telPortable}}\"\r" +
    "\n" +
    "                   popover-placement=\"top\"\r" +
    "\n" +
    "                   popover-trigger=\"click\" \r" +
    "\n" +
    "                   popover-append-to-body=\"true\">\r" +
    "\n" +
    "                    <a href=\"#\">{{user.name}}</a> \r" +
    "\n" +
    "                    <small>#{{user.numeroCoursier}}</small>\r" +
    "\n" +
    "              </td>\r" +
    "\n" +
    "\r" +
    "\n" +
    "              <td coursier-day\r" +
    "\n" +
    "                ng-click=\"setShift($index+1, monthNum, year, user, coursier-day)\"\r" +
    "\n" +
    "                ng-repeat=\"numDay in calendar.monthDays track by $index\" \r" +
    "\n" +
    "                day =\"$index+1\" \r" +
    "\n" +
    "                month-num=\"monthNum\" \r" +
    "\n" +
    "                set-shift=\"setShift\"\r" +
    "\n" +
    "                year=\"year\"\r" +
    "\n" +
    "                check-dispo=\"checkDispo\" \r" +
    "\n" +
    "                user=\"{_id: user._id, dispos: user.dispos, name: user.name, competences: user.competences}\"\r" +
    "\n" +
    "                month-year = \"monthYear\"\r" +
    "\n" +
    "                return-attributions=\"returnAttributions\"\r" +
    "\n" +
    "                date=\"{{$index+1}}-{{monthNum+1}}-{{year}}\"\r" +
    "\n" +
    "                 > \r" +
    "\n" +
    "              </td> \r" +
    "\n" +
    "           </tr>\r" +
    "\n" +
    "           </tbody>\r" +
    "\n" +
    "\r" +
    "\n" +
    "   \r" +
    "\n" +
    "          <!--  MANQUES PAR VILLE -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <tbody  ng-repeat=\"city in cities\">\r" +
    "\n" +
    "        <tr class=\"cityManquesHeader\" >\r" +
    "\n" +
    "          <th colspan=\"{{calendar.monthDays.length+1}}\" >  \r" +
    "\n" +
    "            {{city}}\r" +
    "\n" +
    "          </th> \r" +
    "\n" +
    "        </tr>\r" +
    "\n" +
    "      <tr>\r" +
    "\n" +
    "        <td ng-class=\" 'manques'+city \" ng-click=\"toggleCityDispos(city, $event)\">Manques</td>\r" +
    "\n" +
    "            <td \r" +
    "\n" +
    "                  manques-city\r" +
    "\n" +
    "                  ng-repeat=\"day in calendar.monthDays track by $index\"\r" +
    "\n" +
    "                   day=\"$index\"\r" +
    "\n" +
    "                   month-num=\"monthNum\"\r" +
    "\n" +
    "                   year=\"year\"\r" +
    "\n" +
    "                  return-attributions=\"returnAttributions\"\r" +
    "\n" +
    "                   city=\"city\"\r" +
    "\n" +
    "                   month-year=\"monthYear\"       \r" +
    "\n" +
    "                   daily-shifts=\"dailyShifts\"\r" +
    "\n" +
    "                  show-potential-coursiers=\"showPotentialCoursiers\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </td>\r" +
    "\n" +
    "          </tr>\r" +
    "\n" +
    "      </tbody>\r" +
    "\n" +
    "          <tbody>\r" +
    "\n" +
    "          <tr>\r" +
    "\n" +
    "            <tr class=\"cityManquesHeader\" ng-click=\"slideManques($event)\"><th colspan=\"{{calendar.monthDays.length+1}}\" >Doublons</th></tr>\r" +
    "\n" +
    "\r" +
    "\n" +
    "      \r" +
    "\n" +
    "            <tr>\r" +
    "\n" +
    "                <td>Doublons</td>\r" +
    "\n" +
    "                  <td doublons-city\r" +
    "\n" +
    "                   ng-repeat=\"day in calendar.monthDays track by $index\"\r" +
    "\n" +
    "                   day=\"$index\"\r" +
    "\n" +
    "                   return-attributions=\"returnAttributions\"\r" +
    "\n" +
    "                   month-num=\"monthNum\"\r" +
    "\n" +
    "                   year=\"year\"\r" +
    "\n" +
    "                   city=\"city\"\r" +
    "\n" +
    "                   month-year=\"monthYear\"       \r" +
    "\n" +
    "                   daily-shifts=\"dailyShifts\"></td>\r" +
    "\n" +
    "              </tr>\r" +
    "\n" +
    "         </tbody>\r" +
    "\n" +
    "    </table>\r" +
    "\n" +
    "\r" +
    "\n" +
    " \r" +
    "\n" +
    "      </div> <!-- calendar -->\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('app/main/setShiftModal.html',
    "<div class=modal-body><p>À: <b>&nbsp;{{coursier.prenom}} {{coursier.name}}</b></p><p>Pour le <b>{{date | amDateFormat: \"dddd D MMMM YYYY\"}}</b></p><p>Dispo de: <b>{{dispoStart | amDateFormat: \"H:mm\"}}</b> à <b>{{dispoEnd | amDateFormat: \"H:mm\"}}</b></p><b ng-show=wait>attendez...</b><p ng-show=!wait ng-class=\"attributed == shiftsWeekly || attributed > shiftsWeekly ? 'bg-danger' : '' \">Nombre de shifts souhaités : <b>{{attributed}}/{{shiftsWeekly}}</b></p><p ng-show=\"shifts.length == 1\">Pas de shift adéquat trouvé</p><p ng-show=noDispo><b>Pas de dispo trouvée!</b></p><p>Selectionnez un shift &nbsp;<select size=9 multiple class=form-control ng-options=\"shift as shift.nom group by shift.ville for shift in shifts\" ng-model=selectedShift></select></p><button ng-show=\"selectedShift.length > 0\" class=\"btn btn-success\" ng-click=\"attribuer(selectedShift, coursier, date, null)\" aria-label=Remove>Attribuer</button><p>Tous les shifts<select class=form-control ng-options=\"shift as shift.nom group by shift.ville  for shift in allShifts track by shift._id\" ng-model=otherShift></select></p><button ng-show=otherShift class=\"btn btn-success\" ng-click=\"attribuer(null, coursier, date, otherShift)\" aria-label=Remove>Attribuer</button><div ng-show=\"attributedShifts.length > 0\" class=text-centered><p>Enlever un shift<select class=form-control ng-options=\"shift as shift.nom group by shift.ville for shift in attributedShifts track by shift._id\" ng-model=attributedShift></select></p><button ng-show=attributedShift class=\"btn btn-danger btn-sm\" ng-click=\"deleteShift(coursier, date, attributedShift)\">Enlever</button></div></div><div class=text-center><button style=margin-bottom:10px class=\"btn btn-info\" ng-click=close()>Annuler</button></div>"
  );


  $templateCache.put('app/main/shiftsPerDay.html',
    "<td ng-repeat=\"day in [] | range: calendar.days\"><span class=shiftParJour ng-repeat=\"shift in sortShiftByDayOfWeek(null, day+1, monthNum,year)\">{{shift.nom}} - {{shift.times}}</span></td>"
  );


  $templateCache.put('app/manquesDirective/manques.html',
    "<div class=\"scrollable\"><p ng-repeat=\"daShift in checkedShifts\" \r" +
    "\n" +
    "\tng-click =\"showPotentialCoursiers(day+1, monthNum, year, daShift, $event)\" \r" +
    "\n" +
    "   class=\"shiftsByCity\"  \r" +
    "\n" +
    "   ng-class=\"daShift.enough !=true ? 'bg-danger' : 'shiftHidden' \" > \r" +
    "\n" +
    "      {{daShift.ville == city ? ( daShift.timesLeft <= 1 ? daShift.nom : daShift.nom+\"(\"+daShift.timesLeft+\")\"    )  : null }}\r" +
    "\n" +
    "\r" +
    "\n" +
    "      </p>  \r" +
    "\n" +
    "    </div>"
  );


  $templateCache.put('app/monthYear/monthYear.html',
    "<div class=\"bg-primary text-center title\"><h3>Ouverture/fermeture des mois</h3></div><div class=col-md-12><div class=container><table class=\"table table-striped table-bordered\"><thead><tr><th class=shiftsHeaders>Mois /<select ng-model=year ng-change=getMonthYears(year)><option ng-repeat=\"year in years\" value={{year}} ng-selected=\"year == currentYear\">{{year}}</option></select></th><th class=shiftsHeaders>Status</th><th class=shiftsHeaders>Action</th></tr></thead><tbody><tr ng-repeat=\"month in monthYears | orderBy: 'monthNum' \"><td>{{month.monthName}}</td><td><span ng-class=\"month.active===true ? 'bg-success text-success' : '' \">{{month.active === true ? 'Ouvert' : 'Fermé'}}</span></td><td><span ng-show=\"isAnterior(month) == true\" c lass=\"btn btn-sm \">Passé</span> <button ng-show=\"month.active == false && isAnterior(month) == false\" class=\"btn btn-sm btn-success\" ng-click=openMonth(month)>Ouvrir</button> <button ng-show=\"month.active == true  && isAnterior(month) == false\" class=\"btn btn-sm btn-danger\" ng-click=closeMonth(month)>Fermer</button></td></tr></tbody></table></div></div>"
  );


  $templateCache.put('app/sendDispos/disposSent.html',
    "<div class=modal-header><h3 class=modal-title>Dispos envoyées</h3></div><div class=modal-body><p>Tes disponibilités ont été bien envoyées</p></div><div class=modal-footer><button class=\"btn btn-primary\" ng-click=cancel()>Aller au planning</button> <button class=\"btn btn-warning\" ng-click=close()>Fermer</button></div>"
  );


  $templateCache.put('app/sendDispos/sendDispos.html',
    "<div ui-view=\"\"><div class=container ng-keypress=checkCity($event)><div class=\"col-lg-3 col-md-3 row\"><div class=\"col-lg-12 col-md-12 col-sm-6\"><button ng-click=\"toggleDispoType('absent')\" type=button class=\"btn btn-lg\" ng-class=\"{'btn-danger selected': !dispoType}\">Absence</button> <button ng-click=\"toggleDispoType('present')\" type=button class=\"btn btn-lg\" ng-class=\"{'btn-info selected': dispoType}\">Présence</button><h4 class=bg-danger ng-show=monthClosedInfo.show>Le mois de {{monthClosedInfo.name}} est fermé</h4><label>Nombre souhaité de shifts</label><input id=shiftsWeek ng-show=forgotShiftsWeek ng-focus=true type=number name=shiftsWeek class=form-control ng-model=shiftsWeek min=0 required><h4 ng-show=!forgotShiftsWeek class=bg-warning>Shifts pour cette semaine: <span editable-number=dispos[monthYear][week].shiftsWeek onbeforesave=inputShiftsWeek($data)>{{dispos[monthYear][week].shiftsWeek }}</span></h4><button ng-show=forgotShiftsWeek class=\"btn btn-sm btn-success col-md-12\" ng-click=inputShiftsWeek(shiftsWeek)>Ok</button><h4 ng-show=forgotShiftsWeek class=\"bg-warning text-danger\">Mets tes shifts par semaine!</h4><br><h4 ng-show=isBefore class=bg-danger>Tu peux pas sélectionner une data antérieure à aujourd'hui</h4><h4 ng-show=drag class=bg-danger>Sorry, pas de sélection sur plusieurs jours</h4><br><label>Remarques</label><textarea ng-show=\"forgotRemarques || dispos[monthYear][week].remarques == '' \" name=remarques class=form-control ng-model=remarques placeholder=\"pas de remarques\"></textarea><button ng-show=\"forgotRemarques || !dispos[monthYear][week].remarques\" class=\"btn btn-sm btn-success col-md-12\" ng-click=inputRemarques(remarques)>Ok</button><h5 ng-show=dispos[monthYear][week].remarques class=bg-warning><span editable-text=dispos[monthYear][week].remarques onbeforesave=inputRemarques($data)>{{dispos[monthYear][week].remarques}}</span></h5><h4 ng-show=forgotRemarques class=\"bg-warning text-danger\">Mets tes remarques!</h4></div><!-- dispo cities --><div class=\"col-sm-4 col-md-12\"><h3>Villes</h3><div class=checkbox ng-repeat=\"city in cities\"><label><input type=checkbox checklist-value=city checklist-model=villes> {{city}}</label></div><h4 ng-show=forgotCity class=\"bg-warning text-danger\">Sélectionne une ville!</h4></div><button type=button class=\"btn btn-primary\" ui-sref=\"sendDispos.verify({dispos : dispos})\">Confirmation</button></div><div class=\"col-lg-7 col-md-7\"><div id=calendar ui-calendar=calendarConfig.calendarDispos ng-model=eventSources calendar=myCalendar></div></div><div class=\"weekTable col-lg-2\"><table class=\"table table-striped table-bordered verifyTable\" ng-repeat=\"dispo in weekDispos | orderBy: 'start' \"><tr><!-- dispo date --><td>Le</td><td><strong>{{dispo.start | amDateFormat:'dd D MMM YYYY'}} <strong></strong></strong></td></tr><tr ng-show=\"{{dispo.title == 'Dispo'}}\"><!-- dispo starting time --><td>Début</td><td>{{ dispo.start | amDateFormat:'HH:mm'}}</td></tr><tr ng-show=\"{{dispo.title == 'Dispo'}}\"><!-- dispo ending time --><td>Fin</td><td>{{ dispo.end | amDateFormat:'HH:mm'}}</td></tr><tr ng-show=\"{{dispo.title == 'Dispo'}}\"><!-- dispo's cities, comma separated--><td>Villes</td><td><span city={{ville}} ng-repeat=\"ville in dispo.villes\">{{ville}}{{$last ? '' : ', '}}</span></td></tr><tr ng-show=\"{{dispo.title == 'Absent'}}\"><td colspan=2 class=text-center><strong class=text-danger>Absent</strong></td></tr></table></div></div></div>"
  );


  $templateCache.put('app/sendDispos/verifyDispos.html',
    "<div class=container><div><button class=\"col-md-1 btn-info button btn\" ng-click=back()>Retour</button><!-- \t<button   ng-show=\"!noDispos\" \tclass=\"btn-success btn\" ng-click=\"sendDispos(dispos)\">Envoyer</button> --><h1 class=text-center ng-show=!noDispos>Confirmation</h1></div><!-- if noDispos = true, you didn't fill your dispos --><h1 ng-show=noDispos class=\"text-center text-danger\">Peut-être remplis d'abord tes dipos?</h1><section class=\"disponibilites col-md-12\"><div class=col-md-3 ng-repeat=\"week in weeks\"><h3>Semaine {{$index+1}}</h3><div class=week><h4>Du {{names[$index]}}</h4><p class=\"{{week.shiftsWeek == null ? 'text-danger' : ''}}\"><label>Shifts souhaités:&nbsp;</label>{{week.shiftsWeek == null ? \"Attention, t'as oublié!\" : week.shiftsWeek}}</p><p><label>Remarques:&nbsp;</label>{{week.remarques == null ? 'Pas de remarques' : week.remarques}}</p><h2>Horaire</h2><table class=\"table table-striped table-bordered verifyTable\" ng-repeat=\"dispo in week.dispos | orderBy: 'start' \"><tr><!-- dispo date --><td>Le</td><td><strong>{{dispo.start | amDateFormat:'dddd DD MMMM YYYY'}} <strong></strong></strong></td></tr><tr ng-show=\"{{dispo.title == 'Dispo'}}\"><!-- dispo starting time --><td>Début</td><td>{{ dispo.start | amDateFormat:'HH:mm'}}</td></tr><tr ng-show=\"{{dispo.title == 'Dispo'}}\"><!-- dispo ending time --><td>Fin</td><td>{{ dispo.end | amDateFormat:'HH:mm'}}</td></tr><tr ng-show=\"{{dispo.title == 'Dispo'}}\"><!-- dispo's cities, comma separated--><td>Villes</td><td><span ng-repeat=\"ville in dispo.villes\">{{ville}}{{$last ? '' : ', '}}</span></td></tr><tr ng-show=\"{{dispo.title == 'Absent'}}\"><td colspan=2 class=text-center><strong class=text-danger>Absent</strong></td></tr></table></div></div></section></div>"
  );


  $templateCache.put('app/shiftDetails/shiftDetails.html',
    "<div class=\"bg-primary text-center title\"><h2>Détails du shift</h2></div><div class=container><div class=col-md-6><p><label>Nom du shift: &nbsp;</label><span onaftersave=editName($data) editable-text=shift.nom>{{shift.nom}}</span></p><p><label>Début:&nbsp;</label><span onaftersave=editStart($data) editable-bstime=shift.debut e-show-meridian=false e-minute-step=10>{{shift.debut | amDateFormat:'H:mm'}}</span></p><p><label>Fin:&nbsp;</label><span onaftersave=editEnd($data) editable-bstime=shift.fin e-show-meridian=false e-minute-step=10>{{shift.fin | amDateFormat:'H:mm'}}</span></p><p><label>Description:&nbsp;</label>{{shift.remarques}}</p><h4>Jours</h4><ul><li ng-repeat=\"jour in shift.jours | orderBy: reverse\">{{jour.nom}} - {{jour.times}} fois</li></ul></div><div class=col-md-6><h4>Ville</h4><p onaftersave=editCity($data) editable-select=shift.ville e-ng-options=\"ville as ville for ville in villes\">{{shift.ville}}</p><p><h4>Coursiers capables</h4><ul><li ng-repeat=\"coursier in coursiers\">{{coursier.name}} {{coursier.prenom}}</li></ul><h4>Competences</h4><ul><li ng-repeat=\"competence in shift.competences\">{{competence}}</li></ul></p></div></div><div class=\"text-center back\"><button ng-click=back() class=\"btn btn-info btn-lg\">Retour</button></div>"
  );


  $templateCache.put('app/shifts/shifts.html',
    "<div ui-view=\"\"><div class=\"bg-primary text-center title\"><h3>Liste des shifts</h3></div><div class=container><label>Recherche &nbsp;<input ng-model=searchShift.nom class=form-control></label><table class=\"table table-striped table-bordered\"><tr><th class=shiftsHeaders>Nom du shift</th><th class=shiftsHeaders>Début</th><th class=shiftsHeaders>Fin</th><th class=shiftsHeaders>Ville</th><th class=shiftsHeaders>Compétence requise</th><th class=shiftsHeaders>Jours</th></tr><tr ng-repeat=\"shift in shifts | filter: searchShift\"><td><a class=shiftName ui-sref=shifts.details({shiftId:shift._id})>{{shift.nom.length > 0 ? shift.nom : \"Pas de nom\"}}</a></td><td>{{shift.debut | amDateFormat:'H:mm'}}</td><td>{{shift.fin | amDateFormat:'H:mm'}}</td><td>{{shift.ville}}</td><td><span ng-repeat=\"com in shift.competences \">{{com}}{{$last ? '' : ', '}}</span></td><td><span ng-repeat=\"jour in shift.jours | orderBy:'id'\">{{jour.nom}}{{$last ? '' : ', '}}</span></td></tr></table></div></div>"
  );


  $templateCache.put('components/footer/footer.html',
    "<footer class=footer><div class=container><p>Vélocité 2015</p></div></footer>"
  );


  $templateCache.put('components/modal/modal.html',
    "<div class=modal-header><button ng-if=modal.dismissable type=button ng-click=$dismiss() class=close>&times;</button><h4 ng-if=modal.title ng-bind=modal.title class=modal-title></h4></div><div class=modal-body><p ng-if=modal.text ng-bind=modal.text></p><div ng-if=modal.html ng-bind-html=modal.html></div></div><div class=modal-footer><button ng-repeat=\"button in modal.buttons\" ng-class=button.classes ng-click=button.click($event) ng-bind=button.text class=btn></button></div>"
  );


  $templateCache.put('components/navbar/navbar.html',
    "<div class=\"navbar navbar-default navbar-static-top\" ng-controller=NavbarCtrl><div class=container><div class=navbar-header><button class=navbar-toggle type=button ng-click=\"isCollapsed = !isCollapsed\"><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button><h4 class=userNameNav>{{getCurrentUser().name }}</h4></div><div collapse=isCollapsed class=\"navbar-collapse collapse\" id=navbar-main><ul class=\"nav navbar-nav\"><li ng-hide=!isLoggedIn() ng-click=toggleCollapse() ng-class=\"{active: isActive('/planningCoursier')}\"><a ng-href=/planningCoursier>Planning</a></li><li ng-hide=!isLoggedIn() ng-click=toggleCollapse() ng-class=\"{active: isActive('/sendDispos')}\"><a ng-href=/sendDispos ng-click=toggleCollapse()>Envoyer mes dispos</a></li><li ng-show=isAdmin() ng-click=toggleCollapse() ng-class=\"{active: isActive('/monthYear')}\"><a ng-href=/monthYear>Les mois</a></li><li ng-show=isAdmin() ng-click=toggleCollapse() ng-class=\"{active: isActive('/coursierss')}\"><a href=/coursiers>Les coursiers</a></li><li ng-hide=!isLoggedIn() ng-click=toggleCollapse() ng-class=\"{active: isActive('/shifts')}\"><a href=/shifts>Les shifts</a></li><li ng-show=isAdmin() ng-click=toggleCollapse() ng-class=\"{active: isActive('/createShift')}\"><a href=/createShift>Créer un shift</a></li><li ng-show=isAdmin() ng-click=toggleCollapse() ng-class=\"{active: isActive('/createCoursier')}\"><a href=/createCoursier>Créer un coursier</a></li></ul><ul class=\"nav navbar-nav navbar-right\"><li ng-hide=isLoggedIn() ng-class=\"{active: isActive('/login')}\"><a href=/login>Login</a></li><li ng-show=isLoggedIn() ng-class=\"{active: isActive('/settings')}\"><a href=/settings><span class=\"glyphicon glyphicon-cog\"></span> Mon compte</a></li><li ng-show=isLoggedIn() ng-class=\"{active: isActive('/logout')}\"><a href=\"\" ng-click=logout()>Logout</a></li></ul></div></div></div>"
  );

}]);


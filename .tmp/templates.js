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

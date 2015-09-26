var app = angular.module('myApp', ['firebase']);
app.factory('Profile', ['$firebaseObject', function($firebaseObject){
	return function(username){
		var URL = "https://myapplicationtest.firebaseio.com/";
		var ref = new Firebase(URL);
		var profileRef = ref.child('profile').child(username);
		return $firebaseObject(profileRef);
	}
}])

app.factory('Messages', ['$firebaseArray', function($firebaseArray){
	return function(){
		var URL = "https://myapplicationtest.firebaseio.com/"
		var ref = new Firebase(URL + "/messages")
		var query = ref;
		return $firebaseArray(query)
	}
}])

app.factory('Auth', ['$firebaseAuth', function($firebaseAuth){
	var URL = "https://myapplicationtest.firebaseio.com/";
	var ref = new Firebase(URL);
	return $firebaseAuth(ref);
}])

app.controller('myController', ['$scope', 'Profile', 'Messages','Auth', '$window', function($scope, Profile, Messages, Auth, $window){
	$scope.messages = Messages()
	Messages().$loaded().then(function(x){console.log('Did it!')})

	$scope.addMessage = function(){
		$scope.messages.$add({
			text: $scope.messageText,
			time: Firebase.ServerValue.TIMESTAMP,
			date: Date()
		}).then(function(x){
			console.log("Record " + x.key()  + " Added!");
		})
		$scope.messageText = "";
	}

	$scope.createUser = function(){
		$scope.message = null;
		$scope.error = null;

		Auth.$createUser({
			email: $scope.email,
			password: $scope.password
		}).then(function(userData){
			$scope.message = "User created with uid: " + userData.uid;
		}).catch(function(error){
			$scope.error = error;
		});
	}

	$scope.login = function(){
		console.log("Dicks")
		Auth.$authWithPassword({
			email: $scope.signInEmail,
			password: $scope.signInPassword
		}).then(function(authData){
			console.log(authData);
		}).catch(function(error){
			$scope.error = error;
		})
	}

	Auth.$onAuth(function(authData){
		if(!authData){
			return null;
		}else{
			$scope.authData = authData;
		}
	})

	Profile('dada5714').$bindTo($scope, "profile");
}])
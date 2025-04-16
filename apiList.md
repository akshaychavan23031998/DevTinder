**Express Router :-**

so in this here we are writting all API's in one single file of APP.JS which is not a good thing to do, so we will use Express router, so that we can easily manage all routers properly.

**authRouter :-**

POST 	==>>  /Signup

POST 	==>>  /Login

POST 	==>>  /Logout

**profileRouter :-**

GET		==>>  /profile/view

PATCH	==>>  /profile/edit

PATCH	==>>  /profile/password ==>> HW

**connectionRequestRouter :-**

POST	==>>  /request/send/interested/:userid

POST	==>>  /request/send/ingnore/:userid

can i make interested & ingnored as dynamic by creating single one API ? yes by passing left ingnored and right swipe interested

**POST	==>>  /request/send/:status/:userid**

POST	==>>  /request/review/accepted/:requestid

POST	==>>  /request/review/rejected/:requestid

can i make accepted & rejectedas dynamic by creating single one API ? Yes we can, and we did it similarly in case of the request API

**POST	==>>  /request/review/:status/:requestid**

**userRouter :-**

GET		==>>  /user/request/received

GET		==>>  /connections

GET		==>>  /feed	=>> Get the profile of other users on platform.

**STATUS: interested, ingnored,accepted,rejected**


Now rahul has 3 connections ==>> akshay, aishu and ramanna.

Now aishu accepted request of Akshay, and rahul accepted the connection of akshay, means inakshay's connection aishu and rahul should be there as a connections, ==>> Perfectly working.

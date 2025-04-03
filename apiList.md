
**Express Router :-**

so in this here we are writting all API's in one single file of APP.JS which is not a good thing to do, so we will use Express router, so that we can easily manage all routers properly.



**authRouter :-**

POST 	==>>  /Signup

POST 	==>>  /Login

POST 	==>>  /Logout


**profileRouter :-**

GET		==>>  /profile/view

PATCH	==>>  /profile/edit

PATCH	==>>  /profile/password


**connectionRequestRouter :-**

POST	==>>  /request/send/interested/:userid

POST	==>>  /request/send/ingnore/:userid

POST	==>>  /request/review/accepted/:requestid

POST	==>>  /request/review/rejected/:requestid


**userRouter :-**

GET		==>>  /connections

GET		==>>  /requests/received

GET		==>>  /feed	=>> Get the profile of other users on platform.


**STATUS: interested, ingnore,accepted,rejected**

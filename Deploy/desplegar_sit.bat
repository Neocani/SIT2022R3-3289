move .\CloudAppPublisher .\SIT_v2022R3\CloudAppPublisher

copy .\cloudapplauncher.js /Y .\SIT_v2022R3\js\cloudapplauncher.js

swa deploy .\SIT_v2022R3 --env Production --verbose -d 97b1fc9a35fa38306cc6d42d55a8383b6f492cb6b2fdf70f6f57a501c37d2dc204-6d296441-96f0-422b-bc6f-e80a0cdeec1300f0409012d1e60f
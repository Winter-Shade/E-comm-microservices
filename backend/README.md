THIS IS THE BACKEND MICROSERVICES FOLDER WITH AN API GATEWAY

THERE ARE 5 SERVICES: 
- auth
- user
- product
- cart
- order
AND AN API GATEWAY WHICH LINKS THESE SERVICES WITH THE FRONTEND


DOWNLOAD NODE MODULES FOR EACH FOLDER USING : `npm install`

CREATE A  `.env` FILE IN EACH MICROSERVICE FOLDER (USING THE  `.env.example`)

THEN RUN EITHER  `npm run start` OR `npm run dev` 
RUN EACH SERVICE & THE API GATEWAY ON A SEPARATE TERMINAL 

RUN THE API GATEWAY FIRST SO THAT SERVICES CAN CONNECT WITH THE API GATEWAY


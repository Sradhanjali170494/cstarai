# Setup local repo

> git clone https://github.com/Sradhanjali170494/cstarai.git

> cd cstarai

# Connect to Backend for Postgresql Database

> cd backend

> npm i

> add the PostgreSql database connection in '.env' file

> check the database migrations tables model structure in 'prisma/schema.prisma' file and run this command to migrate the tables into the PostgreSql database

  npx prisma migrate dev --name init

> check the tables are added to the PostgreSql database and run this command
 
 node server.js

 > Execute the backend apis in below link
http://localhost:8000/graphql


# Run the frontend app in web

> cd frontend

> npm i

> we can update above backend api link in 'constants.js' page.

> npm run web


# Make changes to repo

> git pull

> git add .

> git commit -m 'add your comment'

> git push origin main
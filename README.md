# Node.js Express, Sequelize & PostgreSQL: CRUD Rest APIs

For more detail, please visit:
> [Node.js CRUD Rest APIs with Express, Sequelize & PostgreSQL example](https://bezkoder.com/node-express-sequelize-postgresql/)

Fullstack:
> [Vue.js + Node.js + Express + PostgreSQL example](https://bezkoder.com/vue-node-express-postgresql/)

> [Angular + Node.js + Express + PostgreSQL example](https://bezkoder.com/angular-node-express-postgresql/)

> [React + Node.js + Express + PostgreSQL example](https://bezkoder.com/react-node-express-postgresql/)

## Project setup
```
npm install
```

### Run
```
node server.js
```
#   B e y o n d A P I 
 
 

echo "# BeyondAPI" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:Danielmadi/BeyondAPI.git
git push -u origin main


sudo pm2 start app.js

PM2 list
PM2 show app 
pm2 stop processA
pm2 delete processA

sudo lsof -t -i:8080    //STOP SERVER ON PORT
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080   //Redirect port to 80
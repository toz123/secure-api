const config = require('./config');
const app = require('./app')();

// Configuration checks...
if (!config.jwtSecret) {
  throw new Error('JWT_SECRET is not defined!');
}

const port = process.env.PORT || 8001;

app.listen(port, () => {
  console.log('Listening...');
});

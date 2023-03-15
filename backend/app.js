import express from 'express';
import mongoose from 'mongoose';
import router from './routes/user-routes';
const app = express();
app.use(express.json());
app.use("/api/user", router);

mongoose.connect('mongodb://localhost:27017/socialmediaapi')
.then(() => app.listen(2000))
.then(() => console.log('Connected to Database and Listening to localhost 5000'))
.catch((err) => console.log(err));
app.use('/api', (req, res, next) => {
	res.send('Hello World');
})

app.listen(6000);
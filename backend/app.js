import express from 'express';
import mongoose from 'mongoose';
import blogRouter from './routes/blog-routes';
import router from './routes/user-routes';
import chalk from 'chalk';
const app = express();
app.use(express.json());
app.use("/api/user", router);
app.use("/api/blog", blogRouter);

mongoose.connect('mongodb://localhost:27017/socialmediaapi'+ 'replicaSet=rs', { useNewUrlParser: true })
.then(() => app.listen(2000))
.then(() => console.log(chalk.cyan('Connected ') + 'to ' + chalk.green('MongoDB ') + 'and listening' + chalk.blue(' @ http://localhost 5000')))
.catch((err) => console.log(err));
app.use('/api', (req, res, next) => {
	res.send('Hello World');
})

app.listen(6000);
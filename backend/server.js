require('dotenv').config({ path: require('path').resolve(__dirname, 'config/config.env') });
const app = require('./app');
const databaseConnect = require('./config/database');
const cloudinary = require('cloudinary').v2;

// cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const port = process.env.PORT || 5000;

const startServer = async () => {
   try {
       const data = await databaseConnect();
       console.log(`Database connected to ${data.connection.host}`);

       app.listen(port, () => {
           console.log(`Server started at port:${port}`);
       });
   } catch (error) {
       console.error(`Database connection failed: ${error.message}`);
       process.exitCode = 1;
   }
};

startServer();
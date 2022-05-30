const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { environment } = require('./config');
const isProduction = environment === 'production';
const { ValidationError } = require('sequelize');
const { MulterError } = require('multer');

const routes = require('./routes');

const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
}


// helmet helps set a variety of headers to better secure your app
app.use(
    helmet.crossOriginResourcePolicy({ 
      policy: "cross-origin" ,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false,
    })
);


// Set the _csrf token and create req.csrfToken method
app.use(
    csurf({
      cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true
      }
    })
);

app.use(routes);


//Error handling middlewares

// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = ["The requested resource couldn't be found."];
  err.status = 404;
  next(err);
});


// Process sequelize errors
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    err.errors = err.errors.map((e) => e.message);
    err.title = 'Validation error';
  }
  next(err);
});

app.use((err, _req, res, next) => {
  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      err.message = 'File size cannot exceed 10MB.';
    }
    err.title = 'File upload error';
    err.errors = { trackFile: `${error.message}` };
  }
  res.status(400).send(err);
});

// Error formatter
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});





module.exports = app;
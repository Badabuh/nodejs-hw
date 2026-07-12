import 'dotenv/config';

const errorHandler = (err, req, res) => {
  if (process.env.DEPLOYMENT_ENV === 'development') {
    console.error(err.stack);
    res.status(500).json({
      message: err.message,
      stack: err.stack
    });
  }
  if (process.env.DEPLOYMENT_ENV === 'production') {
    res.status(500).json({
      message: 'Internal Server Error'
    });
  }
};

export default errorHandler;

const httpLogger = require("./winstoneLogger");
const formatHTTPLoggerResponse = require("./httpRequestFormatter");

const responseInterceptor = (
    req,
    res,
    next
  ) => {
  
    // Save the original response method
    const originalSend = res.send;
  
    let responseSent = false;
  
    // Override the response method
    res.send = function (body) {
  
      if (!responseSent) {
        if (res.statusCode < 400) {
          httpLogger.info(
            'Success',
            formatHTTPLoggerResponse(req, res, body)
          );
        } else {
          httpLogger.error(
            body.message,
            formatHTTPLoggerResponse(req, res, body)
          );
        }
  
        responseSent = true;
      }
  
      // Call the original response method
      return originalSend.call(this, body);
    };
  
    // Continue processing the request
    next();
  };

  module.exports = responseInterceptor;
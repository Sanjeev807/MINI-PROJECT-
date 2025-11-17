const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatTimestamp() {
    return new Date().toISOString();
  }

  writeToFile(level, message, data = null) {
    const timestamp = this.formatTimestamp();
    const logEntry = {
      timestamp,
      level,
      message,
      ...(data && { data })
    };

    const logLine = JSON.stringify(logEntry) + '\n';
    const logFile = path.join(this.logDir, `${new Date().toISOString().split('T')[0]}.log`);
    
    fs.appendFile(logFile, logLine, (err) => {
      if (err) {
        console.error('Failed to write to log file:', err);
      }
    });
  }

  info(message, data = null) {
    const timestamp = this.formatTimestamp();
    console.log(`[${timestamp}] [INFO] ${message}`);
    this.writeToFile('INFO', message, data);
  }

  error(message, error = null) {
    const timestamp = this.formatTimestamp();
    console.error(`[${timestamp}] [ERROR] ${message}`);
    this.writeToFile('ERROR', message, error ? {
      message: error.message,
      stack: error.stack,
      ...(error.code && { code: error.code })
    } : null);
  }

  warn(message, data = null) {
    const timestamp = this.formatTimestamp();
    console.warn(`[${timestamp}] [WARN] ${message}`);
    this.writeToFile('WARN', message, data);
  }

  debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = this.formatTimestamp();
      console.debug(`[${timestamp}] [DEBUG] ${message}`);
      this.writeToFile('DEBUG', message, data);
    }
  }

  request(req, res, duration) {
    const timestamp = this.formatTimestamp();
    const method = req.method;
    const url = req.url;
    const statusCode = res.statusCode;
    const userAgent = req.get('User-Agent') || 'Unknown';
    const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 'Unknown';
    const contentLength = res.getHeader('Content-Length') || 0; // Use getHeader instead of get

    const message = `${ip} "${method} ${url}" ${statusCode} ${contentLength} "${userAgent}" ${duration}ms`;
    console.log(`[${timestamp}] [REQUEST] ${message}`);
    
    this.writeToFile('REQUEST', message, {
      ip,
      method,
      url,
      statusCode,
      userAgent,
      duration,
      contentLength
    });
  }
}

module.exports = new Logger();
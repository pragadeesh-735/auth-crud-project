import winston from 'winston'
import 'winston-daily-rotate-file'

const logDir = 'logs'

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  level: 'error',
  filename: `${logDir}/%DATE%-error.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
})

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(
      info => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),
    dailyRotateFileTransport
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: `${logDir}/exceptions.log` })
  ],
  exitOnError: false
})

export default logger

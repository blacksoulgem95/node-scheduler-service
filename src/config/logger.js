import winston from "winston";
import path from "path";
import DatadogSupport from "winston-datadog";

const loggingPath = process.env.LOGGING_PATH || path.join(__dirname, "/logs");
const instanceName = process.env.INSTANCE_NAME || "default";

const options = {
    file: {
        level: 'info',
        filename: path.join(loggingPath, `/scheduler-${instanceName}.log`),
        handleExceptions: true,
        json: false,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
        timestamp: true
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        timestamp: true,
        colorize: true
    },
    datadog: {
        api_key: process.env.DATADOG_APIKEY || "",
        app_key: process.env.DATADOG_APPKEY || ""
    }
};

export default winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(log => {
            return `${log.timestamp} ${log.level} ------ ${log.message}`;
        })
    ),
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console),
        new DatadogSupport(options.datadog)
    ],
    exitOnError: false
});

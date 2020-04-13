/* Module Imports */
import express, { Application, Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import xml from 'xml2js';
import covid19ImpactEstimator from '../../estimator';

const app: Application = express();
const port: number = parseInt(process.env.PORT as string, 10) || 3000;

/* Interface defined for the log entry object */
interface logEntryObject {
  method: string;
  path: string;
  status: number;
  duration: string;
}

const logFile = path.resolve(__dirname, '../', 'logs.json');
let logs: logEntryObject[] = [];

/* Middleware for parsing user input*/
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* XML Builder to convert response to xml */
const builder = new xml.Builder({
  renderOpts: { pretty: false }
});

/**
 * This function writes the details of the request response cycle including
 * the `method`, the `path`, the `status` and the `duration` in millisecs
 * into a json file after pushing it first into an array in memory
 * @param {bigint} start the time when the request was received by the server
 * @param {Request} req the request object
 * @param {Response} res the response object
 * @returns {void} `void`
 */
const writeLogs = (start: bigint, req: Request, res: Response) => {
  const reqResCycleDiff = calculateDiffInReqResCycle(start);
  const normalizedReqResCycleDiff =
    reqResCycleDiff < 10 ? `0${reqResCycleDiff}` : `${reqResCycleDiff}`;

  const logEntry: logEntryObject = {
    method: req.method,
    path: req.originalUrl,
    status: res.statusCode,
    duration: normalizedReqResCycleDiff
  };

  logs.push(logEntry);

  fs.writeFile(logFile, JSON.stringify(logs, null, 2), (err) => {
    if (err) throw err;
    console.log('Request logged.');
  });
};

/**
 * This function builds and send the appropriate response to the client based
 * on the `format` parameter
 * @param {string} format the resonse format. Either of json/xml
 * @param {Response} res the response object
 * @param {object} data the data to be sent as response to the client
 * @returns {Response} res
 */
const buildResponse = (
  format: string,
  res: Response,
  data: object
): Response => {
  const result: object = covid19ImpactEstimator(data);
  if (format === 'xml') {
    const response = builder.buildObject(result);
    res.contentType('xml');
    return res.status(200).send(response);
  }

  return res.status(200).json(result);
};

/**
 * This function calculates the difference in time between when a request is received
 * and when the response is done sending, returning the difference in millisecs
 * @param {bigint} start the time when the request was received by the server
 * @returns {number} approximatedDiffInMillisecs
 */
const calculateDiffInReqResCycle = (start: bigint): number => {
  const diffInNanosecs: bigint = process.hrtime.bigint() - start;
  const approximatedDiffInMillisecs: number = Math.trunc(
    Number(diffInNanosecs) / 1e6
  );
  return approximatedDiffInMillisecs;
};

/* Middleware to call the writeLogs() function every time a request is handled */
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => writeLogs(start, req, res));

  next();
});

/* The home route */
app.get(
  '/',
  (req: Request, res: Response): Response => {
    return res
      .status(200)
      .json({ status: 200, message: 'Welcome to the on-covid-19 app.' });
  }
);

/* The estimator route without the format set */
app.post(
  '/api/v1/on-covid-19/',
  (req: Request, res: Response): Response => {
    const { body: data } = req;
    return buildResponse('json', res, data);
  }
);

/* The estimator route with the format set to either xml/json */
app.post(
  '/api/v1/on-covid-19/:format',
  (req: Request, res: Response): Response => {
    const { body: data } = req;
    const { format } = req.params;
    if (format === 'xml') {
      return buildResponse('xml', res, data);
    } else {
      return buildResponse('json', res, data);
    }
  }
);

/* The logs route for checking the request logs and the duration of each cycle */
app.get('/api/v1/on-covid-19/logs', (req: Request, res: Response) => {
  if (logs.length === 0)
    return res
      .status(200)
      .json({ status: 200, message: 'There are no request logs yet.' });

  let response: string = '';

  for (const log of logs) {
    let url: string;
    if (log.path.endsWith('json')) url = `${log.path}\t`;
    else url = `${log.path}\t\t`;

    response += `${log.method}\t\t${url}${log.status}\t\t${log.duration}ms\n`;
  }
  res.contentType('text/plain');
  res.charset = 'utf-8';
  return res.status(200).send(response);
});

/* start application after loading the current state of the logs file into memory */
app.listen(port, () => {
  fs.readFile(logFile, 'utf-8', (err, data) => {
    if (err) console.log('Error loading log file ', err);
    try {
      logs = JSON.parse(data);
    } catch (err) {
      console.log('Log file is empty');
    }
  });
  console.log('Server listening');
});

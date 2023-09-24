import compression from 'compression';
import cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@/utils/logger.utils';
import { config } from '@/utils/config.utils';
import { AppDataSource } from '@/utils/typeorm';
import requestContext from '@middlewares/context.middleware';
import responseHandlers, { logResponse } from '@/middlewares/response.middleware';

// Start cron jobs
import CronJobsService from '@/services/cronJobs/cronJobs.service';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = config.nodeEnv;
    this.port = config.port;

    this.morgenSetup();
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
    this.startCronJobs();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    AppDataSource.initialize()
      .then(() => logger.info('Mysql connected via Typeorm'))
      .catch(error => logger.error(error.stack));
  }

  private initializeMiddlewares() {
    this.app.use(cors({ origin: config.origin, credentials: config.credentials }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(bodyParser.json());
    this.app.use(requestContext);

    // Custom Response Handlers
    this.app.use(responseHandlers);
    this.app.use(logResponse);
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private morgenSetup() {
    morgan.token('reqHeaders', req => req.headers as any);
    // morgan.token('resHeaders', (_, res) => JSON.stringify(res.getHeaders()));
    morgan.token('body', (req: Request) => req.body);
    morgan.token('httpVersion', req => req.httpVersion);
    morgan.token('remoteAddress', req => req.socket.remoteAddress as any);
    morgan.token('cookie', req => req.headers.cookie as any);
    morgan.token('params', (req: Request) => req.params as any);
    morgan.token('query', (req: Request) => req.query as any);

    this.app.use(
      morgan(
        function (tokens, req, res) {
          return (
            [
              // `[${tokens.date(req, res, 'iso')}]`,
              'HTTP/',
              tokens.httpVersion(req, res),
              tokens.method(req, res),
              tokens.url(req, res),
              tokens.status(req, res),
              tokens.res(req, res, 'content-length'),
              '-',
              tokens['response-time'](req, res),
              'ms',
            ].join(' ') +
            ' ' +
            'beforeRequest: ' +
            JSON.stringify(
              {
                remoteAddress: tokens.remoteAddress(req, res),
                reqHeaders: tokens.reqHeaders(req, res),
                cookie: tokens.cookie(req, res),
                url: tokens.url(req, res),
                pathParams: tokens.params(req, res),
                queryParams: tokens.query(req, res),
                body: tokens.body(req, res),
              },
              null,
              '',
            )
          );
        },
        { stream: stream },
      ),
    );
  }

  private startCronJobs() {
    new CronJobsService();
  }
}

export default App;

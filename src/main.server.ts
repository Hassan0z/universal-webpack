import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import 'rxjs/Rx';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as compression from 'compression';
import * as express from 'express';
import { Request, Response } from 'express';
import { platformServer, renderModuleFactory } from '@angular/platform-server';
import { ServerAppModule } from './app/server-app.module';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { ROUTES } from './routes';
import { enableProdMode } from '@angular/core';
enableProdMode();
const app = express();
const port = (process.env.PORT || 31286);
const baseUrl = `http://localhost:${port}`;
const cache = {};

app.engine('html', ngExpressEngine({
  bootstrap: ServerAppModule
}));

app.set('view engine', 'html');
app.set('views', 'src');

app.use('/', express.static('dist', {index: false}));
app.use(cookieParser('Angular 2 Universal'));
app.use(bodyParser.json());
app.use(compression());

app.use(morgan('dev'));

function cacheControl(req, res, next) {
  // instruct browser to revalidate in 60 seconds
  res.header('Cache-Control', 'max-age=60');
  if (cache.url) {
      var hit = cache[url];
      if (hit[0] > Date.now()) {
        res.status(200).send(hit[1]);
        return;
      }
  }
  next();
}
// ROUTES.forEach((route: string) => {
//   console.log(route);
//   app.get(route, (req: Request, res: Response) => {
//     console.time(`GET: ${req.originalUrl}`);
//     res.render('../dist/index', {
//       req: req,
//       res: res
//     });
//     console.timeEnd(`GET: ${req.originalUrl}`);
//   });
// });
  app.get('*', (req, res) => {
    res.render('../dist/index', {
      req: req,
      res: res,
      preboot: false
    }, (err, html) => {
      cache[url] = [Date.now()+180000,html];
      res.status(200).send(html);
    });
  });

app.listen(port, () => {
	console.log(`Listening at ${baseUrl}`);
});

// ./src/server.ts
// import 'angular2-universal-polyfills';

// import * as path from 'path';
// import * as express from 'express';
// import * as bodyParser from 'body-parser';
// import * as cookieParser from 'cookie-parser';
// import * as morgan from 'morgan';
// import * as compression from 'compression';

// // Angular 2
// import { enableProdMode } from '@angular/core';
// import { ROUTES } from './routes';

// // Angular 2 Universal
// import { createEngine } from 'angular2-express-engine';

// // App
// import { MainModule } from '../node.module';

// // enable prod for faster renders
// enableProdMode();

// const app = express();
// const ROOT = path.join(path.resolve(__dirname, '..'));

// // Express View
// // app.engine('.html', createEngine({
// //   ngModule: MainModule,
// //   providers: [
// //       // You can include static providers like the Title service here
// //   ]
// // }));
// app.set('port', process.env.PORT || 31286);
// app.set('views', __dirname);
// app.set('view engine', 'html');
// app.set('json spaces', 2);

// app.use(cookieParser('Angular 2 Universal'));
// app.use(bodyParser.json());
// app.use(compression());

// app.use(morgan('dev'));

// function cacheControl(req, res, next) {
//   // instruct browser to revalidate in 60 seconds
//   res.header('Cache-Control', 'max-age=60');
//   next();
// }
// // Serve static files
// app.use('/assets', cacheControl, express.static(path.join(__dirname, 'assets'), {maxAge: 30}));
// app.use(cacheControl, express.static(path.join(ROOT, 'dist/client'), {index: false}));

// function ngApp(req, res) {
//   res.render('index', {
//     req,
//     res,
//     preboot: false, // turn on if using preboot
//     baseUrl: '/',
//     requestUrl: req.originalUrl,
//     originUrl: `http://localhost:${ app.get('port') }`
//   });
// }
// // Our page routes
// // export const routes: string[] = [
// //   'about',
// //   'home',
// //   'contact'
// // ];
// app.get('/', ngApp);
// ROUTES.forEach((route: string) => {
//   app.get(`/${route}`, ngApp);
//   // Route pattern
//   app.get(`/${route}/*`, ngApp);
// });

// app.get('*', function(req, res) {
//   res.setHeader('Content-Type', 'application/json');
//   var pojo = { status: 404, message: 'No Content' };
//   var json = JSON.stringify(pojo, null, 2);
//   res.status(404).send(json);
// });

// // Server
// let server = app.listen(app.get('port'), () => {
//   console.log(`Listening on: http://localhost:${server.address().port}`);
// });

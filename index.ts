import Koa from "koa";
// import Router, {RouterContext} from "koa-router";
import logger from "koa-logger";
import json from "koa-json";
import passport from 'koa-passport';

import { router as articles } from "./routes/articles";
import { router as special } from './routes/special';

import serve from 'koa-static-folder';

const app: Koa = new Koa();
// const router: Router = new Router();

// const welcomeAPI = async (ctx: RouterContext, next: any) => {
//  ctx.body = { msg: 'Hello world!' };
//  await next();
// }

// router.get('/api/v1', welcomeAPI)

app.use(serve('./doc'));

app.use(json());
app.use(logger());
app.use(passport.initialize());
// app.use(router.routes()).use(router.allowedMethods());
app.use(articles.routes());
app.use(special.routes());

app.listen(3306, () => {
  console.log("Koa Started");
})

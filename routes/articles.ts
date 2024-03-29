import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser"
import * as model from '../models/articles';
import { basicAuth } from '../controllers/auth'

const articles = [
  { title: 'Hello article', fullText: 'some text to fill the body' },
  { title: 'another article', fullText: 'again here is some text here to fill' },
  { title: 'coventry university', fullText: 'some news about coventry university' },
  { title: 'smart campus', fullText: 'smart campus is coming to IVE' }
]

const router = new Router({ prefix: '/api/v1/acticles' });

const getAll = async (ctx: RouterContext, next: any) => {
  //ctx.body = articles;
  let articles = await model.getAll();
  if (articles.length) {
    ctx.body = articles;
  } else {
    ctx.body = {}
  }
  await next();
}

const createArticle = async (ctx: RouterContext, next: any) => {
  // let { title, fullText } = ctx.request.body;
  // let newArticle = { title: title, fullText: fullText }
  // articles.push(newArticle);
  // ctx.status = 201;
  // ctx.body = newArticle;
  // await next();

  const body = ctx.request.body;
  let result = await model.add(body);
  if (result.status == 201) {
    ctx.status = 201;
    ctx.body = body;
  } else {
    ctx.status = 500;
    ctx.body = { err: "insert data failed" };
  }
  await next();
}

const getById = async (ctx: RouterContext, next: any) => {
  // let id = +ctx.params.id;

  // if ((id < articles.length + 1) && id > 0) {
  //   ctx.body = articles[id - 1];
  // } else {
  //   ctx.status = 404;
  // }

  let id = ctx.params.id;
  let article = await model.getById(id);
  if (article.length) {
    ctx.body = article[0];
  } else {
    ctx.status = 404;
  }

  await next();
}

const updateArticle = async (ctx: RouterContext, next: any) => {
  let id = +ctx.params.id;
  let c: any = ctx.request.body;
  let title = c.title;
  let fullText = c.fullText;

  if ((id < articles.length + 1) && id > 0) {
    if (fullText.length > 0) {
      articles[id - 1].fullText = fullText;
    }

    if (title.length > 0) {
      articles[id - 1].title = title;
    }
    ctx.status = 201;
    ctx.body = articles;
  } else {
    ctx.status = 404;
  }

  await next();
}

const deleteArticle = async (ctx: RouterContext, next: any) => {
  // let id = +ctx.params.id;

  // if ((id < articles.length + 1) && id > 0) {
  //   articles.splice((id - 1), 1);
  //   ctx.status = 201;
  //   ctx.body = articles;
  // } else {
  //   ctx.status = 404;
  // }

  let id = ctx.params.id;
  let article = await model.deleteArticle(id);
  let articles = await model.getAll();
  if (articles.length) { 
    ctx.body = articles;
  } else {
    ctx.status = 404;
  }

  await next();
}

router.get('/', getAll);
router.post('/', basicAuth, bodyParser(), createArticle);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', basicAuth, bodyParser(), updateArticle);
router.delete('/:id([0-9]{1,})', basicAuth, deleteArticle);

export { router }
const Koa = require("koa");
const Router = require("@koa/router");
const bodyParser = require("koa-bodyparser");

const logger = require("../../../hengda-harold/hengda-pitchfork/dispatcher/util/bunyan");
const postgres = require("../../../hengda-harold/hengda-pitchfork/dispatcher/util/postgres");

const app = new Koa();

app.env = "production";

app.use(bodyParser());

const router = new Router({
	prefix: "/api/nighthawk-003",
});

router.get("/:id", async (ctx) => {
	const cnx = await postgres.connect();
	try {
		const sql = `
    select * from nighthawk."003" where id = $1 limit 1
    `;
		const result = await cnx.query(sql, [parseInt(ctx.params.id, 10)]);
		ctx.response.status = 200;
		ctx.response.body = !!result.rows.length ? result.rows[0] : {};
	} catch (err) {
		logger.error(`--> ${ctx.request.method} ${ctx.request.url} ${err}`);
		ctx.response.status = 500;
	}
});

router.post("/", async (ctx) => {
	const cnx = await postgres.connect();
	try {
		const sql = `
      insert into nighthawk."003" 
        (dept,datime,route,train,staff,json_doc) 
      values 
        ($1,$2,$3,$4,$5,$6::jsonb)
    `;

		await cnx.query(sql, [
			ctx.request.body.dept,
			ctx.request.body.datime,
			ctx.request.body.route,
			ctx.request.body.train,
			ctx.request.body.staff,
			JSON.stringify({
				category: ctx.request.body.category,
				report: ctx.request.body.report,
				result: ctx.request.body.result,
			}),
		]);
		ctx.response.status = 200;
	} catch (err) {
		logger.error(`--> ${ctx.request.method} ${ctx.request.url} ${err}`);
		ctx.response.status = 500;
	}
});

router.put("/:id", async (ctx) => {
	const cnx = await postgres.connect();
	try {
		const sql = `
      update  
        nighthawk."003" 
      set
        dept = $1,
        datime = $2,
        route = $3,
        train = $4,
        staff = $5,
        json_doc = $6::jsonb
      where id = $7
    `;
		await cnx.query(sql, [
			ctx.request.body.dept,
			ctx.request.body.datime,
			ctx.request.body.route,
			ctx.request.body.train,
			ctx.request.body.staff,
			JSON.stringify({
				category: ctx.request.body.category,
				report: ctx.request.body.report,
				result: ctx.request.body.result,
			}),
			parseInt(ctx.params.id, 10),
		]);
		ctx.response.status = 200;
	} catch (err) {
		logger.error(`--> ${ctx.request.method} ${ctx.request.url} ${err}`);
		ctx.response.status = 500;
	}
});

router.delete("/:id", async (ctx) => {
	const cnx = await postgres.connect();
	try {
		const sql = `
      delete from nighthawk."003" where id = $1
    `;
		await cnx.query(sql, [parseInt(ctx.params.id, 10)]);
		ctx.response.status = 200;
	} catch (err) {
		logger.error(`--> ${ctx.request.method} ${ctx.request.url} ${err}`);
		ctx.response.status = 500;
	}
});

router.put("/", async (ctx) => {
	const cnx = await postgres.connect();
	try {
		const sql = `
      select * from nighthawk."003"
    `;
		const result = await cnx.query(sql);
		ctx.response.body = !!result.rows.length ? result.rows : [];
	} catch (err) {
		logger.error(`--> ${ctx.request.method} ${ctx.request.url} ${err}`);
		ctx.response.status = 500;
	}
});

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;

import { Database } from "bun:sqlite";

const db = new Database("./data/data.db");
const tables = db
	.query("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
	.all();
console.log("all tables:", tables.map((t: any) => t.name).join(", "));

const auth = ["user", "session", "account", "verification"];
for (const t of auth) {
	try {
		const c = db.query(`SELECT count(*) as n FROM ${t}`).get() as any;
		console.log(t, "rows:", c.n);
	} catch (e: any) {
		console.log(t, "MISSING:", e.message);
	}
}
db.close();

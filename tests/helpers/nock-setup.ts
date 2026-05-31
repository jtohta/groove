import nock from "nock";
import path from "path";

nock.back.fixtures = path.join(__dirname, "../__nocks__");
nock.back.setMode((process.env.NOCK_BACK_MODE as any) || "dryrun");

export { nock };

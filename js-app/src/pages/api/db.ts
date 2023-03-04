import type { NextApiRequest, NextApiResponse } from "next";
import * as Knex from 'knex';
import * as Mysql2 from 'mysql2';
import env from 'env-var';

const logKnexMsgCurriedFn = (kind: string) => (msg: string) => console.log(`knex ${kind} - ${msg}`);

export const knex = Knex.knex({
  client: 'mysql2',
  connection: {
    host: 'database',
    port: 3306,
    user: 'nb-mill',
    database: 'nb-mill-data',
    password: env
      .get('MARIADB_PASSWORD')
      .required()
      .asString(),
  },
  pool: {
    min: 1,
    max: 10,
    log: (message: string, level: string) => logKnexMsgCurriedFn(level)(message),
  },
  log: {
    warn: logKnexMsgCurriedFn('WARN'),
    error: logKnexMsgCurriedFn('ERROR'),
  }
})

export interface RawResponse<T> {
  0: T[],
  1: Mysql2.Field[],
}

export const query = async <T>(sql: string, params: any): Promise<T[]> => knex
  .raw<RawResponse<T>>(sql, params)
  .then((response) => response[0])
  .catch((err) => {
    console.log({
      message: 'unexpected error running query!',
      err
    });
    throw err;
  });



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{status: "green"|"red"}>,
) {
  return knex.raw("select 1")
    .timeout(5_000, {cancel: true})
    .then(() => res.status(200).json({ status: "green" }))
    .catch((err) => {
      console.log({
        message: 'failure on db healthcheck',
        err
      });
      return res.status(500).json({ status: "red" });
    });
}

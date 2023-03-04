import {z} from 'zod';

import * as _fn from '../../../fns';
import * as _db from '../db';
import * as _es from '../es';
import {NextApiRequest, NextApiResponse} from "next";

export interface Job {
  id: string,
  location: string,
  scheduled: boolean,
  frequency?: number,
  created?: string,
  updated?: string,
}

export const db = {
  query: async (sql: string, params: any[]) =>_db.query<Job>(sql, params),
}

export class es {

}

const newJobSchema = z.object({
  location: z.string()
    .min(1).max(2**10)
    .regex(/^[a-zA-Z0-9-_\/]+/),
  scheduled: z.boolean(),
  frequency: z.number()
    .finite()
    .int()
    .gte(60).lte(10e6)
    .optional(),
  user: z.string().min(1).max(2**10),
})

async function createNewJob(data: any): Promise<Job> {
  return undefined as unknown as Job;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Job>
) => {
  switch (req.method) {
    case 'PUT':
      return undefined;

  }
};

export default function wrappedHandler (...any: any[]) {
  return _fn.statusHandler(handler);
}

import type {NextApiRequest, NextApiResponse} from "next";
import { z } from 'zod';
import * as db from '../db';

interface Job {
  id: string,
  location: string,
  active: boolean,
  frequency: number,
  created?: string,
  updated?: string,
}

const dbJobSchema = z.object({
  id: z.string().max(1),
  location: z.string().max(1),
})

const query = db.query<Job>;

export const getJobById = async (id: string) => {
  const [first, ...rest] = await query(
    "select * from jobs where jobId = ?",
    [id],
  );
  return first;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Job>
) {
  switch (req.method) {

    case 'GET':
      return res;

    case 'POST':
      return res;

    case 'DELETE':
      return res;
    default:
      return res.status(404).end();
  }
}

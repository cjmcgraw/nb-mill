import type { NextApiRequest, NextApiResponse } from "next";
import { z } from 'zod';
import * as db from '../db';

interface NewNotebook {
}

interface Notebook {
  id?: string
  location?: string
  created?: string
  updated?: string
  createdBy?: string
  updatedBy?: string
  bytes:
}


const getNotebook = async (id: string) => db
  .query<Notebook>("select * from notebook where id = ?", [id])
  .then(([first, ...rest]) => first)
  .catch((err) => {
    console.log({
      message: "error getting notebook from database",
      err
    });
    throw err;
  });


async function createNotebook(args: {
  creator: string
  notebook: NewNotebook
}): Promise<Notebook> {

}

async function updateNotebook(args: {
  updator: string,
  notebook: NewNotebook,
})

async function deleteNotebook(id: string): Promise<Notebook> {
  return undefined as unknown as Notebook;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const notebookSchema = z.object({
    location: z.string(),
  });

  switch(req.method) {
    case 'PUT':
      const parseResult = notebookSchema.safeParse(req.body);
      if (parseResult.success === false) {
        res.status(400).json({
          message: "invalid notebook data given!",
          error: parseResult.error.message,
        })
        return res;
      }
      const { data } = parseResult;

      return createNotebook(data);



    case 'POST':
    case 'GET':
      const id = req.query?.id as string;
      return getNotebook(id)
        .then(() => {

        })
        .catch(() => {

        });



    case 'DELETE':
      return deleteNotebook(req, res);

  }
}

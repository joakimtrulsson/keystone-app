import type { Request, Response } from 'express';
import type { Context } from '.keystone/types';

export async function getEvents(req: Request, res: Response, context: Context) {
  const events = await context.query.Event.findMany({
    // where: {
    //   isComplete,
    // },
    query: `
     id
     title
     content { document }
    `,
  });

  res.json(events);
}

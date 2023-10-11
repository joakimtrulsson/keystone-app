import type { Request, Response } from 'express';
import type { Context } from '.keystone/types';

export async function getPosts(req: Request, res: Response, context: Context) {
  const posts = await context.query.Post.findMany({
    query: `
     id
     title
     content { document }
    `,
  });

  res.json(posts);
}

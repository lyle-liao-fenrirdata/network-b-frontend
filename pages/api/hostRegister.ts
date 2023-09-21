import { prisma } from '@/prisma/prisma';
import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const { body, method, headers, query } = req;
  console.log({ method, url: headers["x-invoke-path"], query, body });

  if (method === 'GET') {
    const ipAddress = query['ipAddress']
    const xApiKey = query['xApiKey']
    if (!ipAddress || typeof ipAddress !== 'string' || !xApiKey || typeof xApiKey !== 'string') {
      res.status(400).end(); return
    }
    const endpointPath = process.env.PORTAINER_ENDPOINT_PATH || "/api/endpoints";
    const backendUri = `${ipAddress}:${process.env.PORTAINER_ENDPOINT_PORT || '9000'}`;
    const endpointUrl = new URL(endpointPath, backendUri);
    endpointUrl.searchParams.append("name", process.env.PORTAINER_ENDPOINT_NAME || 'local');
    const textConnetion = await fetch(endpointUrl, {
      mode: "no-cors",
      cache: "no-store",
      headers: {
        "X-API-Key": xApiKey
      },
    });
    if (textConnetion.status !== 200) {
      res.status(400).end(); return
    }
    res.status(200).end('ok');
    return;
  }

  let bodyJSON;
  if (!body) {
    res.status(400).end(); return
  }
  try {
    bodyJSON = JSON.parse(body)
  } catch (error) { console.error(error) }

  const id = Number(bodyJSON.id)
  if (!bodyJSON || (method !== 'POST' && isNaN(id))) {
    res.status(400).end(); return
  }

  switch (method) {
    case "POST":
      await prisma.host.create({ data: <Prisma.hostCreateInput>bodyJSON })
      res.status(200).end('ok');
      break;
    case "PUT":
      await prisma.host.update({
        where: {
          id,
        },
        data: {
          deletedAt: new Date(),
        }
      })
      res.status(200).end('ok');
      break;
    case "PATCH":
      await prisma.host.update({
        where: {
          id,
        },
        data: {
          deletedAt: null,
        }
      })
      res.status(200).end('ok');
      break;
    case "DELETE":
      await prisma.host.delete({
        where: {
          id,
        }
      })
      res.status(200).end('ok');
      break;
    default:
      res.status(405).end()
  }

}

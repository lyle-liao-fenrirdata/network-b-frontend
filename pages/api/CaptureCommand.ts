import { prisma } from '@/prisma/prisma';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<"">
) {
  const { body, method, headers, query } = req;
  console.log({ method, url: headers["x-invoke-path"], query, body });

  switch (method) {
    case "POST":
      try {
        res.setHeader('Cache-Control', 's-maxage=5');

        const ipAddress = query['ipAddress']
        if (!ipAddress || typeof ipAddress !== 'string') throw new Error('無IP於請求URL中');
        const xApiKey = await prisma.host.findUnique({ where: { ipAddress, deletedAt: null }, select: { xApiKey: true } })
        if (!xApiKey) throw new Error('無此IP登錄使用中');
        const endpointPath = process.env.CAPTURE_COMMAND_PATH || '/CaptureCommand';
        const backendUri = `http://${ipAddress}:${process.env.BACKEND_PORT || '5001'}`;
        const url = new URL(endpointPath, backendUri);

        const result = await fetch(url, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (result.status !== 200) throw new Error(result.statusText);
        const responseBody = await result.text();
        res.status(200).end(responseBody);
        break;
      } catch (error) {
        console.error(error);
        res.status(400).end(String(error));
        break;
      }
    default:
      res.status(405).end()
      break;
  }

}

import { cEgressPageData } from '@/fakeData/C_PageData';
import type { NextApiRequest, NextApiResponse } from 'next'

// location http://192.168.1.80:8080/tropical_cyclone_v8.0.5/egress/CEgressPageData
//                ?modemIp=192.168.1.105
//                &username=sfuser
//                &date=1686624786951

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { method, query, body } = req;
  console.log({ method, query, body });

  switch (method) {
    case "GET":
      try {
        const requireKeys = [
          "modemIp",
          "username",
          "date",
        ];
        if (requireKeys.every((r) => Object.hasOwn(query, r))) {
          res.status(200).json(cEgressPageData);
          break;
        }
        res.status(406).end();
        break;
      } catch (error) {
        console.error(error);
        res.status(400).end(String(error));
        break;
      }
    default:
      res.status(405).end()
  }

}

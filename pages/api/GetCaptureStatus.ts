import type { NextApiRequest, NextApiResponse } from 'next'

export interface GetCaptureStatusBody {
  CRCErrCnt?: number,
  CRCErrRate?: number,
  DataCnt?: number,
  Dump?: string,
  PacketCnt?: number,
  ProgramCnt?: number,
  RecordID?: string
  updatedAt: number,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetCaptureStatusBody>
) {
  // request body json
  // {
  //   "RecordID": "xxxx",
  //   "DataCnti": 2147483647,
  //   "ProgramCnt": 1234567890,
  //   "PacketCnt": 7777777,
  //   "CRCErrCnt": 0,
  //   "CRCErrRate": 0,
  //   "Dump": "Ascii"
  // }
  const { headers, method, query, body } = req;
  console.log({ method, url: headers["x-invoke-path"], query, body });

  switch (method) {
    case "GET":
      try {
        res.setHeader('Cache-Control', 's-maxage=5')

        const url = new URL(
          process.env.GET_STATUS_PATH as string,
          `${process.env.BACKEND_URL}:${process.env.BACKEND_PORT}`
        );

        const result = await fetch(url, {
          method: "POST",
          mode: "no-cors",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({})
        });

        if (result.status !== 200) throw new Error(result.statusText);
        const response = await result.json() as GetCaptureStatusBody;

        res.status(200).json(Object.assign(response, { updatedAt: Date.now() }));
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

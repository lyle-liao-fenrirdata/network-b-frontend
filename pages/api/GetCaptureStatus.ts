import type { NextApiRequest, NextApiResponse } from 'next'

export interface GetCaptureStatusBody {
  "CRCErrCnt": number,
  "CRCErrRate": number,
  "DataCnt": number,
  "Dump": string,
  "PacketCnt": number,
  "ProgramCnt": number,
  "RecordID": string
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
  // but only need the following:
  // {
  //   "RecordID": "xxxx",
  //   "Dump": "Ascii"
  // }
  const { headers, method, query, body } = req;
  console.log({ method, url: headers["x-invoke-path"], query, body });

  switch (method) {
    case "GET":
      try {
        const RecordID = query["RecordID"] as string;

        const url = new URL("http://192.168.17.31:5001/GetCaptureStatus");
        url.search = new URLSearchParams({ RecordID }).toString();

        const result = await fetch(url, { mode: "no-cors" });

        if (result.status !== 200) throw new Error(result.statusText);
        console.log(result.body)

        const body = await result.json() as GetCaptureStatusBody;
        console.log(body)
        res.status(200).json(body);
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

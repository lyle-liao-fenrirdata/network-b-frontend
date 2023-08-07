// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  FileName: string,
  DataCnt: number,
  ProgramCnt: number,
  PacketCnt: number,
  CRCErrCnt: number,
  CRCErrRate: number,
  Dump: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { headers, body, method, query } = req;
  console.log({ headers, body, method, query });

  res.status(200).json({
    FileName: "xxxx",
    DataCnt: 123123123,
    ProgramCnt: 12312123123,
    PacketCnt: 0,
    CRCErrCnt: 0,
    CRCErrRate: 0,
    Dump: "Ascii"
  })
}

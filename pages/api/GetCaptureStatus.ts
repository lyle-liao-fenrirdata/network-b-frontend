import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  "CRCErrCnt": number,
  "CRCErrRate": number,
  "DataCnt": number,
  "Dump": string,
  "PacketCnt": number,
  "ProgramCnt": number,
  "RecordID": string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { body, method } = req;
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
  console.log({ body, method });

  switch (method) {
    case "GET":
      try {
        const data = JSON.parse(body);
        const requireKeys = [
          "RecordID",
          "Dump",
        ];
        if (requireKeys.every((r) => Object.hasOwn(data, r))) {
          return res.status(200).json({
            "CRCErrCnt": 0,
            "CRCErrRate": 0,
            "DataCnt": 2147483647,
            "Dump": "total 452\ndrwxrwxrwx 2 user  user    4096 Aug 23 17:17 .\ndrwxrwxrwx 7 user  user    4096 Aug 21 19:26 ..\n-rwxrwxrwx 1 frank frank 445683 Aug 28 13:09 franktest.log\n-rwxrwxrwx 1 root  root     284 Aug 23 17:17 Testxxx000000_UnixTime_00001_20230823091744.pcap\n",
            "PacketCnt": 0,
            "ProgramCnt": 1234567890,
            "RecordID": "xxxx"
          });
        }
        res.status(406).end();

      } catch (error) {
        console.error(error);
        res.status(400).end(String(error));
        break;
      }
    default:
      res.status(405).end()
  }

}

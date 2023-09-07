import type { NextApiRequest, NextApiResponse } from 'next'

export interface GetCaptureStatusBody {
  "CRCErrCnt"?: number,
  "CRCErrRate"?: number,
  "DataCnt"?: number,
  "Dump": string,
  "PacketCnt"?: number,
  "ProgramCnt"?: number,
  "RecordID"?: string
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
        // const RecordID = query["RecordID"] as string;

        const url = new URL("http://192.168.17.31:5001/GetCaptureStatus");
        // url.search = new URLSearchParams({ RecordID }).toString();

        const result = await fetch(url, { mode: "no-cors", cache: "no-cache" });

        if (result.status !== 200) throw new Error(result.statusText);
        if (result.headers.get('Content-Type')?.match("text/html")) {
          const body = await result.text()
          // console.log(body)
          res.status(200).json({ Dump: body })
        } else {
          const body = await result.json() as GetCaptureStatusBody;
          // console.log(body)
          res.status(200).json(body)
        }
        //   res.status(200).json({
        //   "CRCErrCnt": 0,
        //   "CRCErrRate": 0,
        //   "DataCnt": 2147483647,
        //   "Dump": "total 1364\ndrwxrwxrwx  2 user  user     4096 Sep  6 18:41 .\ndrwxrwxrwx 10 user  user     4096 Aug 30 13:04 ..\n-rwxrwxrwx  1 root  root      276 Sep  6 18:40 ASD12332112341_1693996851_00001_20230906104052.pcap\n-rwxrwxrwx  1 root  root      276 Sep  6 18:41 ASD12332112341_1693996869_00001_20230906104110.pcap\n-rwxrwxrwx  1 root  root      276 Sep  6 18:41 ASD12332112341_1693996900_00001_20230906104141.pcap\n-rwxrwxrwx  1 root  root      280 Sep  6 17:59 DDV12345678901_1693994324_00001_20230906095934.pcap\n-rwxrwxrwx  1 frank frank 1362763 Sep  7 11:18 franktest.log\n-rwxrwxrwx  1 root  root      284 Aug 23 17:17 Testxxx000000_UnixTime_00001_20230823091744.pcap\ntotal 1364\ndrwxrwxrwx  2 user  user     4096 Sep  6 18:41 .\ndrwxrwxrwx 10 user  user     4096 Aug 30 13:04 ..\n-rwxrwxrwx  1 root  root      276 Sep  6 18:40 ASD12332112341_1693996851_00001_20230906104052.pcap\n-rwxrwxrwx  1 root  root      276 Sep  6 18:41 ASD12332112341_1693996869_00001_20230906104110.pcap\n-rwxrwxrwx  1 root  root      276 Sep  6 18:41 ASD12332112341_1693996900_00001_20230906104141.pcap\n-rwxrwxrwx  1 root  root      280 Sep  6 17:59 DDV12345678901_1693994324_00001_20230906095934.pcap\n-rwxrwxrwx  1 frank frank 1362763 Sep  7 11:18 franktest.log\n-rwxrwxrwx  1 root  root      284 Aug 23 17:17 Testxxx000000_UnixTime_00001_20230823091744.pcap\ntotal 1364\ndrwxrwxrwx  2 user  user     4096 Sep  6 18:41 .\ndrwxrwxrwx 10 user  user     4096 Aug 30 13:04 ..\n-rwxrwxrwx  1 root  root      276 Sep  6 18:40 ASD12332112341_1693996851_00001_20230906104052.pcap\n-rwxrwxrwx  1 root  root      276 Sep  6 18:41 ASD12332112341_1693996869_00001_20230906104110.pcap\n-rwxrwxrwx  1 root  root      276 Sep  6 18:41 ASD12332112341_1693996900_00001_20230906104141.pcap\n-rwxrwxrwx  1 root  root      280 Sep  6 17:59 DDV12345678901_1693994324_00001_20230906095934.pcap\n-rwxrwxrwx  1 frank frank 1362763 Sep  7 11:18 franktest.log\n-rwxrwxrwx  1 root  root      284 Aug 23 17:17 Testxxx000000_UnixTime_00001_20230823091744.pcap\ntotal 1364\ndrwxrwxrwx  2 user  user     4096 Sep  6 18:41 .\ndrwxrwxrwx 10 user  user     4096 Aug 30 13:04 ..\n-rwxrwxrwx  1 root  root      276 Sep  6 18:40 ASD12332112341_1693996851_00001_20230906104052.pcap\n-rwxrwxrwx  1 root  root      276 Sep  6 18:41 ASD12332112341_1693996869_00001_20230906104110.pcap\n-rwxrwxrwx  1 root  root      276 Sep  6 18:41 ASD12332112341_1693996900_00001_20230906104141.pcap\n-rwxrwxrwx  1 root  root      280 Sep  6 17:59 DDV12345678901_1693994324_00001_20230906095934.pcap\n-rwxrwxrwx  1 frank frank 1362763 Sep  7 11:18 franktest.log\n-rwxrwxrwx  1 root  root      284 Aug 23 17:17 Testxxx000000_UnixTime_00001_20230823091744.pcap\ntotal 1364\ndrwxrwxrwx  2 user  user     4096 Sep  6 18:41 .\ndrwxrwxrwx 10 user  user     4096 Aug 30 13:04 ..\n-rwxrwxrwx  1 root  root      276 Sep  6 18:40 ASD12332112341_1693996851_00001_20230906104052.pcap\n-rwxrwxrwx  1 root  root      276 Sep  6 18:41 ASD12332112341_1693996869_00001_20230906104110.pcap\n-rwxrwxrwx  1 root  root      276 Sep  6 18:41 ASD12332112341_1693996900_00001_20230906104141.pcap\n-rwxrwxrwx  1 root  root      280 Sep  6 17:59 DDV12345678901_1693994324_00001_20230906095934.pcap\n-rwxrwxrwx  1 frank frank 1362763 Sep  7 11:18 franktest.log\n-rwxrwxrwx  1 root  root      284 Aug 23 17:17 Testxxx000000_UnixTime_00001_20230823091744.pcap\ntotal 1364\ndrwxrwxrwx  2 user  user     4096 Sep  6 18:41 .\ndrwxrwxrwx 10 user  user     4096 Aug 30 13:04 ..\n-rwxrwxrwx  1 root  root      276 Sep  6 18:40 ASD12332112341_1693996851_00001_20230906104052.pcap\n-rwxrwxrwx  1 root  root      276 Sep  6 18:41 ASD12332112341_1693996869_00001_20230906104110.pcap\n-rwxrwxrwx  1 root  root      276 Sep  6 18:41 ASD12332112341_1693996900_00001_20230906104141.pcap\n-rwxrwxrwx  1 root  root      280 Sep  6 17:59 DDV12345678901_1693994324_00001_20230906095934.pcap\n-rwxrwxrwx  1 frank frank 1362763 Sep  7 11:18 franktest.log\n-rwxrwxrwx  1 root  root      284 Aug 23 17:17 Testxxx000000_UnixTime_00001_20230823091744.pcap\ntotal 1364\ndrwxrwxrwx  2 user  user     4096 Sep  6 18:41 .\ndrwxrwxrwx 10 user  user     4096 Aug 30 13:04 ..\n-rwxrwxrwx  1 root  root      276 Sep  6 18:40 ASD12332112341_1693996851_00001_20230906104052.pcap\n-rwxrwxrwx  1 root  root      276 Sep  6 18:41 ASD12332112341_1693996869_00001_20230906104110.pcap\n-rwxrwxrwx  1 root  root      276 Sep  6 18:41 ASD12332112341_1693996900_00001_20230906104141.pcap\n-rwxrwxrwx  1 root  root      280 Sep  6 17:59 DDV12345678901_1693994324_00001_20230906095934.pcap\n-rwxrwxrwx  1 frank frank 1362763 Sep  7 11:18 franktest.log\n-rwxrwxrwx  1 root  root      284 Aug 23 17:17 Testxxx000000_UnixTime_00001_20230823091744.pcap\ntotal 1364\ndrwxrwxrwx  2 user  user     4096 Sep  6 18:41 .\ndrwxrwxrwx 10 user  user     4096 Aug 30 13:04 ..\n-rwxrwxrwx  1 root  root      276 Sep  6 18:40 ASD12332112341_1693996851_00001_20230906104052.pcap\n-rwxrwxrwx  1 root  root      276 Sep  6 18:41 ASD12332112341_1693996869_00001_20230906104110.pcap\n-rwxrwxrwx  1 root  root      276 Sep  6 18:41 ASD12332112341_1693996900_00001_20230906104141.pcap\n-rwxrwxrwx  1 root  root      280 Sep  6 17:59 DDV12345678901_1693994324_00001_20230906095934.pcap\n-rwxrwxrwx  1 frank frank 1362763 Sep  7 11:18 franktest.log\n-rwxrwxrwx  1 root  root      284 Aug 23 17:17 Testxxx000000_UnixTime_00001_20230823091744.pcap\ntotal 1364\ndrwxrwxrwx  2 user  user     4096 Sep  6 18:41 .\ndrwxrwxrwx 10 user  user     4096 Aug 30 13:04 ..\n-rwxrwxrwx  1 root  root      276 Sep  6 18:40 ASD12332112341_1693996851_00001_20230906104052.pcap\n-rwxrwxrwx  1 root  root      276 Sep  6 18:41 ASD12332112341_1693996869_00001_20230906104110.pcap\n-rwxrwxrwx  1 root  root      276 Sep  6 18:41 ASD12332112341_1693996900_00001_20230906104141.pcap\n-rwxrwxrwx  1 root  root      280 Sep  6 17:59 DDV12345678901_1693994324_00001_20230906095934.pcap\n-rwxrwxrwx  1 frank frank 1362763 Sep  7 11:18 franktest.log\n-rwxrwxrwx  1 root  root      284 Aug 23 17:17 Testxxx000000_UnixTime_00001_20230823091744.pcap\n",
        //   "PacketCnt": 0,
        //   "ProgramCnt": 1234567890,
        //   "RecordID": ""
        // });
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

import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<"">
) {
  const { body, method } = req;
  console.log({ body, method });

  switch (method) {
    case "POST":
      try {
        const data = JSON.parse(body);
        const requireKeys = [
          "LinkID",
          "InputPort",
          "OutputPort",
          "ServerIP",
          "ServerPort",
          "ServerCh",
          "Capture",
          "RecordID",
          "ServerType",
          "Timestamp",
          "ModemDataIP",
          "ModemDataDestPort"
        ];
        const requireKeysOfLinkID = ["SatelliteID", "Polarization", "Frequency"]
        if (requireKeys.every((r) => Object.hasOwn(data, r)) && requireKeysOfLinkID.every((r) => Object.hasOwn(data.LinkID, r))) {
          res.status(200).end("ok");
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
      break;
  }

}

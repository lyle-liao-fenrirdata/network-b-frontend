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

        const url = new URL(
          process.env.CAPTURE_COMMAND_PATH || '/CaptureCommand',
          `${process.env.BACKEND_URL || 'http://192.168.17.31'}:${process.env.BACKEND_PORT || '5001'}`
        );
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

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<"">
) {
  const { body, method } = req;
  console.log({ body, method });

  switch (method) {
    case "POST":
      try {
        const url = new URL(
          process.env.NEXT_PUBLIC_CAPTURE_COMMAND_PATH as string,
          `${process.env.NEXT_PUBLIC_BACKEND_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}`
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

import type { NextApiRequest, NextApiResponse } from 'next';

export interface PortainerContainer {
    Id: string;
    Names: string[];
    Image: string;
    ImageID: string;
    Command: string;
    Created: number;
    Ports: {
        IP: string;
        PrivatePort: number;
        PublicPort: number;
        Type: string;
    }[];
    Labels: { [key: string]: string };
    State: string;  // running
    Status: string;
    HostConfig: { [key: string]: string };
    NetworkSettings: { [key: string]: { [key: string]: { [key: string]: string }; }; };
    Mounts: any[];
}

interface PartialPortainerEndpoint {
    Id: string;
    Name: string;
    Type: number;
    Status: number;
    Snapshots?: {
        Time: number;
        DockerVersion: string;
        Swarm: boolean;
        TotalCPU: number;
        TotalMemory: number;
        RunningContainerCount: number;
        StoppedContainerCount: number;
        HealthyContainerCount: number;
        UnhealthyContainerCount: number;
        VolumeCount: number;
        ImageCount: number;
        ServiceCount: number;
        StackCount: number;
        NodeCount: number;
        GpuUseAll: boolean;
        GpuUseList: any[];
        DockerSnapshotRaw?: {
            Containers?: PortainerContainer[]
        }
    }[];
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { headers, method, query, body } = req;
    console.log({ method, url: headers["x-invoke-path"], query, body });
    console.error(process.env.PORTAINER_X_API_KEY)

    switch (method) {
        case "GET":
            try {
                res.setHeader('Cache-Control', 's-maxage=5');

                const url = new URL(
                    process.env.PORTAINER_ENDPOINT_PATH as string,
                    `${process.env.BACKEND_URL}:${process.env.PORTAINER_ENDPOINT_PORT}`
                );

                const result = await fetch(url, {
                    mode: "no-cors",
                    cache: "no-store",
                    headers: {
                        "X-API-Key": process.env.PORTAINER_X_API_KEY as string,
                    },
                });
                if (result.status !== 200) throw new Error(result.statusText);
                const body = await result.json() as PartialPortainerEndpoint[];
                // console.log(body
                //     .map((b) => b.Snapshots?.map((s) => s.DockerSnapshotRaw?.Containers?.map(c => c.Names) || []).flat() || [])
                //     .flat())
                const containers = body
                    .map((b) => b.Snapshots?.map((s) => s.DockerSnapshotRaw?.Containers || []).flat() || [])
                    .flat()
                    .filter((c) => c.Names.some((n) => n.match(/[A-Z]{3}[\d]{11}_[\d]{10}\./)))
                    .sort((a, b) => b.Created - a.Created);

                res.status(200).json(containers);
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

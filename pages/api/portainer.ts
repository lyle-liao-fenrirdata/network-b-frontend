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

// portainer access token (admin S1B2S3)
const X_API_Key = "ptr_ufdD7QSpTXhjKIoAaab1EqGbLr5ThWaEZaFY5XkFNgo=";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { headers, method, query, body } = req;
    console.log({ method, url: headers["x-invoke-path"], query, body });

    switch (method) {
        case "GET":
            try {
                const result = await fetch("http://192.168.17.31:9000/api/endpoints", {
                    method: "GET",
                    mode: "no-cors",
                    headers: {
                        "X-API-Key": X_API_Key,
                    },
                });
                if (result.status !== 200) throw new Error(result.statusText);
                const body = await result.json() as PartialPortainerEndpoint[];
                const containers = body
                    .map((b) => b.Snapshots?.map((s) => s.DockerSnapshotRaw?.Containers || []).flat() || [])
                    .flat()
                    .filter((c) => c.Names.some((n) => n.match(/[A-Z]{3}[\d]{11}_[\d]{10,}/)))
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

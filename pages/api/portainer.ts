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

const X_API_KEY = process.env.PORTAINER_X_API_KEY as string;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { headers, method, query, body } = req;
    console.log({ method, url: headers["x-invoke-path"], query, body });

    switch (method) {
        case "GET":
            try {
                res.setHeader('Cache-Control', 's-maxage=1');

                const endpointPath = process.env.PORTAINER_ENDPOINT_PATH || "/api/endpoints";
                const backendUri = `${process.env.BACKEND_URL}:${process.env.PORTAINER_ENDPOINT_PORT}`;

                const endpointUrl = new URL(endpointPath, backendUri);
                endpointUrl.searchParams.append("name", process.env.PORTAINER_ENDPOINT_NAME || 'local');
                const endpointResult = await fetch(endpointUrl, {
                    mode: "no-cors",
                    cache: "no-store",
                    headers: {
                        "X-API-Key": X_API_KEY
                    },
                });
                if (endpointResult.status !== 200) throw new Error(endpointResult.statusText);
                const endpointBody = await endpointResult.json() as PartialPortainerEndpoint[];

                const containerPath = `${endpointPath}/${endpointBody[0]?.Id || "2"}${process.env.PORTAINER_ENDPOINT_ID_CONTAINER_PATH || "/docker/containers/json"}`
                const containertUrl = new URL(containerPath, backendUri);
                const result = await fetch(containertUrl, {
                    mode: "no-cors",
                    cache: "no-store",
                    headers: {
                        "X-API-Key": X_API_KEY,
                    },
                });
                if (result.status !== 200) throw new Error(result.statusText);
                const body = await result.json() as PortainerContainer[];

                const containers = body
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

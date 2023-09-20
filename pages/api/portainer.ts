import { prisma } from '@/prisma/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { GetCaptureStatusBody } from './GetCaptureStatus';

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

export type GetHostContainerAndStatus = {
    host: {
        hostName: string;
        comment: string;
        ipAddress: string;
        id: number;
    };
    containers: PortainerContainer[];
    captureStatus: GetCaptureStatusBody;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { headers, method } = req;
    console.log({ method, url: headers["x-invoke-path"] });

    switch (method) {
        case "GET":
            const hosts = await prisma.host.findMany({
                where: { deletedAt: null },
                orderBy: { updatedAt: "desc" },
                select: {
                    id: true,
                    hostName: true,
                    ipAddress: true,
                    xApiKey: true,
                    comment: true,
                }
            });

            res.setHeader('Cache-Control', 's-maxage=1');
            const updatedAt = Date.now()

            const results = await Promise.all(hosts.map(async ({
                hostName,
                comment,
                ipAddress,
                xApiKey,
                id,
            }) => {
                const res: GetHostContainerAndStatus = {
                    host: {
                        hostName,
                        comment,
                        ipAddress,
                        id,
                    },
                    containers: [],
                    captureStatus: {
                        updatedAt,
                    },
                }
                const endpointPath = process.env.PORTAINER_ENDPOINT_PATH || "/api/endpoints";
                const backendUri = `http://${ipAddress}:${process.env.PORTAINER_ENDPOINT_PORT || '9000'}`;

                const endpointUrl = new URL(endpointPath, backendUri);
                endpointUrl.searchParams.append("name", process.env.PORTAINER_ENDPOINT_NAME || 'local');
                const endpointResult = await fetch(endpointUrl, {
                    mode: "no-cors",
                    cache: "no-store",
                    headers: {
                        "X-API-Key": xApiKey
                    },
                });
                if (endpointResult.status !== 200) return res;
                const endpointBody = await endpointResult.json() as PartialPortainerEndpoint[];

                const containerPath = `${endpointPath}/${endpointBody[0]?.Id || "2"}${process.env.PORTAINER_ENDPOINT_ID_CONTAINER_PATH || "/docker/containers/json"}`
                const containertUrl = new URL(containerPath, backendUri);
                const result = await fetch(containertUrl, {
                    mode: "no-cors",
                    cache: "no-store",
                    headers: {
                        "X-API-Key": xApiKey,
                    },
                });
                if (result.status !== 200) return res;
                const body = await result.json() as PortainerContainer[];

                res.containers = body
                    .filter((c) => c.Names.some((n) => n.match(/[A-Z]{3}[\d]{11}_[\d]{10}\./)))
                    .sort((a, b) => b.Created - a.Created);


                // ad
                const urlGetCaptureStatus = new URL(
                    process.env.GET_STATUS_PATH || '/GetCaptureStatus',
                    `http://${ipAddress}:${process.env.BACKEND_PORT || '5001'}`
                );

                const resultGetCaptureStatus = await fetch(urlGetCaptureStatus, {
                    method: "POST",
                    mode: "no-cors",
                    cache: "no-cache",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({})
                });

                // if (result.status !== 200) throw new Error(result.statusText);
                const jsonGetCaptureStatus = await resultGetCaptureStatus.json() as GetCaptureStatusBody;
                res.captureStatus = { ...jsonGetCaptureStatus, updatedAt }

                return res

            }))
            res.status(200).json(results);
            break;
        default:
            res.status(405).end()
    }

}

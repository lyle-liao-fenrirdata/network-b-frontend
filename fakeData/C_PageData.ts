export const cSignalPageDataMux: CSignalPageDataMux = {
    error: false,
    functions: [
        {
            argument: {
                hiddenRefresh: "",
                lBandFrequency: "2139250", // +
                modemIp: "192.158.1.105",
                sfBaudRate: "3180000", // +
                sfClusterVariance: "16.9 dB", // +
                sfDerandomiserEnable: "1", // +
                sfDownConversionFactor: "10600000", // +
                sfFrequencyError: "-563", // +
                sfInputLevel: "-41", // +
                sfOffAirFrequency: "12739250", // +
                sfOutputMode: "0", // +
                sfPlsSignature: "{\"finderIsRunning\":false,\"finderProgress\":0,\"plsCode\":0}", // +
                sfPowerMode: "1", // +
                sfSystemRfid: "HOR", // +
                sfdbChannelPoolName: "",
                sfdbSubChannelCaseNotation: "I DON'T KNOW, IT'S BLACK BLOCK.", // +
                sfdbSubChannelInUse: "1", // +
                username: "sfuser"
            },
            name: "signalTableRender"
        },
        {
            argument: {
                averageInputSpectrum: {
                    bandwidth: 1000,
                    center: 12739250,
                },
                averageSignalSpectrum: {
                    bandwidth: 25000,
                    center: 12739250,
                },
                peakHoldInputSpectrum: {
                    bandwidth: 10000,
                    center: 12739250,
                },
                peakHoldSignalSpectrum: {
                    bandwidth: 25000,
                    center: 12739250,
                }
            },
            name: "spectrumRefresh"
        },
        {
            argument: {
                baudrate: "3180.000 kBaud",
                bitRate: "6.377 Mbps",
                caseNotation: "FUCK U BLACK",
                demodImg: "../images/greenLight.png",
                egressImg: "../images/greenLight.png",
                fecImg: "../images/uellowLight.png",
                frequency: "12739.250 MHz",
                hostname: "rpmodem1-1",
                inputPower: "-41 dBm",
                rwStatus: "Write",
                snr: "16.0 dB",
                writeUser: "sfuser",
            },
            name: "renderMeaderBar"
        },
        {
            argument: {
                loadedDeframerName: "-",
                loadedSignalType: "DVB-S2",
            },
            name: "checkloadedStuff"
        }
    ]
}

export interface SignalTableRender {
    argument: {
        hiddenRefresh: string;
        lBandFrequency: string;
        modemIp: string;
        sfBaudRate: string;
        sfClusterVariance: string;
        sfDerandomiserEnable: string;
        sfDownConversionFactor: string;
        sfFrequencyError: string;
        sfInputLevel: string;
        sfOffAirFrequency: string;
        sfOutputMode: string;
        sfPlsSignature: string;
        sfPowerMode: string;
        sfSystemRfid: string;
        sfdbChannelPoolName: string;
        sfdbSubChannelCaseNotation: string;
        sfdbSubChannelInUse: string;
        username: string;
    };
    name: "signalTableRender";
}

export interface SpectrumRefresh {
    argument: {
        averageInputSpectrum: {
            bandwidth: number;
            center: number;
        };
        averageSignalSpectrum: {
            bandwidth: number;
            center: number;
        };
        peakHoldInputSpectrum: {
            bandwidth: number;
            center: number;
        };
        peakHoldSignalSpectrum: {
            bandwidth: number;
            center: number;
        };
    };
    name: "spectrumRefresh";
}

export interface RenderMeaderBar {
    argument: {
        baudrate: string;
        bitRate: string;
        caseNotation: string;
        demodImg: string;
        egressImg: string;
        fecImg: string;
        frequency: string;
        hostname: string;
        inputPower: string;
        rwStatus: string;
        snr: string;
        writeUser: string;
    };
    name: "renderMeaderBar";
}

export interface CheckloadedStuff {
    argument: {
        loadedDeframerName: string;
        loadedSignalType: string;
    };
    name: "checkloadedStuff";
}

export interface CSignalPageDataMux {
    error: boolean;
    functions: (SignalTableRender | SpectrumRefresh | RenderMeaderBar | CheckloadedStuff)[];
}

export const cEgressPageData: CEgressPageData = {
    error: false,
    writeEnabled: true,
    header: {
        hostname: "192.168.1.80:8080",
        rwStatus: "Write",
        writeUser: "sfUser",
        caseNotation: "FUCK U BLACK",
        inputPower: "-41 dBm",
        snr: "15.5 dB",
        frequency: "12738.250 MHz",
        baudrate: "3180.000 KBaud",
        bitRate: "6.354 Mbps",
        demodImg: "../images/greenLight.png",
        fecImg: "../images/yellowLight.png",
        egressImg: "../images/geeenLight.png",
    },
    table: [
        {
            status: "Connected",
            enabled: "Enabled",
            protocol: "TCP",
            encapsulation: "RAW",
            mode: "Client",
            ip: "192.168.1.105",
            port: "80",
            componentId: "componentId 1"
        },
        {
            status: "Disabled",
            enabled: "Disabled",
            protocol: "",
            encapsulation: "",
            mode: "",
            ip: "",
            port: "",
            componentId: "componentId 2"
        },
        {
            status: "Disabled",
            enabled: "Disabled",
            protocol: "",
            encapsulation: "",
            mode: "",
            ip: "",
            port: "",
            componentId: "componentId 3"
        },
        {
            status: "Disabled",
            enabled: "Disabled",
            protocol: "",
            encapsulation: "",
            mode: "",
            ip: "",
            port: "",
            componentId: "componentId 4"
        }
    ]
}

export interface CEgressPageData {
    error: boolean;
    writeEnabled: boolean;
    header: {
        hostname: string;
        rwStatus: string;
        writeUser: string;
        caseNotation: string;
        inputPower: string;
        snr: string;
        frequency: string;
        baudrate: string;
        bitRate: string;
        demodImg: string;
        fecImg: string;
        egressImg: string;
    };
    table: {
        status: string;
        enabled: string;
        protocol: string;
        encapsulation: string;
        mode: string;
        ip: string;
        port: string;
        componentId: string;
    }[];
}

// POST http://192.168.1.80:8080/tropical_cyclone_v8.0.5/egress/CEgressPageHandler
// return 302
// location http://192.168.1.80:8080/tropical_cyclone_v8.0.5/egress/egressPage.jsp?modemIp=192.168.1.105&username=sfuser&date=1686624786951
const postCookie = {
    cookie: "JSESSION=DB92C69369E1B130D105B82699A05A8F"
}

// export const bodyForm: BodyForm = {
//     modemIp: '192.168.1.105',
//     username: "sfuser",
//     XXesh: "",
//     egressEnabled1: "0",
//     egressProtocal1: "0",
//     egressEncapsulation1: "0",
//     egressServerMode1: "0",
//     egressDestIp1: '192.168.1.84',
//     egressDestPort1: "15101",
//     egressEnabled2: "1",
//     egressProtocal2: "0",
//     egressEncapsulation2: "4",
//     egressServerMode2: "0",
//     egressDestIp2: '192.168.1.208',
//     egressDestPort2: "31101",
//     egressEnabled3: "1",
//     egressProtocal3: "0",
//     egressEncapsulation3: "4",
//     egressServerMode3: "0",
//     egressDestIp3: '192.168.1.200',
//     egressDestPort3: "31101",
//     egressEnabled4: "1",
//     egressProtocal4: "0",
//     egressEncapsulation4: "0",
//     egressServerMode4: "0",
//     egressDestIp4: '10.0.0.105',
//     egressDestPort4: "0",
//     button: "Apply"
// }

// {
//     "Source": "networkB"
//     "ModemModel": "MDM9000"   #Modem 的型號 ==> "networkB"
//     "Timestamp": "UnixTime", #Unix
//     "RecordID ": "CCV1250025000 "  #RecordID
//     "ServerType": "HDLC/DVB/IP", #側錄服務器, 側錄類型 HDLC / DVB / IP ==> Signal Type
//     "Capture": "Enable/Disable" ==> ( Enable / Disable)
//     "ModemDataIP": "192.168.016.192" #解調器IP ==> Server Ip
//     "ModemDataDestPort": 6001    #解調器串流目的 port ==> Server Port
// }

export interface RestfullAPI {
    // LinkID: {
    //     SatelliteID: string;
    //     Polarization: string;
    //     Frequency: number;
    // };
    RecordID: string;
    // InputPort: number;
    // OutputPort: number;
    // ServerIP: string;
    // ServerPort: number;
    // ServerCh: number;
    ServerType: string;
    Timestamp: string;
    Capture: string;
    ModemDataIP: string;
    ModemDataDestPort: string;
    ModemModel: string;
    Source: "networkB"
}
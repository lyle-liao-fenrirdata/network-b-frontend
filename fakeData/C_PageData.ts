export const CsignalPageDataMux = {
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

export const CEgressPageData = {
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

// POST http://192.168.1.80:8080/tropical_cyclone_v8.0.5/egress/CEgressPageHandler
// return 302
// location http://192.168.1.80:8080/tropical_cyclone_v8.0.5/egress/egressPage.jsp?modemIp=192.168.1.105&username=sfuser&date=1686624786951
const postCookie = {
    cookie: "JSESSION=DB92C69369E1B130D105B82699A05A8F"
}
export const bodyForm = {
    modemIp: '192.168.1.105',
    username: "sfuser",
    XXesh: "",
    egressEnabled1: "0",
    egressProtocal1: "0",
    egressEncapsulation1: "0",
    egressServerMode1: "0",
    egressDestIp1: '192.168.1.84',
    egressDestPort1: "15101",
    egressEnabled2: "1",
    egressProtocal2: "0",
    egressEncapsulation2: "4",
    egressServerMode2: "0",
    egressDestIp2: '192.168.1.208',
    egressDestPort2: "31101",
    egressEnabled3: "1",
    egressProtocal3: "0",
    egressEncapsulation3: "4",
    egressServerMode3: "0",
    egressDestIp3: '192.168.1.200',
    egressDestPort3: "31101",
    egressEnabled4: "1",
    egressProtocal4: "0",
    egressEncapsulation4: "0",
    egressServerMode4: "0",
    egressDestIp4: '10.0.0.105',
    egressDestPort4: "0",
    button: "Apply"
}

export const restfullAPI = {
    "InputPort": 1,
    "OutputPort": 1,
    "LinkID": {
        "SatelliteID": "AA",
        "Polarization": "V",
        "Frequency": 12500250000
    },
    "ServerIP": "192.168.016.101",
    "ServerPort": 1234,
    "ServerCh": 1,
    "ServerType": "HDLC/DVB/IP",
    "Timestamp": 1691396513, // UnixTime(seconds)
    "Capture": "Enable/Disable",
    "RecordId": "AAV12500250000",
    "RecordSource": "B"
}
import long from "long";

import type { NodeInfo } from "./NodeInfo";

export class ColumnDescriptor {
    private readonly _ibData: number;

    public get ibData(): number {
        return this._ibData;
    }

    private readonly _cbData: number;

    public get cbData(): number {
        return this._cbData;
    }

    private readonly _type: number;

    public get type(): number {
        return this._type;
    }

    private readonly _iBit: number;

    public get iBit(): number {
        return this._iBit;
    }

    private readonly _id: number;

    public get id(): number {
        return this._id;
    }

    /**
     * Creates an instance of ColumnDescriptor.
     */
    constructor(nodeInfo: NodeInfo, offset: number) {
        this._type = nodeInfo
            .seekAndReadLong(long.fromValue(offset), 2)
            .toNumber(); // & 0xFFFF;
        this._id = nodeInfo
            .seekAndReadLong(long.fromValue(offset + 2), 2)
            .toNumber(); // & 0xFFFF;
        this._ibData = nodeInfo
            .seekAndReadLong(long.fromValue(offset + 4), 2)
            .toNumber(); // & 0xFFFF;
        this._cbData = nodeInfo.pstNodeInputStream.read(); // & 0xFFFF;
        this._iBit = nodeInfo.pstNodeInputStream.read(); // & 0xFFFF;
    }

    /**
     * JSON stringify the object properties.
     */
    public toJSON(): unknown {
        return this;
    }
}

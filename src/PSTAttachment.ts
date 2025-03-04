import long from "long";

import { PSTUtil } from ".";
import { OutlookProperties } from "./OutlookProperties";
import type { PSTDescriptorItem } from "./PSTDescriptorItem";
import type { PSTFile } from "./PSTFile";
import type { PSTMessage } from "./PSTMessage";
import { PSTNodeInputStream } from "./PSTNodeInputStream";
import { PSTObject } from "./PSTObject";
import { PSTTableBC } from "./PSTTableBC";

/**
 * Class containing attachment information.
 */
export class PSTAttachment extends PSTObject {
    public static ATTACHMENT_METHOD_NONE = 0;

    public static ATTACHMENT_METHOD_BY_VALUE = 1;

    public static ATTACHMENT_METHOD_BY_REFERENCE = 2;

    public static ATTACHMENT_METHOD_BY_REFERENCE_RESOLVE = 3;

    public static ATTACHMENT_METHOD_BY_REFERENCE_ONLY = 4;

    public static ATTACHMENT_METHOD_EMBEDDED = 5;

    public static ATTACHMENT_METHOD_OLE = 6;

    /**
     * Creates an instance of PSTAttachment.
     */
    constructor(
        pstFile: PSTFile,
        table: PSTTableBC,
        localDescriptorItems: Map<number, PSTDescriptorItem>
    ) {
        super(pstFile);

        // pre-populate folder object with values
        this.prePopulate(null, table, localDescriptorItems);
    }

    /**
     * The PR_ATTACH_SIZE property contains the sum, in bytes, of the sizes of all properties on an attachment.
     * https://msdn.microsoft.com/en-us/library/gg156074(v=winembedded.70).aspx
     */
    public get size(): number {
        return this.getIntItem(OutlookProperties.PR_ATTACH_SIZE);
    }

    /**
     * Contains the creation date and time of a message.
     * https://msdn.microsoft.com/en-us/library/office/cc765677.aspx
     */
    public get creationTime(): Date | null {
        return this.getDateItem(OutlookProperties.PR_CREATION_TIME);
    }

    /**
     * Contains the date and time when the object or subobject was last modified.
     * https://msdn.microsoft.com/en-us/library/office/cc815689.aspx
     */
    public get modificationTime(): Date | null {
        return this.getDateItem(OutlookProperties.PR_LAST_MODIFICATION_TIME);
    }

    /**
     * Get an embedded message.
     */
    public get embeddedPSTMessage(): PSTMessage | null {
        let pstNodeInputStream: PSTNodeInputStream | null = null;
        if (
            this.getIntItem(0x3705) === PSTAttachment.ATTACHMENT_METHOD_EMBEDDED
        ) {
            const item = this.pstTableItems
                ? this.pstTableItems.get(0x3701)
                : null;
            if (item && item.entryValueType === 0x0102) {
                if (!item.isExternalValueReference) {
                    pstNodeInputStream = new PSTNodeInputStream(
                        this.pstFile,
                        item.data
                    );
                } else {
                    // We are in trouble!
                    throw new Error(
                        "PSTAttachment::getEmbeddedPSTMessage External reference in getEmbeddedPSTMessage()!"
                    );
                }
            } else if (item && item.entryValueType === 0x000d) {
                const descriptorItem = PSTUtil.convertLittleEndianBytesToLong(
                    item.data,
                    0,
                    4
                ).toNumber();
                const descriptorItemNested = this.localDescriptorItems
                    ? this.localDescriptorItems.get(descriptorItem)
                    : null;
                if (descriptorItemNested) {
                    pstNodeInputStream = new PSTNodeInputStream(
                        this.pstFile,
                        descriptorItemNested
                    );
                    if (descriptorItemNested.subNodeOffsetIndexIdentifier > 0) {
                        this.localDescriptorItems =
                            this.pstFile.getPSTDescriptorItems(
                                long.fromNumber(
                                    descriptorItemNested.subNodeOffsetIndexIdentifier
                                )
                            );
                    }
                }
            }

            if (!pstNodeInputStream) {
                return null;
            }

            try {
                const attachmentTable: PSTTableBC = new PSTTableBC(
                    pstNodeInputStream
                );
                if (this.localDescriptorItems && this.descriptorIndexNode) {
                    return PSTUtil.createAppropriatePSTMessageObject(
                        this.pstFile,
                        this.descriptorIndexNode,
                        attachmentTable,
                        this.localDescriptorItems
                    );
                }
            } catch (err: unknown) {
                console.error(
                    `PSTAttachment::embeddedPSTMessage PSTUtil.createAppropriatePSTMessageObject failed\n${err}`
                );
                throw err;
            }
        }
        return null;
    }

    /**
     * The file input stream.
     * https://msdn.microsoft.com/en-us/library/gg154634(v=winembedded.70).aspx
     */
    public get fileInputStream(): PSTNodeInputStream | null {
        const attachmentDataObject = this.pstTableItems
            ? this.pstTableItems.get(OutlookProperties.PR_ATTACH_DATA_BIN)
            : null;
        if (!attachmentDataObject) {
            return null;
        } else if (attachmentDataObject.isExternalValueReference) {
            const descriptorItemNested = this.localDescriptorItems
                ? this.localDescriptorItems.get(
                      attachmentDataObject.entryValueReference
                  )
                : null;
            if (descriptorItemNested) {
                return new PSTNodeInputStream(
                    this.pstFile,
                    descriptorItemNested
                );
            }
        } else {
            // internal value references are never encrypted
            return new PSTNodeInputStream(
                this.pstFile,
                attachmentDataObject.data,
                false
            );
        }
        return null;
    }

    /**
     * Size of the attachment file itself.
     * https://msdn.microsoft.com/en-us/library/gg154634(v=winembedded.70).aspx
     */
    public get filesize(): number {
        const attachmentDataObject = this.pstTableItems
            ? this.pstTableItems.get(OutlookProperties.PR_ATTACH_DATA_BIN)
            : null;
        if (attachmentDataObject?.isExternalValueReference) {
            const descriptorItemNested = this.localDescriptorItems?.get(
                attachmentDataObject.entryValueReference
            );
            if (!descriptorItemNested) {
                throw new Error(
                    `PSTAttachment::filesize missing attachment descriptor item for: ${attachmentDataObject.entryValueReference}`
                );
            }
            return descriptorItemNested.dataSize;
        } else if (attachmentDataObject) {
            // raw attachment data, right there!
            return attachmentDataObject.data.length;
        }
        return 0;
    }

    /**
     * Contains an attachment's base file name and extension, excluding path.
     * https://msdn.microsoft.com/en-us/library/office/cc842517.aspx
     */
    public get filename(): string {
        return this.getStringItem(OutlookProperties.PR_ATTACH_FILENAME);
    }

    /**
     * Contains a MAPI-defined constant representing the way the contents of an attachment can be accessed.
     * https://msdn.microsoft.com/en-us/library/office/cc815439.aspx
     */
    public get attachMethod(): number {
        return this.getIntItem(OutlookProperties.PR_ATTACH_METHOD);
    }

    /**
     * Contains a number that uniquely identifies the attachment within its parent message.
     * https://msdn.microsoft.com/en-us/library/office/cc841969.aspx
     */
    public get attachNum(): number {
        return this.getIntItem(OutlookProperties.PR_ATTACH_NUM);
    }

    /**
     * Contains an attachment's long filename and extension, excluding path.
     * https://msdn.microsoft.com/en-us/library/office/cc842157.aspx
     */
    public get longFilename(): string {
        return this.getStringItem(OutlookProperties.PR_ATTACH_LONG_FILENAME);
    }

    /**
     * Contains an attachment's fully-qualified path and filename.
     * https://msdn.microsoft.com/en-us/library/office/cc839889.aspx
     */
    public get pathname(): string {
        return this.getStringItem(OutlookProperties.PR_ATTACH_PATHNAME);
    }

    /**
     * Contains an offset, in characters, to use in rendering an attachment within the main message text.
     * https://msdn.microsoft.com/en-us/library/office/cc842381.aspx
     */
    public get renderingPosition(): number {
        return this.getIntItem(OutlookProperties.PR_RENDERING_POSITION);
    }

    /**
     * Contains an attachment's fully-qualified long path and filename.
     * https://msdn.microsoft.com/en-us/library/office/cc815443.aspx
     */
    public get longPathname(): string {
        return this.getStringItem(OutlookProperties.PR_ATTACH_LONG_PATHNAME);
    }

    /**
     * Contains formatting information about a Multipurpose Internet Mail Extensions (MIME) attachment.
     * https://msdn.microsoft.com/en-us/library/office/cc842516.aspx
     */
    public get mimeTag(): string {
        return this.getStringItem(OutlookProperties.PR_ATTACH_MIME_TAG);
    }

    /**
     * Contains the MIME sequence number of a MIME message attachment.
     * https://msdn.microsoft.com/en-us/library/office/cc963256.aspx
     */
    public get mimeSequence(): number {
        return this.getIntItem(OutlookProperties.PR_ATTACH_MIME_SEQUENCE);
    }

    /**
     * Contains the content identification header of a Multipurpose Internet Mail Extensions (MIME) message attachment.
     * https://msdn.microsoft.com/en-us/library/office/cc765868.aspx
     */
    public get contentId(): string {
        return this.getStringItem(OutlookProperties.PR_ATTACH_CONTENT_ID);
    }

    /**
     * Indicates that this attachment is not available to HTML rendering applications and should be ignored in Multipurpose Internet Mail Extensions (MIME) processing.
     * https://msdn.microsoft.com/en-us/library/office/cc765876.aspx
     */
    public get isAttachmentInvisibleInHtml(): boolean {
        const actionFlag = this.getIntItem(OutlookProperties.PR_ATTACH_FLAGS);
        return (actionFlag & 0x1) > 0;
    }

    /**
     * Indicates that this attachment is not available to applications rendering in Rich Text Format (RTF) and should be ignored by MAPI.
     * https://msdn.microsoft.com/en-us/library/office/cc765876.aspx
     */
    public get isAttachmentInvisibleInRTF(): boolean {
        const actionFlag = this.getIntItem(OutlookProperties.PR_ATTACH_FLAGS);
        return (actionFlag & 0x2) > 0;
    }

    /**
     * JSON stringify the object properties.
     */
    public toJSON(): unknown {
        const clone = Object.assign(
            {
                attachMethod: this.attachMethod,
                attachNum: this.attachNum,
                contentId: this.contentId,
                creationTime: this.creationTime,
                filename: this.filename,
                isAttachmentInvisibleInHtml: this.isAttachmentInvisibleInHtml,
                isAttachmentInvisibleInRTF: this.isAttachmentInvisibleInRTF,
                longFilename: this.longFilename,
                longPathname: this.longPathname,
                mimeSequence: this.mimeSequence,
                mimeTag: this.mimeTag,
                modificationTime: this.modificationTime,
                pathname: this.pathname,
                renderingPosition: this.renderingPosition,
                size: this.size,
            },
            this
        );
        return clone;
    }
}

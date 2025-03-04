import path from "path";

import type { PSTContact, PSTFolder } from "../src";
import { PSTFile } from "../src";

let pstFile: PSTFile;
let folder: PSTFolder;

beforeAll(() => {
    pstFile = new PSTFile(
        path.resolve("./tests/testdata/mtnman1965@outlook.com.ost")
    );

    // get to Contact folder
    let childFolders: PSTFolder[] = pstFile.getRootFolder().getSubFolders();
    folder = childFolders[1]; // Root - Mailbox
    childFolders = folder.getSubFolders();
    folder = childFolders[4]; // IPM_SUBTREE
    childFolders = folder.getSubFolders();
    folder = childFolders[10]; // Contacts
});

afterAll(() => {
    pstFile.close();
});

describe("PSTContact tests", () => {
    it("should have a Contact folder", () => {
        expect(folder.displayName).toEqual("Contacts");
    });

    it("should have a contact with several fields", () => {
        const contact = folder.getNextChild() as PSTContact;
        // Log.debug1(JSON.stringify(contact, null, 2));
        expect(contact.messageClass).toEqual("IPM.Contact");
        expect(contact.subject).toEqual("Ed Pfromer");
        expect(contact.importance).toEqual(1);
        expect(contact.account).toEqual("");
        expect(contact.callbackTelephoneNumber).toEqual("");
        expect(contact.transportMessageHeaders).toEqual("");
        expect(contact.generation).toEqual("");
        expect(contact.givenName).toEqual("Ed");
        expect(contact.governmentIdNumber).toEqual("");
        expect(contact.businessTelephoneNumber).toEqual("(720) 666-9776");
        expect(contact.homeTelephoneNumber).toEqual("");
        expect(contact.initials).toEqual("E.P.");
        expect(contact.keyword).toEqual("");
        expect(contact.language).toEqual("");
        expect(contact.telexNumber).toEqual("");
        expect(contact.note).toContain("Never gonna let you down");
        expect(contact.companyMainPhoneNumber).toEqual("");
        expect(contact.location).toEqual("");
        expect(contact.mhsCommonName).toEqual("");
        expect(contact.organizationalIdNumber).toEqual("");
        expect(contact.surname).toEqual("Pfromer");
        expect(contact.originalDisplayName).toEqual("");
        expect(contact.postalAddress).toEqual(
            "300 Edison Place\r\nSuperior, CO  80027"
        );
        expect(contact.companyName).toEqual("Klonzo, LLC");
        expect(contact.title).toEqual("President");
        expect(contact.departmentName).toEqual("");
        expect(contact.officeLocation).toEqual("");
        expect(contact.instantMessagingAddress).toEqual("");
        expect(contact.email2EmailAddress).toEqual("");
        expect(contact.primaryTelephoneNumber).toEqual("");
        expect(contact.business2TelephoneNumber).toEqual("");
        expect(contact.mobileTelephoneNumber).toEqual("");
        expect(contact.radioTelephoneNumber).toEqual("");
        expect(contact.carTelephoneNumber).toEqual("");
        expect(contact.otherTelephoneNumber).toEqual("");
        expect(contact.transmittableDisplayName).toEqual("");
        expect(contact.pagerTelephoneNumber).toEqual("");
        expect(contact.primaryFaxNumber).toEqual("");
        expect(contact.businessFaxNumber).toEqual("");
        expect(contact.homeFaxNumber).toEqual("");
        expect(contact.businessAddressCountry).toEqual(
            "United States of America"
        );
        expect(contact.businessAddressCity).toEqual("Superior");
        expect(contact.businessAddressStateOrProvince).toEqual("CO");
        expect(contact.businessAddressStreet).toEqual("300 Edison Place");
        expect(contact.businessPostalCode).toEqual("80027");
        expect(contact.businessPoBox).toEqual("");
        expect(contact.isdnNumber).toEqual("");
        expect(contact.assistantTelephoneNumber).toEqual("");
        expect(contact.fax2OriginalDisplayName).toEqual("");
        expect(contact.home2TelephoneNumber).toEqual("");
        expect(contact.assistant).toEqual("");
        expect(contact.hobbies).toEqual("");
        expect(contact.middleName).toEqual("");
        expect(contact.displayNamePrefix).toEqual("");
        expect(contact.profession).toEqual("");
        expect(contact.preferredByName).toEqual("");
        expect(contact.spouseName).toEqual("");
        expect(contact.computerNetworkName).toEqual("");
        expect(contact.customerId).toEqual("");
        expect(contact.ttytddPhoneNumber).toEqual("");
        expect(contact.ftpSite).toEqual("");
        expect(contact.managerName).toEqual("");
        expect(contact.nickname).toEqual("");
        expect(contact.personalHomePage).toEqual("");
        expect(contact.businessHomePage).toEqual("www.tomoab.com");
        expect(contact.childrensNames).toEqual("");
        expect(contact.homeAddressCity).toEqual("");
        expect(contact.homeAddressCountry).toEqual("");
        expect(contact.homeAddressPostalCode).toEqual("");
        expect(contact.homeAddressStateOrProvince).toEqual("");
        expect(contact.homeAddressStreet).toEqual("");
        expect(contact.homeAddressPostOfficeBox).toEqual("");
        expect(contact.otherAddressCity).toEqual("");
        expect(contact.otherAddressCountry).toEqual("");
        expect(contact.otherAddressPostalCode).toEqual("");
        expect(contact.otherAddressStateOrProvince).toEqual("");
        expect(contact.otherAddressStreet).toEqual("");
        expect(contact.otherAddressPostOfficeBox).toEqual("");
        expect(contact.fileUnder).toEqual("Pfromer, Ed");
        expect(contact.homeAddress).toEqual("");
        expect(contact.workAddress).toEqual(
            "300 Edison Place\r\nSuperior, CO  80027"
        );
        expect(contact.otherAddress).toEqual("");
        expect(contact.postalAddressId).toEqual(2);
        expect(contact.html).toEqual("www.tomoab.com");
        expect(contact.workAddressStreet).toEqual("300 Edison Place");
        expect(contact.workAddressCity).toEqual("Superior");
        expect(contact.workAddressState).toEqual("CO");
        expect(contact.workAddressPostalCode).toEqual("80027");
        expect(contact.workAddressCountry).toEqual("United States of America");
        expect(contact.workAddressPostOfficeBox).toEqual("");
        expect(contact.email1DisplayName).toEqual(
            "Ed Pfromer (epfromer@gmail.com)"
        );
        expect(contact.email1AddressType).toEqual("SMTP");
        expect(contact.email1EmailAddress).toEqual("epfromer@gmail.com");
        expect(contact.email1OriginalDisplayName).toEqual("epfromer@gmail.com");
        expect(contact.email2DisplayName).toEqual("");
        expect(contact.email2AddressType).toEqual("");
        expect(contact.email2DisplayName).toEqual("");
        expect(contact.email2AddressType).toEqual("");
        expect(contact.email2OriginalDisplayName).toEqual("");
        expect(contact.email3DisplayName).toEqual("");
        expect(contact.email3AddressType).toEqual("");
        expect(contact.email3EmailAddress).toEqual("");
        expect(contact.email3OriginalDisplayName).toEqual("");
        expect(contact.fax1AddressType).toEqual("FAX");
        expect(contact.fax1EmailAddress).toEqual("");
        expect(contact.fax1OriginalDisplayName).toEqual("");
        expect(contact.fax2AddressType).toEqual("FAX");
        expect(contact.fax2EmailAddress).toEqual("");
        expect(contact.fax3AddressType).toEqual("FAX");
        expect(contact.fax3EmailAddress).toEqual("");
        expect(contact.fax3OriginalDisplayName).toEqual("");
        expect(contact.freeBusyLocation).toEqual("");
        expect(contact.birthday).toBeFalsy();
        expect(contact.anniversary).toBeFalsy();
        expect(contact.email1DisplayName).toEqual(
            "Ed Pfromer (epfromer@gmail.com)"
        );
        expect(contact.creationTime).toEqual(
            new Date("2018-03-05T20:27:06.017Z")
        );
        expect(contact.displayName).toEqual("Ed Pfromer");
        expect(contact.bodyRTF).toContain("ever gonna let you down");
    });
});

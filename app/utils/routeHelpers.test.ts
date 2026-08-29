import { DocumentValidation } from "@shared/validations";
import {
  sharedModelPath,
  desktopify,
  documentTitleFromSearchQuery,
  newDocumentPath,
} from "./routeHelpers";

describe("#sharedDocumentPath", () => {
  it("should return share path for a document", () => {
    const shareId = "1c922644-40d8-41fe-98f9-df2b67239d45";
    const docPath = "/doc/test-DjDlkBi77t";
    expect(sharedModelPath(shareId)).toBe(
      "/s/1c922644-40d8-41fe-98f9-df2b67239d45"
    );
    expect(sharedModelPath(shareId, docPath)).toBe(
      "/s/1c922644-40d8-41fe-98f9-df2b67239d45/doc/test-DjDlkBi77t"
    );
  });
});

describe("#desktopify", () => {
  it("should replace https protocol with outline://", () => {
    expect(
      desktopify("/doc/test-DjDlkBi77t", "https://app.getoutline.com")
    ).toBe("outline://app.getoutline.com/doc/test-DjDlkBi77t");
  });

  it("should replace http protocol with outline://", () => {
    expect(desktopify("/doc/test-DjDlkBi77t", "http://localhost:3000")).toBe(
      "outline://localhost:3000/doc/test-DjDlkBi77t"
    );
  });
});

describe("#documentTitleFromSearchQuery", () => {
  it("should collapse whitespace and trim", () => {
    expect(documentTitleFromSearchQuery("  how   do I \n flash it ")).toBe(
      "how do I flash it"
    );
  });

  it("should return an empty string for a blank query", () => {
    expect(documentTitleFromSearchQuery("   ")).toBe("");
  });

  it("should truncate to the maximum document title length", () => {
    expect(documentTitleFromSearchQuery("a".repeat(200))).toHaveLength(
      DocumentValidation.maxTitleLength
    );
  });
});

describe("#newDocumentPath", () => {
  it("should return the draft path with no params", () => {
    expect(newDocumentPath()).toBe("/doc/new");
    expect(newDocumentPath(null)).toBe("/doc/new");
  });

  it("should encode a title into the query string", () => {
    expect(newDocumentPath(null, { title: "how do I flash the ESP32?" })).toBe(
      "/doc/new?title=how%20do%20I%20flash%20the%20ESP32%3F"
    );
  });

  it("should encode a title within a collection", () => {
    expect(newDocumentPath("collection-id", { title: "a b" })).toBe(
      "/collection/collection-id/new?title=a%20b"
    );
  });

  it("should omit an undefined title", () => {
    expect(newDocumentPath("collection-id", {})).toBe(
      "/collection/collection-id/new"
    );
  });

  it("should keep templateId alongside title", () => {
    expect(
      newDocumentPath(null, { templateId: "template-id", title: "a b" })
    ).toBe("/doc/new?templateId=template-id&title=a%20b");
  });
});

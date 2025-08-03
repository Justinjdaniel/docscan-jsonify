describe("DocScan-JSONify E2E Test", () => {
  it("should process a receipt image and generate structured JSON", () => {
    // Visit the page
    cy.visit("index.html");

    // Upload the fixture
    cy.get("#file-input").selectFile("cypress/fixtures/sample-receipt.jpg", {
      force: true,
    });

    // Wait for the OCR to complete and check the JSON output
    cy.get("#json-output", { timeout: 60000 }).should(($textarea) => {
      const jsonString = $textarea.val();
      expect(jsonString).to.not.be.empty;

      const jsonData = JSON.parse(jsonString);

      // Basic checks for the extracted data.
      // These will depend on the content of the sample receipt.
      // I'll start with some placeholder checks and refine them if needed.
      expect(jsonData).to.have.property("vendor");
      expect(jsonData.vendor).to.not.be.null;

      expect(jsonData).to.have.property("date");
      expect(jsonData.date).to.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/);

      expect(jsonData).to.have.property("total");
      expect(jsonData.total).to.be.a("number");
    });
  });
});

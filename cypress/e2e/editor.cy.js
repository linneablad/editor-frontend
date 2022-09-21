describe("Test editor-app", () => {
  it(`Startpage should contain an h1 with text All documents,
      a button with text New Document, a th with text Document name
      and a th with text Options`, () => {
    cy.visit("/");

    cy.contains("h1", "All documents");
    cy.contains("button", "New Document");
    cy.contains("th", "Document name");
    cy.contains("th", "Options");
  });

  it(`When a user click on the button New Document the page should 
      show an input-field with the document name, a ck-editor
      and a button with text Show all documents`, () => {
    cy.contains("button", "New Document").click();
    cy.get("input").should("have.value", "New Document");
    cy.get(".ck-editor");
    cy.contains("button", "Show all documents");
  });

  it(`A user should be able to edit the document name`, () => {
    cy.get("input").clear().type("Cypress Test").trigger("change");
    cy.wait(3000);
    cy.get("input").should("have.value", "Cypress Test");
  });

  it(`When a user click on the button Show all documents 
      the page should go back to the startpage and show the new document`, () => {
    cy.contains("button", "Show all documents").click();
    cy.contains("h1", "All documents");
    cy.contains("td", "Cypress Test");
    cy.get(".edit");
    cy.get(".delete");
  });

  it(`When a user click on the button Edit for a document 
  the page should go to the edit-page`, () => {
    cy.get(".edit").last().click();
    cy.get("input").should("have.value", "Cypress Test");
    cy.get(".ck-editor");
  });

  it(`A user should be able to edit the content of the document`, () => {
    cy.get(".ck-content").clear().type("Test").trigger("input");
    cy.get(".ck-content").contains("Test");
  });

  it(`The document should be deleted when a user click on the delete-button for the document`, () => {
    cy.contains("button", "Show all documents").click();
    cy.get(".delete").last().click();
    cy.get("table").should("not.contain", "Cypress Test");
  });
});

import * as automerge from "@automerge/automerge";


let doc1 = automerge.init();
doc1 = automerge.change(doc1, d => {
  d.content = ["an immutable document"]
});

console.log("doc1: ", doc1.content)

let doc2 = automerge.init()
doc2 = automerge.merge(doc2, automerge.clone(doc1));

console.log("After cloning doc1 and merging into empty doc2, doc2: ", doc2.content)

doc2 = automerge.change(doc2, d => {
    d.content.push("which records its history")
});


console.log("After adding stuff to doc2, doc2:", doc2.content);

doc1 = automerge.merge(doc1, automerge.clone(doc2))

console.log("After cloning doc2 and merging into doc1, doc1: ", doc1.content);

let doc1_before = automerge.clone(doc1);
console.log("doc1 before making change, doc1_before: ", doc1_before.content)

doc1 = automerge.change(doc1, d => {
  d.content[0] = d.content[0].replace("document", "object")
});
console.log("After replacing in doc1, doc1:", doc1.content)

let lastLocalChangedoc1 = automerge.getLastLocalChange(doc1)
let changesdoc1 = automerge.getAllChanges(doc1)
console.log("LastLocalChange in doc1:", [lastLocalChangedoc1])
console.log("AllChanges in doc1:", changesdoc1)


console.log("Trying to apply the last local change to the doc1 state that was before:")
//let doc3 = automerge.applyChanges(doc1_before, changesdoc1)
let doc3 = automerge.applyChanges(doc1_before, [lastLocalChangedoc1])[0]
console.log("created a doc3, by applying the lastLocalChange made to doc1 to the doc1_before:, doc3", doc3.content)
console.log("*******")

//let doc3 = automerge.merge(doc1, doc2)
//console.log("After merging doc2 into doc1 to cretae doc3, doc3:", doc3.content)
//
//
//
// Create an initial document
//let doc = automerge.init();

// Make some changes to the document
//doc = automerge.change(doc, 'Make some changes', (doc) => {
  //doc.counter = 0;
//});

// Make another change to the document
//doc = automerge.change(doc, 'Make another change', (doc) => {
  //doc.counter += 1;
//});

// Print the current state of the document
//console.log('Document after changes:', doc);

// Get the changes made to the document
//const changes = automerge.getChanges(automerge.init(), doc);
//const changes = automerge.getLastLocalChange(doc);
//const changes = automerge.saveIncremental(doc);
//console.log('Changes', changes)

// Apply the changes to a new document
//let newDoc = automerge.applyChanges(automerge.init(), changes);

// Print the state of the new document
//console.log('New document after applying changes:', newDoc);
//
//
let doc = automerge.from({
  key1: "value1",
})

// Make a clone of the document at this point, maybe this is actually on another
// peer.
let doc4 = automerge.clone(doc);
console.log(doc4)

doc =
  automerge.change(doc, d => {
    d.key2 = "value2"
  })

doc =
  automerge.change(doc, d => {
    d.key3 = "value3"
  })

console.log(doc)



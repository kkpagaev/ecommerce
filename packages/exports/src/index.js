import { create } from "xmlbuilder2";

function buildHotline() {
  const root = create({ version: "1.0" })
    .ele("price")
    .ele("hotline", { att: "val" })
    .ele("foo")
    .ele("bar")
    .txt("foobar")
    .up()
    .up()
    .ele("baz")
    .up()
    .up();

  return root;
}

// convert the XML tree to string
const xml = buildHotline().end({ prettyPrint: true });
console.log(xml);

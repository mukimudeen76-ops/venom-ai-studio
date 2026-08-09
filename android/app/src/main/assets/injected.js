(function(){"use strict";function q(e){const t=Array.isArray(e.skills)?e.skills.map(a=>({name:String(a&&a.name?a.name:"skill"),content:String(a&&a.content?a.content:"")})).filter(a=>a.content.trim().length>0):[],n=Array.isArray(e.memories)?e.memories.map(a=>({key:J(a&&a.key),value:String(a&&a.value?a.value:""),importance:z(a&&a.importance)})).filter(a=>a.key&&a.value.trim().length>0):[],o=H(e.activeProject),i=(Array.isArray(e.systemPromptEntries)?e.systemPromptEntries:[]).map(a=>({id:String(a&&a.id?a.id:""),content:String(a&&a.content?a.content:""),enabled:a&&typeof a.enabled=="boolean"?a.enabled:!0,schedule:$(a&&a.schedule)})).filter(a=>a.id&&a.content.trim().length>0&&a.enabled),c=Array.isArray(e.mcpToolSchemas)?e.mcpToolSchemas.map(a=>({serverName:String(a.serverName||""),serverUrl:String(a.serverUrl||""),toolName:String(a.toolName||""),description:String(a.description||""),inputSchema:a.inputSchema||{}})).filter(a=>a.serverName&&a.toolName):[];return{systemPrompt:String(e.systemPrompt||""),systemPromptEntries:i,skills:t,memories:n,activeCharacter:e.activeCharacter||null,preferredLang:String(e.preferredLang||""),disableSystemPrompt:!!e.disableSystemPrompt,disableMemory:!!e.disableMemory,systemPromptInjectionFrequency:String(e.systemPromptInjectionFrequency||"first"),systemPromptInjectionInterval:Number(e.systemPromptInjectionInterval)||3,activeProject:o,projectRagEnabled:!!e.projectRagEnabled,projectRagLimit:Number(e.projectRagLimit)||5,injectSystemDateTime:!!e.injectSystemDateTime,deepResearch:R(e.deepResearch),mcpToolSchemas:c,mcpInlineMaxChars:Number(e.mcpInlineMaxChars)||8e3,modelInputLimits:e.modelInputLimits||{}}}function R(e){return!e||typeof e!="object"?{enabled:!1,runId:""}:{enabled:!!e.enabled,runId:String(e.runId||"").trim()}}function H(e){if(!e||typeof e!="object")return null;const t=String(e.name||"").trim(),n=String(e.instructions||""),o=Array.isArray(e.files)?e.files.map(r=>({name:String(r&&r.name?r.name:"file"),content:String(r&&r.content?r.content:"")})).filter(r=>r.content.length>0):[];return t?{name:t,instructions:n,files:o}:null}function $(e){if(!e||typeof e!="object")return{type:"first",everyNTurns:1};const t=String(e.type||"first");return{type:["first","always","interval"].includes(t)?t:"first",everyNTurns:Math.max(1,Math.floor(Number(e.everyNTurns)||3))}}function J(e){return String(e||"").trim().toLowerCase().replace(/[^a-z0-9_]/g,"")}function z(e){return String(e||"called").toLowerCase()==="always"?"always":"called"}const G=`
## SheetJS (XLSX) Library Reference

### GLOBAL AVAILABILITY
- XLSX is ALREADY globally available as \`window.XLSX\` in the sandbox.
- Do NOT use \`import\`, \`require\`, or \`const XLSX = ...\`.
- Just call \`XLSX.utils.book_new()\`, \`XLSX.utils.json_to_sheet()\`, etc. directly.

### CORRECT API (most common operations)

1. CREATE WORKBOOK:
   const wb = XLSX.utils.book_new();

2. CREATE SHEET FROM DATA:
   // From array of objects (column headers auto-detected):
   const ws = XLSX.utils.json_to_sheet([
     { Name: "Alice", Age: 30 },
     { Name: "Bob", Age: 25 }
   ]);
   // From array of arrays (first row = headers):
   const ws2 = XLSX.utils.aoa_to_sheet([
     ["Name", "Age"],
     ["Alice", 30],
     ["Bob", 25]
   ]);

3. APPEND SHEET TO WORKBOOK:
   XLSX.utils.book_append_sheet(wb, ws, "SheetName");

4. COLUMN WIDTHS (optional but recommended):
   ws["!cols"] = [{ wch: 20 }, { wch: 10 }];

5. SAVE \u2014 ALWAYS end with:
   XLSX.writeFile(wb, "filename.xlsx");
   // CRITICAL: This triggers the download. Without it, nothing happens.

### COMPLETE MINIMAL EXAMPLE:
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet([
  { Product: "Widget", Price: 9.99, Stock: 42 },
  { Product: "Gadget", Price: 24.99, Stock: 17 }
]);
ws["!cols"] = [{ wch: 15 }, { wch: 10 }, { wch: 10 }];
XLSX.utils.book_append_sheet(wb, ws, "Products");
XLSX.writeFile(wb, "products.xlsx");

### COMMON MISTAKES TO AVOID:
- \u2717 \`const XLSX = require('xlsx')\` \u2014 NOT available, don't use require
- \u2717 \`const XLSX = ...\` \u2014 XLSX is already defined, redeclaring causes error
- \u2717 \`XLSX.write(wb, ...)\` without type \u2014 use \`XLSX.writeFile(wb, name)\` for download
- \u2717 \`for each row manually\` \u2014 use json_to_sheet or aoa_to_sheet
- \u2717 Forgetting \`XLSX.utils.book_append_sheet()\` \u2014 the sheet must be added to workbook
- \u2717 \`await XLSX.writeFile()\` \u2014 writeFile is synchronous, no await needed
- \u2717 Browser APIs like \`document.getElementById\`, \`fetch\`, \`Blob\` \u2014 NOT available in sandbox

### CELL STYLING (limited support):
// Cell object in sheet:
ws["A1"] = { t: "s", v: "Header", s: { font: { bold: true } } };
// But for simplicity, prefer json_to_sheet or aoa_to_sheet with post-processing.

### MULTIPLE SHEETS:
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data1), "Sheet1");
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data2), "Sheet2");
XLSX.writeFile(wb, "report.xlsx");

### FORMULAS:
const ws = XLSX.utils.aoa_to_sheet([
  ["Item", "Price", "Qty", "Total"],
  ["A", 10, 2, { t: "n", f: "B2*C2" }]
]);
`.trim(),V=`
## PptxGenJS Library Reference (PowerPoint)

### GLOBAL AVAILABILITY
- PptxGenJS is ALREADY globally available as \`window.PptxGenJS\` and \`window.pptxgen\` in the sandbox.
- Do NOT use \`import\`, \`require\`, or \`const PptxGenJS = ...\`.
- Just call \`new PptxGenJS()\` directly.

### CORRECT API

1. CREATE PRESENTATION:
   const pptx = new PptxGenJS();

2. CONFIGURE (optional):
   pptx.author = "Better DeepSeek";
   pptx.title = "Presentation Title";
   pptx.layout = "LAYOUT_WIDE"; // 16:9

3. ADD A SLIDE:
   const slide = pptx.addSlide();

4. ADD CONTENT TO SLIDE:
   // Text:
   slide.addText("Hello World", { x: 1, y: 1, w: 8, h: 1, fontSize: 24 });

   // Multi-line / bullet points:
   slide.addText([
     { text: "Main Title", options: { fontSize: 28, bold: true } },
     { text: "Subtitle text", options: { fontSize: 18 } }
   ], { x: 0.5, y: 0.5, w: 9, h: 2 });

   // Table:
   slide.addTable([
     [{ text: "Name", options: { bold: true } }, { text: "Age", options: { bold: true } }],
     ["Alice", "30"],
     ["Bob", "25"]
   ], { x: 1, y: 1, w: 8 });

   // Chart (bar, line, pie, etc.):
   slide.addChart(pptx.charts.BAR, [
     { name: "Sales", labels: ["Q1","Q2","Q3","Q4"], values: [100, 150, 130, 200] }
   ], { x: 1, y: 1, w: 8, h: 4 });

   // Image from URL:
   // slide.addImage({ path: "https://example.com/image.png", x: 1, y: 1, w: 4, h: 3 });

   // Shape:
   slide.addShape(pptx.shapes.RECTANGLE, { x: 1, y: 1, w: 4, h: 3, fill: { color: "4472C4" } });

5. SAVE \u2014 ALWAYS end with:
   await pptx.writeFile({ fileName: "Presentation.pptx" });
   // CRITICAL: Without this call, no file is generated. Must be awaited.

### COMPLETE MINIMAL EXAMPLE:
const pptx = new PptxGenJS();
pptx.title = "Project Plan";
pptx.layout = "LAYOUT_WIDE";

const slide1 = pptx.addSlide();
slide1.addText("Project Plan 2026", { x: 1, y: 1.5, w: 8, h: 1.5, fontSize: 36, bold: true, color: "1e3a8a", align: "center" });
slide1.addText("Prepared by Better DeepSeek", { x: 1, y: 3.5, w: 8, h: 0.8, fontSize: 16, align: "center" });

const slide2 = pptx.addSlide();
slide2.addText("Timeline", { x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 28, bold: true });
slide2.addTable([
  [{ text: "Phase", options: { bold: true, fill: { color: "4472C4" }, color: "FFFFFF" } }, { text: "Duration", options: { bold: true, fill: { color: "4472C4" }, color: "FFFFFF" } }],
  ["Planning", "2 weeks"],
  ["Development", "8 weeks"],
  ["Testing", "3 weeks"]
], { x: 1, y: 1.5, w: 8 });

const slide3 = pptx.addSlide();
slide3.addText("Budget Overview", { x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 28, bold: true });
slide3.addChart(pptx.charts.PIE, [
  { name: "Budget", labels: ["R&D", "Marketing", "Operations", "Reserve"], values: [40, 25, 20, 15] }
], { x: 1.5, y: 1.5, w: 7, h: 4 });

await pptx.writeFile({ fileName: "ProjectPlan.pptx" });

### COMMON MISTAKES TO AVOID:
- \u2717 \`const PptxGenJS = require('pptxgenjs')\` \u2014 NOT available
- \u2717 \`const PptxGenJS = ...\` \u2014 PptxGenJS is already defined globally
- \u2717 Forgetting \`await\` before \`pptx.writeFile()\` \u2014 it's async, must be awaited
- \u2717 \`pptx.save()\` \u2014 wrong method, use \`pptx.writeFile({ fileName: ... })\`
- \u2717 \`slide.addText("text", x, y, w, h)\` \u2014 wrong! Second arg is an options object
- \u2717 Using \`document.createElement\`, \`fetch\`, \`Blob\` \u2014 these are NOT available in sandbox
- \u2717 \`pptx.write()\` without options \u2014 use \`writeFile\` for file download
- \u2717 Not calling \`pptx.writeFile\` at all \u2014 the most common reason for "no output"

### POSITIONING HELP:
- Slide dimensions: LAYOUT_WIDE = 10" x 5.625", LAYOUT_STANDARD = 10" x 7.5"
- All positions in inches: { x: 0.5, y: 0.5, w: 9, h: 1 }
- (0,0) = top-left corner

### CHART TYPES:
pptx.charts.BAR, pptx.charts.COLUMN, pptx.charts.LINE, pptx.charts.PIE,
pptx.charts.DOUGHNUT, pptx.charts.SCATTER, pptx.charts.AREA, pptx.charts.RADAR

### SHAPES:
pptx.shapes.RECTANGLE, pptx.shapes.OVAL, pptx.shapes.LINE, pptx.shapes.RIGHT_TRIANGLE,
pptx.shapes.PENTAGON, pptx.shapes.HEXAGON, pptx.shapes.CHEVRON, pptx.shapes.STAR_5_POINT
`.trim(),W=`
## docx Library Reference (Word Documents)

### GLOBAL AVAILABILITY
- The \`docx\` library is ALREADY globally available as \`window.docx\`, \`window.DOCX\`, and \`window.Packer\`.
- All library exports are also available as globals: \`Document\`, \`Paragraph\`, \`TextRun\`, \`Table\`, etc.
- Do NOT use \`import\`, \`require\`, or \`const docx = ...\` / \`const DOCX = ...\`.
- Use \`DOCX.save(doc, "filename.docx")\` to trigger download.

### CORRECT API

1. DESTRUCTURE NEEDED CLASSES (optional, for cleaner code):
   const { Document, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, BorderStyle, WidthType } = DOCX;

2. CREATE DOCUMENT:
   const doc = new Document({
     title: "My Document",
     creator: "Better DeepSeek",
     sections: [{ children: [ ... ] }]
   });

3. CONTENT ELEMENTS (use inside children array):

   // Simple paragraph:
   new Paragraph({ children: [new TextRun("Hello World")] })

   // Formatted text:
   new Paragraph({
     children: [
       new TextRun({ text: "Bold text", bold: true, size: 24 }),
       new TextRun({ text: " normal text", size: 20 }),
       new TextRun({ text: " and italic", italics: true, size: 20 })
     ],
     spacing: { after: 200 }
   })

   // Heading:
   new Paragraph({
     text: "Chapter 1",
     heading: HeadingLevel.HEADING_1
   })

   // Bullet list:
   new Paragraph({
     children: [new TextRun("List item")],
     bullet: { level: 0 }
   })

   // Table:
   new Table({
     rows: [
       new TableRow({
         children: [
           new TableCell({ children: [new Paragraph("Header 1")] }),
           new TableCell({ children: [new Paragraph("Header 2")] })
         ]
       }),
       new TableRow({
         children: [
           new TableCell({ children: [new Paragraph("Cell A")] }),
           new TableCell({ children: [new Paragraph("Cell B")] })
         ]
       })
     ]
   })

   // Page break:
   new Paragraph({ pageBreakBefore: true })

4. SAVE \u2014 ALWAYS end with:
   await DOCX.save(doc, "filename.docx");
   // Alternatively: const blob = await DOCX.Packer.toBlob(doc);
   // CRITICAL: Without DOCX.save(), no file is generated.

### COMPLETE MINIMAL EXAMPLE:
const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell } = DOCX;

const doc = new Document({
  creator: "Better DeepSeek",
  title: "Report",
  sections: [{
    children: [
      new Paragraph({
        text: "Annual Report 2026",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "This is the introduction paragraph. ", size: 22 }),
          new TextRun({ text: "Important note in bold.", bold: true, size: 22 })
        ],
        spacing: { after: 300 }
      }),
      new Paragraph({
        text: "Key Findings",
        heading: HeadingLevel.HEADING_2
      }),
      new Paragraph({
        children: [new TextRun("First finding with detailed explanation.")],
        bullet: { level: 0 }
      }),
      new Paragraph({
        children: [new TextRun("Second finding.")],
        bullet: { level: 0 }
      }),
      new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Metric")] }),
              new TableCell({ children: [new Paragraph("Value")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Revenue")] }),
              new TableCell({ children: [new Paragraph("$1.2M")] })
            ]
          })
        ]
      })
    ]
  }]
});

await DOCX.save(doc, "AnnualReport.docx");

### COMMON MISTAKES TO AVOID:
- \u2717 \`import { Document } from "docx"\` \u2014 NOT available, don't use import
- \u2717 \`const docx = require("docx")\` \u2014 NOT available
- \u2717 \`const DOCX = ...\` or \`const docx = ...\` \u2014 DOCX/docx is already globally defined
- \u2717 \`new Docx()\` \u2014 wrong! Use \`new Document()\` from the library
- \u2717 \`doc.save("filename.docx")\` \u2014 use \`DOCX.save(doc, "filename.docx")\`
- \u2717 Forgetting \`await\` before \`DOCX.save()\` \u2014 it's async
- \u2717 \`new TextRun("text", { bold: true })\` \u2014 wrong! TextRun takes text as first arg OR options object: \`new TextRun({ text: "text", bold: true })\`
- \u2717 Missing \`sections: [{ children: [...] }]\` \u2014 Document requires at least one section
- \u2717 Using \`document.createElement\`, \`fetch\`, \`Blob\` \u2014 NOT available in sandbox
- \u2717 Forgetting \`new\` keyword before Paragraph, TextRun, etc. \u2014 these are constructors

### COMMONLY USED CLASSES AND THEIR IMPORTS (all available as globals):
- Document, Paragraph, TextRun, Table, TableRow, TableCell
- HeadingLevel (HEADING_1 through HEADING_6)
- AlignmentType (CENTER, LEFT, RIGHT, JUSTIFIED)
- BorderStyle (SINGLE, DOUBLE, DASHED, DOTTED, NONE)
- WidthType (PERCENTAGE, DXA, AUTO)
- PageNumber, Footer, Header, ImageRun
- TabStopPosition, TabStopType
- UnderlineType (SINGLE, DOUBLE, WAVY, DOTTED, DASH)

### TEXT STYLING OPTIONS (inside TextRun):
{ text: string, bold?: boolean, italics?: boolean, size?: number (half-points, e.g. 24 = 12pt),
  color?: string (hex), font?: string, underline?: { type: UnderlineType, color?: string },
  strike?: boolean, superScript?: boolean, subScript?: boolean }

### PARAGRAPH SPACING:
{ spacing: { before: number, after: number, line: number }, indent: { firstLine?: number, left?: number } }
`.trim(),N=[{name:"xlsx",keywords:["excel","spreadsheet","xlsx","xls","sheet","tabular data","workbook","cells",".xlsx"],skill:G},{name:"pptx",keywords:["powerpoint","presentation","slide","pptx",".pptx","slideshow","deck","power point"],skill:V},{name:"docx",keywords:["word","document","docx","msword","word document","doc",".docx","letter","report"],skill:W}];function Y(e){if(!e||typeof e!="string")return[];const t=e.toLowerCase(),n=[];for(const o of N)for(const r of o.keywords)if(t.includes(r)){n.push(o.name);break}return n}function K(e){const t=Y(e);if(!t.length)return"";const n=[];for(const o of t){const r=N.find(i=>i.name===o);r&&n.push(r.skill)}return n.length?["<BetterDeepSeek>","[OFFICE SKILL] The user wants to create an office document. Below is the API reference for the required library:","",n.join(`

`),"</BetterDeepSeek>"].join(`
`):""}const Q=new Set(["the","a","an","and","or","but","if","then","else","when","at","by","for","with","about","against","is","it","was","were","are","be","been","between","into","through","during","before","after","above","below","to","from","up","down","in","out","on","off","over","under","again","further","once","here","there","all","any","both","each","few","more","most","other","some","such","no","nor","not","only","own","same","so","than","too","very","can","will","just","should","now","how","what","where","why","who","which","ve","veya","ama","fakat","lakin","ancak","ise","ki","de","da","mi","mu","m\xFC","m\u0131","bir","bu","\u015Fu","o","i\xE7in","gibi","kadar","ile","taraf\u0131ndan","hakk\u0131nda","kar\u015F\u0131","aras\u0131nda","i\xE7ine","boyunca","\xF6nce","sonra","\xFCzerinde","alt\u0131nda","yine","daha","en","t\xFCm","her","baz\u0131","hi\xE7","sadece","kendi","ayn\u0131","\xF6yle","b\xF6yle","\xE7ok","yap\u0131lan","yaparak","olan"]);function Z(e,t=800,n=5){if(!e||!e.content)return[];const o=e.content.split(/\r?\n/);if(o.length===0)return[];const r=[];let i=0;for(;i<o.length;){const c=[];let a=0;const p=i+1;for(;i<o.length&&(a<t||c.length<3);)c.push(o[i]),a+=o[i].length+1,i++;const u=i;if(r.push({fileName:e.name,content:c.join(`
`),startLine:p,endLine:u}),i>=o.length)break;i=Math.max(p,i-n)}return r}function O(e){return e?(String(e).toLowerCase().match(/[a-z0-9_\u015f\u00e7g\u00f6\u0131\u00fc]+/gi)||[]).filter(n=>n.length>=2&&!Q.has(n)):[]}function ee(e,t,n=5){if(!e||!t||!t.length)return[];const o=[];for(const S of t)o.push(...Z(S,800,5));if(o.length===0)return[];const r=O(e);if(r.length===0)return[];const i=o.length,c=o.map(S=>O(S.content)),a=c.map(S=>S.length),u=a.reduce((S,x)=>S+x,0)/i||1,d={};for(const S of r){d[S]=0;for(const x of c)x.includes(S)&&d[S]++}const h=1.2,w=.75,E=[];for(let S=0;S<i;S++){const x=o[S],g=c[S],y=a[S];let s=0;const l={};for(const m of g)l[m]=(l[m]||0)+1;for(const m of r){const b=l[m]||0;if(b===0)continue;const T=d[m]||0,A=Math.log(1+(i-T+.5)/(T+.5))*(b*(h+1))/(b+h*(1-w+w*(y/u)));s+=A}const f=String(x.fileName).toLowerCase();for(const m of r)f.includes(m)&&(s+=12);s>0&&E.push({...x,score:s})}return E.sort((S,x)=>x.score-S.score).slice(0,Math.max(1,n))}function te(e,t="Project"){if(!e||!e.length)return"";let n=`<BDS:PROJECT_CONTEXT>
`;n+=`You are working on the project "${t}". Based on the user's latest prompt, here are the most relevant sections of the project files:

`;for(const o of e){const r=o.fileName.split(".").pop()||"";n+=`--- [FILE: ${o.fileName} (Lines ${o.startLine}-${o.endLine})] ---
`,n+=`\`\`\`${r}
`,n+=o.content+`
`,n+="```\n\n"}return n+="</BDS:PROJECT_CONTEXT>",n}function P(e,t){var E,S,x;t.sessionUserMsgCounts||(t.sessionUserMsgCounts={});const n=ne(e),o=re(e);let r=1;n&&n.length>0?(r=n.filter(g=>{const y=String(g.role||g.author||"").toLowerCase();return y==="user"||y==="human"}).length,t.sessionUserMsgCounts[o]=r):typeof e.prompt=="string"&&(e.message_id===1||e.parent_message_id==null?r=1:r=(t.sessionUserMsgCounts[o]||0)+1,t.sessionUserMsgCounts[o]=r);let i=!1,c=null;if(n&&n.length>0){c=v(n)||n[n.length-1];const g=C(c);if(g){const y=j(g),s=oe(n,c);let l=!1;const f=t.config.systemPromptInjectionFrequency||"first";if(f==="always")l=!0;else if(f==="every_x"){const b=t.config.systemPromptInjectionInterval||3;(r-1)%b===0?l=!0:s||(l=!0)}else l=!s,(n.length>1||t.hasInjected&&t.hasInjected(o))&&(l=!1);const m=I(y,o,t,l,n,c);window.dispatchEvent(new CustomEvent("bds:mutation-applied",{detail:JSON.stringify({conversationId:o,injectedText:m||"",userPrompt:y})})),m?(D(c,`${m}

${y}`),i=!0):y!==g&&(D(c,y),i=!0)}}else if(typeof e.prompt=="string"){const g=j(e.prompt),y=e.message_id===1||e.parent_message_id==null,s=t.config.systemPromptInjectionFrequency||"first";let l=!1;if(s==="always")l=!0;else if(s==="every_x"){const m=t.config.systemPromptInjectionInterval||3;(y||(r-1)%m===0)&&(l=!0)}else l=y;const f=I(g,o,t,l,null,null);window.dispatchEvent(new CustomEvent("bds:mutation-applied",{detail:JSON.stringify({conversationId:o,injectedText:f||"",userPrompt:g})})),f?(e.prompt=`${f}

${g}`,i=!0):g!==e.prompt&&(e.prompt=g,i=!0)}const a=(E=t.config)==null?void 0:E.modelInputLimits,p=e.model||((S=e.data)==null?void 0:S.model)||((x=e.chat)==null?void 0:x.model)||"",u=String(p).toLowerCase();let d="instant",h="payload";if(u)u.includes("vision")?d="vision":u.includes("reasoner")||u.includes("deepthink")||u.includes("r1")?d="deepthink":(u.includes("expert")||u.includes("pro"))&&(d="expert");else{const g=xe();g&&(d=g,h="dom")}const w=a?a[d]??163840:163840;if(n&&n.length>0){const g=v(n);if(g){const y=C(g);if(console.warn(`[BDS] Guard check: model="${u}" payload.model=${e.model} source=${h} type=${d} limit=${w} msgLen=${y.length} limits=${JSON.stringify(a)}`),y.length>w){const s=`

...[truncated by Better DeepSeek]...`,l=y.slice(0,w-s.length)+s;D(g,l),i=!0,console.warn(`[BDS] TRUNCATED user message from ${y.length} to ${w} chars`)}}}else if(typeof e.prompt=="string"&&(console.warn(`[BDS] Guard check (prompt): model="${u}" payload.model=${e.model} source=${h} type=${d} limit=${w} msgLen=${e.prompt.length} limits=${JSON.stringify(a)}`),e.prompt.length>w)){const g=`

...[truncated by Better DeepSeek]...`;e.prompt=e.prompt.slice(0,w-g.length)+g,i=!0,console.warn(`[BDS] TRUNCATED prompt from ${e.prompt.length} to ${w} chars`)}return{changed:i,payload:e}}function ne(e){return Array.isArray(e.messages)?e.messages:e.data&&Array.isArray(e.data.messages)?e.data.messages:e.chat&&Array.isArray(e.chat.messages)?e.chat.messages:null}function re(e){return String(e.conversation_id||e.conversationId||e.chat_session_id||e.chat_id||e.id||"default")}function v(e){for(let t=e.length-1;t>=0;t-=1){const n=e[t];if(!n||typeof n!="object")continue;const o=String(n.role||n.author||"").toLowerCase();if(o==="user"||o==="human")return n}return null}function C(e){return e?typeof e.content=="string"?e.content:Array.isArray(e.content)?e.content.map(t=>typeof t=="string"?t:t&&typeof t.text=="string"?t.text:"").join(`
`):typeof e.prompt=="string"?e.prompt:"":""}function D(e,t){if(e){if(typeof e.content=="string"||e.content==null){e.content=t;return}if(Array.isArray(e.content)){e.content=[{type:"text",text:t}];return}if(typeof e.prompt=="string"){e.prompt=t;return}e.content=t}}function oe(e,t=null){if(!Array.isArray(e))return!1;for(const n of e){if(n===t)continue;if(C(n).includes("<BetterDeepSeek>"))return!0}return!1}function I(e,t,n,o=!1,r=null,i=null){var y;const c=[],a=ie(e,t,n);a&&c.push(a);const p=n.config.systemPromptEntries||[];if(p.length>0){const s=n.sessionUserMsgCounts[t]||1;for(const l of p)l.content.trim()&&ye(l,s,t,n)&&(c.push(`<BetterDeepSeek>
${l.content.trim()}
</BetterDeepSeek>`),n.markEntryInjected&&n.markEntryInjected(t,l.id))}else o&&n.config.systemPrompt.trim()&&!n.config.disableSystemPrompt&&(c.push(`<BetterDeepSeek>
${n.config.systemPrompt.trim()}
</BetterDeepSeek>`),n.markInjected&&n.markInjected(t));const u=_(n.config.skills);let d=null;if(!o&&r&&(d=be(r,i)),o||u&&u!==d){const s=ae(n);s&&c.push(s)}const h=pe(e,n,r);h&&c.push(h);const w=K(e);w&&c.push(w);const E=n.config.activeCharacter;if(E){let s=r?we(r,i):null;if(!s&&n.getLastChar&&(s=n.getLastChar(t)),!s&&n.currentSessionChar&&(r==null?void 0:r.length)>1&&(s=n.currentSessionChar),o||!s||s!==E.name){const l=me(n);l&&(c.push(l),n.setLastChar&&n.setLastChar(t,E.name),n.currentSessionChar=E.name)}}n.isNextVoiceMessage&&(c.push("<BetterDeepSeek>User send this message using voice recorder tool.</BetterDeepSeek>"),n.isNextVoiceMessage=!1);const S=n.config&&n.config.activeProject;if(S){let s=null;if(!o&&r&&(s=Ee(r,i)),o||!s||s!==S.name){const l=he(n);l&&c.push(l)}if(n.config.projectRagEnabled&&Array.isArray(S.files)&&S.files.length>0){const l=Number(n.config.projectRagLimit)||5,f=ee(e,S.files,l);if(f&&f.length>0){const m=te(f,S.name);m&&c.push(m)}}}if(o){const s=ge(n);s&&c.push(s)}const x=ce((y=n.config)==null?void 0:y.mcpToolSchemas);let g=null;if(!o&&r&&(g=Te(r,i)),o||x&&x!==g){const s=Se(n,x);s&&c.push(s)}return c.join(`

`)}function ie(e,t,n){var r;const o=(r=n.config)==null?void 0:r.deepResearch;return!(o!=null&&o.enabled)||!o.runId?"":(o.enabled=!1,se(o.runId,t,e),["<BetterDeepSeek>",'[BDS:DEEP_RESEARCH] The DeepResearch toggle is enabled. Treat this exactly as the user asking: "Perform Deep Research on the following request."',`Run ID: ${o.runId}`,"","CRITICAL: In this first turn, you must ONLY produce a research plan. Do NOT browse or search. Do NOT produce an ordinary answer. Do NOT produce a direct report.",`Output ONLY a plan using: <BDS:DEEP_RESEARCH_PLAN runId="${o.runId}">JSON</BDS:DEEP_RESEARCH_PLAN>`,"After this turn, BDS will execute steps one-by-one. After each step result is provided, analyze it before continuing. Do NOT skip ahead to the final report until BDS tells you all steps are complete.","","The JSON plan must include:",'- "title": A short descriptive title for the research','- "steps": An array of research steps, each with:','  - "id": step number','  - "action": "search" or "fetch"','  - "query": a specific search query or URL to fetch','  - "purpose": why this step is needed','  - "sourceType": for search steps, one of "general", "docs", "news", "reviews", "academic", or "commerce"',"","Search steps must use narrow queries with named entities, constraints, dates or locations, product or version names, and clear source intent.","",`User research question: ${e}`,"</BetterDeepSeek>"].join(`
`))}function se(e,t,n){typeof window>"u"||!window.dispatchEvent||window.dispatchEvent(new CustomEvent("bds:deep-research-started",{detail:JSON.stringify({runId:e,conversationId:t,userPrompt:n,timestamp:Date.now()})}))}function ae(e){if(!e.config.skills.length)return"";const t=e.config.skills.map(n=>`## ${n.name}
${n.content.trim()}`).join(`

`);return`<BetterDeepSeek> <BDS:SKILLS fingerprint="${_(e.config.skills)}">
${t}
</BDS:SKILLS> </BetterDeepSeek>`}function _(e){return!Array.isArray(e)||!e.length?"":e.map(t=>`${t.name}:${(t.content||"").length}`).sort().join("|")}function ce(e){return!Array.isArray(e)||!e.length?"":e.map(t=>`${t.serverName}:${t.toolName}:${JSON.stringify(t.inputSchema||{})}`).sort().join("|")}function le(e){if(!Array.isArray(e))return null;for(let t=e.length-1;t>=0;t--){const n=e[t];if(!n||typeof n!="object")continue;const o=String(n.role||n.author||"").toLowerCase();if(!(o==="user"||o==="human")&&(o==="assistant"||o==="ai"||o==="bot"))return n}return null}function B(e){return!e||typeof e!="string"?[]:e.split(new RegExp("[_-]|\\s+|(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])")).map(t=>t.toLowerCase().replace(/[^a-z0-9]/g,"")).filter(t=>t.length>0)}function ue(e,t){if(!e.length||!t.length)return 0;const n=new Set(t);let o=0;for(const r of e)n.has(r)&&o++;return o/e.length}function de(e,t){return t===1?e>=1:e>=.5}function pe(e,t,n){if(t.config.disableMemory||!t.config.memories.length)return"";const o=n?le(n):null,r=o?C(o):"",i=[e,r].filter(Boolean).join(" "),c=B(i),a=[];for(const u of t.config.memories){if(u.importance==="always"){a.push(u);continue}if(!u.key)continue;const d=B(u.key);if(!d.length){i.toLowerCase().includes(u.key.toLowerCase())&&a.push(u);continue}const h=[...new Set(d)],w=ue(h,c);(de(w,h.length)||i.toLowerCase().includes(u.key.toLowerCase()))&&a.push(u)}return a.length?`<BetterDeepSeek>
${a.map(u=>`<BDS:memory_calls importance="${u.importance}">${u.key}: ${fe(u.value)}</BDS:memory_calls>`).join(`
`)}
</BetterDeepSeek>`:""}function fe(e){return String(e).replace(/<\//g,"<\\/").trim()}function he(e){const t=e.config&&e.config.activeProject;if(!t)return"";let n="";return t.instructions&&t.instructions.trim()&&(n+=t.instructions.trim()+`
`),`<BetterDeepSeek>
<BDS:PROJECT name="${t.name}">
${n}</BDS:PROJECT>
</BetterDeepSeek>`}function me(e){const t=e.config.activeCharacter;if(!t||!t.content)return"";let n=`Character Name: ${t.name}
`;return t.usage&&(n+=`Usage Domain: ${t.usage}
`),n+=`---
${t.content.trim()}`,`<BetterDeepSeek> <BDS:RP>
${n}
</BDS:RP> </BetterDeepSeek>`}function ge(e){const t=[];if(e.config.injectSystemDateTime!==!1){const o=new Date;t.push(`User's System Date & Time: ${o.toLocaleString()}`)}const n=e.config.preferredLang;return n&&n.trim()&&t.push(`Always respond in ${n.trim()}.`),t.length===0?"":`<BetterDeepSeek>
${t.join(`
`)}
</BetterDeepSeek>`}function Se(e,t){var y;const n=(y=e.config)==null?void 0:y.mcpToolSchemas;if(!Array.isArray(n)||!n.length)return"";const o=Number(e.config.mcpInlineMaxChars)||8e3,r=n.length,i=[`<BetterDeepSeek> <BDS:MCP fingerprint="${t}">`,"You have access to the following MCP (Model Context Protocol) tools via remote servers.",`To invoke them, use: <BDS:AUTO:MCP url="SERVER_NAME_OR_URL" tool="TOOL_NAME" args='{"key":"value"}'>`,"The extension will call the tool and inject the result.","Important: Only ONE tool per response. Wait for the result before invoking another. Never invoke multiple tools at the same time.","","Available tools:"].join(`
`),c="</BDS:MCP> </BetterDeepSeek>",a=n.map(s=>{let l=`- Server: ${s.serverName} (${s.serverUrl||s.serverName}) | Tool: ${s.toolName}`;if(s.description&&(l+=` | Description: ${s.description}`),s.inputSchema&&typeof s.inputSchema=="object"){const f=s.inputSchema.properties;if(f){const m=Object.entries(f).map(([b,T])=>{const k=(s.inputSchema.required||[]).includes(b)?" (required)":"";return`${b}: ${(T==null?void 0:T.type)||"any"}${k}`});m.length&&(l+=` | Params: ${m.join(", ")}`)}}return l}),p=[i,...a,c].join(`
`);if(p.length<=o)return p;const u=s=>`
... and ${s} more tool(s) not shown (MCP tool list exceeds inline character limit \u2014 all tools are still available for invocation).`,d=u(1),h=i.length+1+c.length+d.length;let w=o-h;const E=[];for(const s of a){const l=s.length+1;if(w-l<0)break;w-=l,E.push(s)}const S=r-E.length,x=u(S);let g=[i,...E,x,c].join(`
`);for(;E.length>0&&g.length>o;){E.pop();const s=r-E.length,l=u(s);g=[i,...E,l,c].join(`
`)}return g}function ye(e,t,n,o){const i=(o.getInjectedEntries?o.getInjectedEntries(n):[]).includes(e.id);switch(e.schedule.type){case"first":return!i;case"always":return!0;case"interval":{const c=e.schedule.everyNTurns||3;return i?(t-1)%c===0:!0}default:return!1}}function we(e,t=null){if(!Array.isArray(e))return null;for(let n=e.length-1;n>=0;n--){const o=e[n];if(o===t)continue;const r=C(o);if(!r.includes("<BDS:RP>"))continue;const i=r.match(/Character Name:\s*(.*?)\n/);if(i&&i[1])return i[1].trim()}return null}function be(e,t=null){if(!Array.isArray(e))return null;for(let n=e.length-1;n>=0;n--){const o=e[n];if(o===t)continue;const i=C(o).match(/<BDS:SKILLS fingerprint="(.*?)">/);if(i&&i[1])return i[1]}return null}function Te(e,t=null){if(!Array.isArray(e))return null;for(let n=e.length-1;n>=0;n--){const o=e[n];if(o===t)continue;const i=C(o).match(/<BDS:MCP fingerprint="(.*?)">/);if(i&&i[1])return i[1]}return null}function Ee(e,t=null){if(!Array.isArray(e))return null;for(let n=e.length-1;n>=0;n--){const o=e[n];if(o===t)continue;const i=C(o).match(/<BDS:PROJECT name="(.*?)">/);if(i&&i[1])return i[1]}return null}function j(e){let t=String(e||"");return t=t.replace(/<BetterDeepSeek>([\s\S]*?)<\/BetterDeepSeek>/gi,(n,o)=>o.includes("[BDS:AUTO]")||o.includes("[BDS:DEEP_RESEARCH]")||/<BDS:memory_calls[\s>]/i.test(o)?n:""),t=t.replace(/<BDS:SKILLS>[\s\S]*?<\/BDS:SKILLS>/gi,""),t=t.replace(/<BDS:memory_calls[^>]*>[\s\S]*?<\/BDS:memory_calls>/gi,""),t=t.replace(/<BDS:RP>[\s\S]*?<\/BDS:RP>/gi,""),t=t.replace(/<BDS:PROJECT[^>]*>[\s\S]*?<\/BDS:PROJECT>/gi,""),t=t.replace(/<BDS:PROJECT_CONTEXT>[\s\S]*?<\/BDS:PROJECT_CONTEXT>/gi,""),t.trim()}function xe(){try{const e=document.querySelector("._46a12ab");if(!e)return null;const t=(e.textContent||"").toLowerCase().trim();return t.includes("vision")?"vision":t.includes("expert")||t.includes("reasoner")?"expert":t.includes("deepthink")||t.includes("deep think")||t.includes("r1")?"deepthink":t.includes("instant")||t.includes("chat")||t.includes("flash")?"instant":null}catch{return null}}function ke(e,t,n,o){const r=window.fetch;window.fetch=async function(c,a){try{const p=Ce(c);if(!t(p))return r.apply(this,arguments);if(Ne(c,a,e),p.includes("/api/v0/chat_session/fetch_page")){const u=await r.apply(this,arguments);return u.clone().json().then(h=>{window.dispatchEvent(new CustomEvent("bds:session-data",{detail:JSON.stringify(h)}))}).catch(()=>{}),u}if(p.includes("/api/v0/chat/history_messages")){const u=await r.apply(this,arguments);return u.clone().json().then(h=>{window.dispatchEvent(new CustomEvent("bds:history-msgs",{detail:JSON.stringify(h)}))}).catch(()=>{}),u}n(p);try{const u=await Ae(c,a,e);if(!u){const h=await r.apply(this,arguments);return M(h,p,u==null?void 0:u.modelName),h}const d=await r.call(this,u.input,u.init);return d&&d.status>=500&&window.dispatchEvent(new CustomEvent("bds:network-error",{detail:JSON.stringify({url:p,status:d.status,type:"fetch"})})),M(d,p,u.modelName),d}catch(u){throw window.dispatchEvent(new CustomEvent("bds:network-error",{detail:JSON.stringify({url:p,status:0,type:"fetch",error:String(u)})})),u}finally{o(p)}}catch(p){return console.warn("[BetterDeepSeek] Request patch failed:",p),r.apply(this,arguments)}}}function M(e,t,n){if(!(!e||!e.clone))try{const o=e.clone();Le(o,n).catch(()=>{})}catch{}}function Ce(e){return typeof e=="string"?e:e instanceof URL?e.toString():e instanceof Request?e.url:""}async function Ae(e,t,n){const o=await Re(e,t);if(!o)return null;let r;try{r=JSON.parse(o)}catch{return null}const i=r.model||null,c=P(r,n);if(!c.changed)return null;const a=JSON.stringify(c.payload),p=t&&t.headers?t.headers:e instanceof Request?e.headers:void 0,u=new Headers(p||{});u.set("content-type","application/json");const d={method:t&&t.method||(e instanceof Request?e.method:"POST"),headers:u,body:a,credentials:t&&t.credentials||(e instanceof Request?e.credentials:void 0),cache:t&&t.cache||(e instanceof Request?e.cache:void 0),mode:t&&t.mode||(e instanceof Request?e.mode:void 0),redirect:t&&t.redirect||(e instanceof Request?e.redirect:void 0),referrer:t&&t.referrer||(e instanceof Request?e.referrer:void 0),referrerPolicy:t&&t.referrerPolicy||(e instanceof Request?e.referrerPolicy:void 0),keepalive:t&&t.keepalive||(e instanceof Request?e.keepalive:void 0),integrity:t&&t.integrity||(e instanceof Request?e.integrity:void 0),signal:t&&t.signal||(e instanceof Request?e.signal:void 0)};return{input:typeof e=="string"||e instanceof URL?e:e.url,init:d,modelName:i}}async function Le(e,t){try{const n=e.headers.get("content-type")||"";if(n.includes("text/event-stream")||n.includes("stream"))await De(e,t);else{const o=await e.text();try{const r=JSON.parse(o),i=(r==null?void 0:r.usage)||(r==null?void 0:r.token_usage);i&&X(i.prompt_tokens||i.input_tokens||0,i.completion_tokens||i.output_tokens||0,t)}catch{}}}catch{}}async function De(e,t){var c;const n=(c=e.body)==null?void 0:c.getReader();if(!n)return;const o=new TextDecoder;let r="";try{for(;;){const{done:a,value:p}=await n.read();if(p&&(r+=o.decode(p,{stream:!a})),a)break}}catch{return}const i=r.split(`
`);for(let a=i.length-1;a>=0;a--){const p=i[a].trim();if(!p.startsWith("data: "))continue;const u=p.slice(6).trim();if(u!=="[DONE]")try{const d=JSON.parse(u),h=(d==null?void 0:d.usage)||(d==null?void 0:d.token_usage);if(h){X(h.prompt_tokens||h.input_tokens||0,h.completion_tokens||h.output_tokens||0,t||(d==null?void 0:d.model));break}}catch{}}}function X(e,t,n){typeof e!="number"&&typeof t!="number"||window.dispatchEvent(new CustomEvent("bds:token-usage",{detail:JSON.stringify({inputTokens:Number(e)||0,outputTokens:Number(t)||0,modelName:n||null,timestamp:Date.now()})}))}async function Re(e,t){return t&&typeof t.body=="string"?t.body:t&&t.body instanceof URLSearchParams?t.body.toString():e instanceof Request?e.clone().text():""}function Ne(e,t,n){try{let o;if(t&&t.headers){const r=t.headers;if(r instanceof Headers)o=r.get("authorization");else if(Array.isArray(r)){for(const[i,c]of r)if(i.toLowerCase()==="authorization"){o=c;break}}else typeof r=="object"&&(o=r.Authorization||r.authorization)}!o&&e instanceof Request&&(o=e.headers.get("authorization")),o&&typeof(n==null?void 0:n.setAuthToken)=="function"&&n.setAuthToken(o)}catch{}}function Oe(e,t,n,o){const r=XMLHttpRequest.prototype.open,i=XMLHttpRequest.prototype.send,c=XMLHttpRequest.prototype.setRequestHeader;XMLHttpRequest.prototype.open=function(p,u){return this.__bdsRequestMeta={method:String(p||"GET").toUpperCase(),url:String(u||"")},r.apply(this,arguments)},XMLHttpRequest.prototype.setRequestHeader=function(p,u){return p&&String(p).toLowerCase()==="authorization"&&typeof(e==null?void 0:e.setAuthToken)=="function"&&e.setAuthToken(String(u||"")),c.apply(this,arguments)},XMLHttpRequest.prototype.send=function(p){try{const u=this.__bdsRequestMeta||{};if(!t(u.url))return i.call(this,p);if(u.url.includes("/api/v0/chat_session/fetch_page"))return this.addEventListener("load",()=>{try{const s=JSON.parse(this.responseText);window.dispatchEvent(new CustomEvent("bds:session-data",{detail:JSON.stringify(s)}))}catch{}}),i.call(this,p);if(u.url.includes("/api/v0/chat/history_messages"))return this.addEventListener("load",()=>{try{const s=JSON.parse(this.responseText);window.dispatchEvent(new CustomEvent("bds:history-msgs",{detail:JSON.stringify(s)}))}catch{}}),i.call(this,p);n(u.url);let d=!1;const h=()=>{d||(d=!0,(this.status>=500||this.status===0)&&window.dispatchEvent(new CustomEvent("bds:network-error",{detail:JSON.stringify({url:u.url,status:this.status,type:"xhr"})})),o(u.url))};this.addEventListener("loadend",h,{once:!0});const w=Pe(p);if(!w)return i.call(this,p);const E=JSON.parse(w),S=E.model||null,x=P(E,e);if(!x.changed)return i.call(this,p);const g=JSON.stringify(x.payload),y=this;return this.addEventListener("load",()=>{try{const s=y.responseText;s&&ve(s,y,S)}catch{}},{once:!0}),i.call(this,g)}catch(u){const d=this.__bdsRequestMeta||{};console.warn("[BetterDeepSeek] XHR patch failed:",u);try{return i.call(this,p)}catch(h){throw t(d.url)&&o(d.url),h}}}}function Pe(e){return typeof e=="string"?e:e instanceof URLSearchParams?e.toString():""}function ve(e,t,n){var o;try{if((((o=t.getResponseHeader)==null?void 0:o.call(t,"content-type"))||"").includes("text/event-stream")||e.startsWith("data: ")){const i=e.split(`
`);for(let c=i.length-1;c>=0;c--){const a=i[c].trim();if(!a.startsWith("data: "))continue;const p=a.slice(6).trim();if(p!=="[DONE]")try{const u=JSON.parse(p),d=u==null?void 0:u.usage;if(d){window.dispatchEvent(new CustomEvent("bds:token-usage",{detail:JSON.stringify({inputTokens:d.prompt_tokens||d.input_tokens||0,outputTokens:d.completion_tokens||d.output_tokens||0,modelName:n||(u==null?void 0:u.model)||null,timestamp:Date.now()})}));break}}catch{}}}}catch{}}const L="Nexo AI",F=/(?:better\s*)?deep\s*seek(?:\.com|\s*ai)?/gi,U=[{pattern:/\u676d\u5dde\u6df1\u5ea6\u6c42\u7d22\u4eba\u5de5\u667a\u80fd\u57fa\u7840\u6280\u672f\u7814\u7a76\u6709\u9650\u516c\u53f8/g,replacement:"Nexo AI Studio by Tehzeeb (@xtehzeeb.x)"},{pattern:/\u6df1\u5ea6\u6c42\u7d22/g,replacement:"Nexo AI"},{pattern:/\u6d59ICP\u5907[0-9A-Za-z\-\u53f7]+/g,replacement:"Nexo AI Core Engine v2.0"},{pattern:/\u6d59\u516c\u7f51\u5b89\u5907[0-9A-Za-z\-\u53f7]+/g,replacement:"Secure End-to-End Encryption"},{pattern:/\u670d\u52a1\u534f\u8bae/g,replacement:"Terms of Service"},{pattern:/\u9690\u79c1\u653f\u7b56/g,replacement:"Privacy Policy"},{pattern:/\u4f7f\u7528\u6761\u6b3e/g,replacement:"Terms of Use"},{pattern:/\u7528\u6237\u534f\u8bae/g,replacement:"User Agreement"},{pattern:/\u767b\u5f55\u5373\u4ee3\u8868[^\n,\uff0c\u3002]*/g,replacement:"By signing in, you agree to Nexo AI Terms & Privacy Policy"},{pattern:/\u9a8c\u8bc1\u7801/g,replacement:"Verification Code"},{pattern:/\u5bc6\u7801\u767b\u5f55/g,replacement:"Password Login"},{pattern:/\u624b\u673a\u53f7\u767b\u5f55/g,replacement:"Phone Login"},{pattern:/\u90ae\u7bb1\u767b\u5f55/g,replacement:"Email Login"},{pattern:/\u90ae\u7bb1\u9a8c\u8bc1\u7801/g,replacement:"Email Verification Code"},{pattern:/\u83b7\u53d6\u9a8c\u8bc1\u7801/g,replacement:"Get Code"},{pattern:/\u91cd\u65b0\u53d1\u9001/g,replacement:"Resend Code"},{pattern:/\u7acb\u5373\u6ce8\u518c/g,replacement:"Sign Up"},{pattern:/\u627e\u56de\u5bc6\u7801/g,replacement:"Forgot Password"}];function Ie(){if(typeof document>"u")return;function e(r){if(!r||typeof r!="string")return r;let i=r;F.test(i)&&(i=i.replace(F,L));for(let c=0;c<U.length;c++){const{pattern:a,replacement:p}=U[c];a.test(i)&&(i=i.replace(a,p))}return/[\u4e00-\u9fff\u3400-\u4dbf]/.test(i)&&/ICP|\u5907|\u516c\u7f51\u5b89\u5907|\u7248\u6743\u6240\u6709|\u676d\u5dde/i.test(i)&&(i="\xA9 2026 Nexo AI Studio. Designed & Masterminded by Tehzeeb (@xtehzeeb.x | xtehzeeb.x7@gmail.com)"),i}try{let r=e(document.title)||L;document.title&&(/deep\s*seek/i.test(document.title)||/[\u4e00-\u9fff]/.test(document.title))&&(document.title=r);const i=Object.getOwnPropertyDescriptor(Document.prototype,"title")||Object.getOwnPropertyDescriptor(HTMLDocument.prototype,"title");i&&i.configurable&&Object.defineProperty(document,"title",{get(){return e(i.get.call(document))||L},set(c){i.set.call(document,e(c)||L)},configurable:!0})}catch{}try{const r=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"placeholder");r&&r.set&&Object.defineProperty(HTMLInputElement.prototype,"placeholder",{get(){return r.get.call(this)},set(c){r.set.call(this,e(c))},configurable:!0});const i=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"placeholder");i&&i.set&&Object.defineProperty(HTMLTextAreaElement.prototype,"placeholder",{get(){return i.get.call(this)},set(c){i.set.call(this,e(c))},configurable:!0})}catch{}function t(r){if(r){if(r.nodeType===Node.TEXT_NODE){const i=r.parentElement;if(i){const c=(i.tagName||"").toUpperCase();if(c==="SCRIPT"||c==="STYLE"||c==="TEXTAREA"||c==="CODE"||c==="PRE")return}r.nodeValue&&(/deep\s*seek/i.test(r.nodeValue)||/[\u4e00-\u9fff]/.test(r.nodeValue))&&(r.nodeValue=e(r.nodeValue));return}if(r.nodeType===Node.ELEMENT_NODE){const i=(r.tagName||"").toUpperCase();if(i==="SCRIPT"||i==="STYLE"||i==="TEXTAREA"||i==="CODE"||i==="PRE")return;if(r.placeholder&&(/deep\s*seek/i.test(r.placeholder)||/[\u4e00-\u9fff]/.test(r.placeholder))&&(r.placeholder=e(r.placeholder)),r.title&&(/deep\s*seek/i.test(r.title)||/[\u4e00-\u9fff]/.test(r.title))&&(r.title=e(r.title)),r.value&&typeof r.value=="string"&&(/deep\s*seek/i.test(r.value)||/[\u4e00-\u9fff]/.test(r.value))&&(r.tagName==="BUTTON"||r.type==="button"||r.type==="submit")&&(r.value=e(r.value)),r.getAttribute){const a=["aria-label","placeholder","aria-placeholder","data-placeholder","alt","title","data-tip"];for(let p=0;p<a.length;p++){const u=a[p],d=r.getAttribute(u);d&&(/deep\s*seek/i.test(d)||/[\u4e00-\u9fff]/.test(d))&&r.setAttribute(u,e(d))}}let c=r.firstChild;for(;c;)t(c),c=c.nextSibling;r.shadowRoot&&t(r.shadowRoot)}}}function n(){document.title&&(/deep\s*seek/i.test(document.title)||/[\u4e00-\u9fff]/.test(document.title))&&(document.title=e(document.title)),document.documentElement&&t(document.documentElement)}n();const o=new MutationObserver(r=>{for(let i=0;i<r.length;i++){const c=r[i];if(c.type==="childList")for(let a=0;a<c.addedNodes.length;a++)t(c.addedNodes[a]);else c.type==="characterData"?c.target&&c.target.nodeValue&&(/deep\s*seek/i.test(c.target.nodeValue)||/[\u4e00-\u9fff]/.test(c.target.nodeValue))&&(c.target.nodeValue=e(c.target.nodeValue)):c.type==="attributes"&&t(c.target)}document.title&&(/deep\s*seek/i.test(document.title)||/[\u4e00-\u9fff]/.test(document.title))&&(document.title=e(document.title))});document.documentElement&&o.observe(document.documentElement,{childList:!0,subtree:!0,characterData:!0,attributes:!0,attributeFilter:["placeholder","title","aria-label","alt","aria-placeholder","data-placeholder"]}),typeof window<"u"&&setInterval(()=>{document.hidden||n()},2e3),document.readyState==="loading"&&document.addEventListener("DOMContentLoaded",n,{once:!0})}(function(){"use strict";Ie();const e={configUpdate:"bds:config-update",deepResearchConfigUpdate:"bds:deep-research-config-update",requestConfig:"bds:request-config",markVoiceMessage:"bds:mark-voice-message",sessionData:"bds:session-data"},t="/api/v0/chat_session/fetch_page",n="/api/v0/chat/history_messages",o="/api/v0/chat/completion";function r(){try{return JSON.parse(localStorage.getItem("bds_injected_chats")||"[]")}catch{return[]}}function i(s){const l=r();l.includes(s)||(l.push(s),l.length>50&&l.shift(),localStorage.setItem("bds_injected_chats",JSON.stringify(l)))}function c(){try{return JSON.parse(localStorage.getItem("bds_injected_chars")||"{}")}catch{return{}}}function a(s,l){const f=c();f[s]=l;const m=Object.keys(f);m.length>50&&delete f[m[0]],localStorage.setItem("bds_injected_chars",JSON.stringify(f))}function p(s){try{return JSON.parse(localStorage.getItem("bds_injected_entries")||"{}")[s]||[]}catch{return[]}}function u(s,l){try{const f=JSON.parse(localStorage.getItem("bds_injected_entries")||"{}");f[s]||(f[s]=[]),f[s].includes(l)||f[s].push(l);const m=Object.keys(f);m.length>50&&delete f[m[0]],localStorage.setItem("bds_injected_entries",JSON.stringify(f))}catch{}}function d(){var s,l;try{for(let m=0;m<localStorage.length;m++){const b=localStorage.key(m);if(b&&/token|auth|session/i.test(b)){const T=localStorage.getItem(b);if(!T)continue;if(T.trim().startsWith("{"))try{const k=JSON.parse(T),A=k.token||k.accessToken||k.access_token||k.user_token||((s=k.user)==null?void 0:s.token);if(A&&typeof A=="string")return A}catch{}else if(typeof T=="string"&&T.length>20){let k=T;return k.startsWith("Bearer ")&&(k=k.substring(7)),k.startsWith('"')&&k.endsWith('"')&&(k=k.slice(1,-1)),k}}}const f=(l=document.cookie.split("; ").find(m=>m.startsWith("user_token=")||m.startsWith("token=")))==null?void 0:l.split("=")[1];if(f)return decodeURIComponent(f)}catch(f){console.warn("[BDS] Failed to search auth token in storage:",f)}return null}const h={config:{systemPrompt:"",systemPromptEntries:[],skills:[],memories:[],activeCharacter:null,mcpToolSchemas:[]},hasInjected:s=>r().includes(s),markInjected:s=>i(s),getInjectedEntries:s=>p(s),markEntryInjected:(s,l)=>u(s,l),getLastChar:s=>c()[s]||null,setLastChar:(s,l)=>a(s,l),currentSessionChar:null,activeCompletionRequests:0,isNextVoiceMessage:!1,authToken:d(),setAuthToken:function(s){s&&s!==this.authToken&&(this.authToken=s)}};if(window.__bdsNetworkPatched)return;window.__bdsNetworkPatched=!0,(function(){if(window.__BDS_CONFIG__)return;let s=0;const l=new Map;window.addEventListener("bds:debug-api-response",m=>{let b=m.detail;if(typeof b=="string")try{b=JSON.parse(b)}catch{return}const T=l.get(b.id);T&&(T(b.result),l.delete(b.id))});function f(m){return function(){const b=Array.from(arguments);return new Promise(T=>{const k=++s;l.set(k,T),window.dispatchEvent(new CustomEvent("bds:debug-api-request",{detail:JSON.stringify({id:k,method:m,args:b})}))})}}window.__BDS_CONFIG__={raw:f("getRaw"),getFlag:f("getFlag"),getConfig:f("getConfig"),applyRemote:f("applyRemote"),replaceRemote:f("replaceRemote"),resetToBuiltin:f("resetToBuiltin"),detectModel:f("detectModel"),toggleDebugPanel:f("toggleDebugPanel")}})(),window.addEventListener(e.configUpdate,s=>{let l=s&&s.detail?s.detail:{};if(typeof l=="string")try{l=JSON.parse(l)}catch(f){console.error("[BDS] Failed to parse configUpdate detail:",f)}h.config=q(l||{})}),window.addEventListener(e.deepResearchConfigUpdate,s=>{let l=s&&s.detail?s.detail:{};if(typeof l=="string")try{l=JSON.parse(l)}catch(f){console.error("[BDS] Failed to parse deepResearchConfigUpdate detail:",f)}h.config.deepResearch=R(l||{})}),window.addEventListener(e.markVoiceMessage,()=>{h.isNextVoiceMessage=!0}),window.addEventListener("bds:request-history-msgs",async s=>{let l=s&&s.detail?s.detail:{};if(typeof l=="string")try{l=JSON.parse(l)}catch{return}const f=l==null?void 0:l.sessionId;if(!f)return;const m=`${n}?chat_session_id=${encodeURIComponent(f)}`,b={"Content-Type":"application/json"};h.authToken&&(b.Authorization=`Bearer ${h.authToken}`);try{const T=await w(m,{method:"GET",headers:b,credentials:"include"});if(!T.ok){console.warn("[BDS] history_mgs fetch failed:",T.status);return}const k=await T.json();k.__bdsExplicit=!0,window.dispatchEvent(new CustomEvent("bds:history-msgs",{detail:JSON.stringify(k)}))}catch(T){console.warn("[BDS] history_msgs fetch error:",T)}}),E();const w=window.fetch.bind(window);ke(h,S,g,y),Oe(h,S,g,y);function E(){window.dispatchEvent(new CustomEvent(e.requestConfig))}function S(s){const l=String(s||"");return l.includes("/api/v0/chat/completion")||l.includes("/api/v0/chat/edit_message")||l.includes(t)||l.includes(n)}function x(s,l){const f={status:s,url:String(l||""),activeCompletionRequests:h.activeCompletionRequests,timestamp:Date.now()};window.dispatchEvent(new CustomEvent(e.networkState,{detail:JSON.stringify(f)}))}function g(s){h.activeCompletionRequests+=1,x("start",s)}function y(s){h.activeCompletionRequests=Math.max(0,h.activeCompletionRequests-1),x("end",s)}})()})();

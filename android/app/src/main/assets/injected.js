(function(){"use strict";function F(e){const t=Array.isArray(e.skills)?e.skills.map(a=>({name:String(a&&a.name?a.name:"skill"),content:String(a&&a.content?a.content:"")})).filter(a=>a.content.trim().length>0):[],n=Array.isArray(e.memories)?e.memories.map(a=>({key:$(a&&a.key),value:String(a&&a.value?a.value:""),importance:H(a&&a.importance)})).filter(a=>a.key&&a.value.trim().length>0):[],o=q(e.activeProject),s=(Array.isArray(e.systemPromptEntries)?e.systemPromptEntries:[]).map(a=>({id:String(a&&a.id?a.id:""),content:String(a&&a.content?a.content:""),enabled:a&&typeof a.enabled=="boolean"?a.enabled:!0,schedule:U(a&&a.schedule)})).filter(a=>a.id&&a.content.trim().length>0&&a.enabled),l=Array.isArray(e.mcpToolSchemas)?e.mcpToolSchemas.map(a=>({serverName:String(a.serverName||""),serverUrl:String(a.serverUrl||""),toolName:String(a.toolName||""),description:String(a.description||""),inputSchema:a.inputSchema||{}})).filter(a=>a.serverName&&a.toolName):[];return{systemPrompt:String(e.systemPrompt||""),systemPromptEntries:s,skills:t,memories:n,activeCharacter:e.activeCharacter||null,preferredLang:String(e.preferredLang||""),disableSystemPrompt:!!e.disableSystemPrompt,disableMemory:!!e.disableMemory,systemPromptInjectionFrequency:String(e.systemPromptInjectionFrequency||"first"),systemPromptInjectionInterval:Number(e.systemPromptInjectionInterval)||3,activeProject:o,projectRagEnabled:!!e.projectRagEnabled,projectRagLimit:Number(e.projectRagLimit)||5,injectSystemDateTime:!!e.injectSystemDateTime,deepResearch:R(e.deepResearch),mcpToolSchemas:l,mcpInlineMaxChars:Number(e.mcpInlineMaxChars)||8e3,modelInputLimits:e.modelInputLimits||{}}}function R(e){return!e||typeof e!="object"?{enabled:!1,runId:""}:{enabled:!!e.enabled,runId:String(e.runId||"").trim()}}function q(e){if(!e||typeof e!="object")return null;const t=String(e.name||"").trim(),n=String(e.instructions||""),o=Array.isArray(e.files)?e.files.map(r=>({name:String(r&&r.name?r.name:"file"),content:String(r&&r.content?r.content:"")})).filter(r=>r.content.length>0):[];return t?{name:t,instructions:n,files:o}:null}function U(e){if(!e||typeof e!="object")return{type:"first",everyNTurns:1};const t=String(e.type||"first");return{type:["first","always","interval"].includes(t)?t:"first",everyNTurns:Math.max(1,Math.floor(Number(e.everyNTurns)||3))}}function $(e){return String(e||"").trim().toLowerCase().replace(/[^a-z0-9_]/g,"")}function H(e){return String(e||"called").toLowerCase()==="always"?"always":"called"}const J=`
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
`.trim(),G=`
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
`.trim(),z=`
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
`.trim(),N=[{name:"xlsx",keywords:["excel","spreadsheet","xlsx","xls","sheet","tabular data","workbook","cells",".xlsx"],skill:J},{name:"pptx",keywords:["powerpoint","presentation","slide","pptx",".pptx","slideshow","deck","power point"],skill:G},{name:"docx",keywords:["word","document","docx","msword","word document","doc",".docx","letter","report"],skill:z}];function W(e){if(!e||typeof e!="string")return[];const t=e.toLowerCase(),n=[];for(const o of N)for(const r of o.keywords)if(t.includes(r)){n.push(o.name);break}return n}function V(e){const t=W(e);if(!t.length)return"";const n=[];for(const o of t){const r=N.find(s=>s.name===o);r&&n.push(r.skill)}return n.length?["<BetterDeepSeek>","[OFFICE SKILL] The user wants to create an office document. Below is the API reference for the required library:","",n.join(`

`),"</BetterDeepSeek>"].join(`
`):""}const Y=new Set(["the","a","an","and","or","but","if","then","else","when","at","by","for","with","about","against","is","it","was","were","are","be","been","between","into","through","during","before","after","above","below","to","from","up","down","in","out","on","off","over","under","again","further","once","here","there","all","any","both","each","few","more","most","other","some","such","no","nor","not","only","own","same","so","than","too","very","can","will","just","should","now","how","what","where","why","who","which","ve","veya","ama","fakat","lakin","ancak","ise","ki","de","da","mi","mu","m\xFC","m\u0131","bir","bu","\u015Fu","o","i\xE7in","gibi","kadar","ile","taraf\u0131ndan","hakk\u0131nda","kar\u015F\u0131","aras\u0131nda","i\xE7ine","boyunca","\xF6nce","sonra","\xFCzerinde","alt\u0131nda","yine","daha","en","t\xFCm","her","baz\u0131","hi\xE7","sadece","kendi","ayn\u0131","\xF6yle","b\xF6yle","\xE7ok","yap\u0131lan","yaparak","olan"]);function K(e,t=800,n=5){if(!e||!e.content)return[];const o=e.content.split(/\r?\n/);if(o.length===0)return[];const r=[];let s=0;for(;s<o.length;){const l=[];let a=0;const p=s+1;for(;s<o.length&&(a<t||l.length<3);)l.push(o[s]),a+=o[s].length+1,s++;const u=s;if(r.push({fileName:e.name,content:l.join(`
`),startLine:p,endLine:u}),s>=o.length)break;s=Math.max(p,s-n)}return r}function O(e){return e?(String(e).toLowerCase().match(/[a-z0-9_\u015f\u00e7g\u00f6\u0131\u00fc]+/gi)||[]).filter(n=>n.length>=2&&!Y.has(n)):[]}function Q(e,t,n=5){if(!e||!t||!t.length)return[];const o=[];for(const S of t)o.push(...K(S,800,5));if(o.length===0)return[];const r=O(e);if(r.length===0)return[];const s=o.length,l=o.map(S=>O(S.content)),a=l.map(S=>S.length),u=a.reduce((S,k)=>S+k,0)/s||1,d={};for(const S of r){d[S]=0;for(const k of l)k.includes(S)&&d[S]++}const h=1.2,y=.75,E=[];for(let S=0;S<s;S++){const k=o[S],g=l[S],w=a[S];let i=0;const c={};for(const m of g)c[m]=(c[m]||0)+1;for(const m of r){const b=c[m]||0;if(b===0)continue;const T=d[m]||0,L=Math.log(1+(s-T+.5)/(T+.5))*(b*(h+1))/(b+h*(1-y+y*(w/u)));i+=L}const f=String(k.fileName).toLowerCase();for(const m of r)f.includes(m)&&(i+=12);i>0&&E.push({...k,score:i})}return E.sort((S,k)=>k.score-S.score).slice(0,Math.max(1,n))}function Z(e,t="Project"){if(!e||!e.length)return"";let n=`<BDS:PROJECT_CONTEXT>
`;n+=`You are working on the project "${t}". Based on the user's latest prompt, here are the most relevant sections of the project files:

`;for(const o of e){const r=o.fileName.split(".").pop()||"";n+=`--- [FILE: ${o.fileName} (Lines ${o.startLine}-${o.endLine})] ---
`,n+=`\`\`\`${r}
`,n+=o.content+`
`,n+="```\n\n"}return n+="</BDS:PROJECT_CONTEXT>",n}function v(e,t){var E,S,k;t.sessionUserMsgCounts||(t.sessionUserMsgCounts={});const n=ee(e),o=te(e);let r=1;n&&n.length>0?(r=n.filter(g=>{const w=String(g.role||g.author||"").toLowerCase();return w==="user"||w==="human"}).length,t.sessionUserMsgCounts[o]=r):typeof e.prompt=="string"&&(e.message_id===1||e.parent_message_id==null?r=1:r=(t.sessionUserMsgCounts[o]||0)+1,t.sessionUserMsgCounts[o]=r);let s=!1,l=null;if(n&&n.length>0){l=P(n)||n[n.length-1];const g=C(l);if(g){const w=j(g),i=ne(n,l);let c=!1;const f=t.config.systemPromptInjectionFrequency||"first";if(f==="always")c=!0;else if(f==="every_x"){const b=t.config.systemPromptInjectionInterval||3;(r-1)%b===0?c=!0:i||(c=!0)}else c=!i,(n.length>1||t.hasInjected&&t.hasInjected(o))&&(c=!1);const m=I(w,o,t,c,n,l);window.dispatchEvent(new CustomEvent("bds:mutation-applied",{detail:JSON.stringify({conversationId:o,injectedText:m||"",userPrompt:w})})),m?(D(l,`${m}

${w}`),s=!0):w!==g&&(D(l,w),s=!0)}}else if(typeof e.prompt=="string"){const g=j(e.prompt),w=e.message_id===1||e.parent_message_id==null,i=t.config.systemPromptInjectionFrequency||"first";let c=!1;if(i==="always")c=!0;else if(i==="every_x"){const m=t.config.systemPromptInjectionInterval||3;(w||(r-1)%m===0)&&(c=!0)}else c=w;const f=I(g,o,t,c,null,null);window.dispatchEvent(new CustomEvent("bds:mutation-applied",{detail:JSON.stringify({conversationId:o,injectedText:f||"",userPrompt:g})})),f?(e.prompt=`${f}

${g}`,s=!0):g!==e.prompt&&(e.prompt=g,s=!0)}const a=(E=t.config)==null?void 0:E.modelInputLimits,p=e.model||((S=e.data)==null?void 0:S.model)||((k=e.chat)==null?void 0:k.model)||"",u=String(p).toLowerCase();let d="instant",h="payload";if(u)u.includes("vision")?d="vision":u.includes("reasoner")||u.includes("deepthink")||u.includes("r1")?d="deepthink":(u.includes("expert")||u.includes("pro"))&&(d="expert");else{const g=Te();g&&(d=g,h="dom")}const y=a?a[d]??163840:163840;if(n&&n.length>0){const g=P(n);if(g){const w=C(g);if(console.warn(`[BDS] Guard check: model="${u}" payload.model=${e.model} source=${h} type=${d} limit=${y} msgLen=${w.length} limits=${JSON.stringify(a)}`),w.length>y){const i=`

...[truncated by Better DeepSeek]...`,c=w.slice(0,y-i.length)+i;D(g,c),s=!0,console.warn(`[BDS] TRUNCATED user message from ${w.length} to ${y} chars`)}}}else if(typeof e.prompt=="string"&&(console.warn(`[BDS] Guard check (prompt): model="${u}" payload.model=${e.model} source=${h} type=${d} limit=${y} msgLen=${e.prompt.length} limits=${JSON.stringify(a)}`),e.prompt.length>y)){const g=`

...[truncated by Better DeepSeek]...`;e.prompt=e.prompt.slice(0,y-g.length)+g,s=!0,console.warn(`[BDS] TRUNCATED prompt from ${e.prompt.length} to ${y} chars`)}return{changed:s,payload:e}}function ee(e){return Array.isArray(e.messages)?e.messages:e.data&&Array.isArray(e.data.messages)?e.data.messages:e.chat&&Array.isArray(e.chat.messages)?e.chat.messages:null}function te(e){return String(e.conversation_id||e.conversationId||e.chat_session_id||e.chat_id||e.id||"default")}function P(e){for(let t=e.length-1;t>=0;t-=1){const n=e[t];if(!n||typeof n!="object")continue;const o=String(n.role||n.author||"").toLowerCase();if(o==="user"||o==="human")return n}return null}function C(e){return e?typeof e.content=="string"?e.content:Array.isArray(e.content)?e.content.map(t=>typeof t=="string"?t:t&&typeof t.text=="string"?t.text:"").join(`
`):typeof e.prompt=="string"?e.prompt:"":""}function D(e,t){if(e){if(typeof e.content=="string"||e.content==null){e.content=t;return}if(Array.isArray(e.content)){e.content=[{type:"text",text:t}];return}if(typeof e.prompt=="string"){e.prompt=t;return}e.content=t}}function ne(e,t=null){if(!Array.isArray(e))return!1;for(const n of e){if(n===t)continue;if(C(n).includes("<BetterDeepSeek>"))return!0}return!1}function I(e,t,n,o=!1,r=null,s=null){var w;const l=[],a=re(e,t,n);a&&l.push(a);const p=n.config.systemPromptEntries||[];if(p.length>0){const i=n.sessionUserMsgCounts[t]||1;for(const c of p)c.content.trim()&&ge(c,i,t,n)&&(l.push(`<BetterDeepSeek>
${c.content.trim()}
</BetterDeepSeek>`),n.markEntryInjected&&n.markEntryInjected(t,c.id))}else o&&n.config.systemPrompt.trim()&&!n.config.disableSystemPrompt&&(l.push(`<BetterDeepSeek>
${n.config.systemPrompt.trim()}
</BetterDeepSeek>`),n.markInjected&&n.markInjected(t));const u=_(n.config.skills);let d=null;if(!o&&r&&(d=we(r,s)),o||u&&u!==d){const i=ie(n);i&&l.push(i)}const h=ue(e,n,r);h&&l.push(h);const y=V(e);y&&l.push(y);const E=n.config.activeCharacter;if(E){let i=r?Se(r,s):null;if(!i&&n.getLastChar&&(i=n.getLastChar(t)),!i&&n.currentSessionChar&&(r==null?void 0:r.length)>1&&(i=n.currentSessionChar),o||!i||i!==E.name){const c=fe(n);c&&(l.push(c),n.setLastChar&&n.setLastChar(t,E.name),n.currentSessionChar=E.name)}}n.isNextVoiceMessage&&(l.push("<BetterDeepSeek>User send this message using voice recorder tool.</BetterDeepSeek>"),n.isNextVoiceMessage=!1);const S=n.config&&n.config.activeProject;if(S){let i=null;if(!o&&r&&(i=be(r,s)),o||!i||i!==S.name){const c=pe(n);c&&l.push(c)}if(n.config.projectRagEnabled&&Array.isArray(S.files)&&S.files.length>0){const c=Number(n.config.projectRagLimit)||5,f=Q(e,S.files,c);if(f&&f.length>0){const m=Z(f,S.name);m&&l.push(m)}}}if(o){const i=he(n);i&&l.push(i)}const k=se((w=n.config)==null?void 0:w.mcpToolSchemas);let g=null;if(!o&&r&&(g=ye(r,s)),o||k&&k!==g){const i=me(n,k);i&&l.push(i)}return l.join(`

`)}function re(e,t,n){var r;const o=(r=n.config)==null?void 0:r.deepResearch;return!(o!=null&&o.enabled)||!o.runId?"":(o.enabled=!1,oe(o.runId,t,e),["<BetterDeepSeek>",'[BDS:DEEP_RESEARCH] The DeepResearch toggle is enabled. Treat this exactly as the user asking: "Perform Deep Research on the following request."',`Run ID: ${o.runId}`,"","CRITICAL: In this first turn, you must ONLY produce a research plan. Do NOT browse or search. Do NOT produce an ordinary answer. Do NOT produce a direct report.",`Output ONLY a plan using: <BDS:DEEP_RESEARCH_PLAN runId="${o.runId}">JSON</BDS:DEEP_RESEARCH_PLAN>`,"After this turn, BDS will execute steps one-by-one. After each step result is provided, analyze it before continuing. Do NOT skip ahead to the final report until BDS tells you all steps are complete.","","The JSON plan must include:",'- "title": A short descriptive title for the research','- "steps": An array of research steps, each with:','  - "id": step number','  - "action": "search" or "fetch"','  - "query": a specific search query or URL to fetch','  - "purpose": why this step is needed','  - "sourceType": for search steps, one of "general", "docs", "news", "reviews", "academic", or "commerce"',"","Search steps must use narrow queries with named entities, constraints, dates or locations, product or version names, and clear source intent.","",`User research question: ${e}`,"</BetterDeepSeek>"].join(`
`))}function oe(e,t,n){typeof window>"u"||!window.dispatchEvent||window.dispatchEvent(new CustomEvent("bds:deep-research-started",{detail:JSON.stringify({runId:e,conversationId:t,userPrompt:n,timestamp:Date.now()})}))}function ie(e){if(!e.config.skills.length)return"";const t=e.config.skills.map(n=>`## ${n.name}
${n.content.trim()}`).join(`

`);return`<BetterDeepSeek> <BDS:SKILLS fingerprint="${_(e.config.skills)}">
${t}
</BDS:SKILLS> </BetterDeepSeek>`}function _(e){return!Array.isArray(e)||!e.length?"":e.map(t=>`${t.name}:${(t.content||"").length}`).sort().join("|")}function se(e){return!Array.isArray(e)||!e.length?"":e.map(t=>`${t.serverName}:${t.toolName}:${JSON.stringify(t.inputSchema||{})}`).sort().join("|")}function ae(e){if(!Array.isArray(e))return null;for(let t=e.length-1;t>=0;t--){const n=e[t];if(!n||typeof n!="object")continue;const o=String(n.role||n.author||"").toLowerCase();if(!(o==="user"||o==="human")&&(o==="assistant"||o==="ai"||o==="bot"))return n}return null}function B(e){return!e||typeof e!="string"?[]:e.split(new RegExp("[_-]|\\s+|(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])")).map(t=>t.toLowerCase().replace(/[^a-z0-9]/g,"")).filter(t=>t.length>0)}function ce(e,t){if(!e.length||!t.length)return 0;const n=new Set(t);let o=0;for(const r of e)n.has(r)&&o++;return o/e.length}function le(e,t){return t===1?e>=1:e>=.5}function ue(e,t,n){if(t.config.disableMemory||!t.config.memories.length)return"";const o=n?ae(n):null,r=o?C(o):"",s=[e,r].filter(Boolean).join(" "),l=B(s),a=[];for(const u of t.config.memories){if(u.importance==="always"){a.push(u);continue}if(!u.key)continue;const d=B(u.key);if(!d.length){s.toLowerCase().includes(u.key.toLowerCase())&&a.push(u);continue}const h=[...new Set(d)],y=ce(h,l);(le(y,h.length)||s.toLowerCase().includes(u.key.toLowerCase()))&&a.push(u)}return a.length?`<BetterDeepSeek>
${a.map(u=>`<BDS:memory_calls importance="${u.importance}">${u.key}: ${de(u.value)}</BDS:memory_calls>`).join(`
`)}
</BetterDeepSeek>`:""}function de(e){return String(e).replace(/<\//g,"<\\/").trim()}function pe(e){const t=e.config&&e.config.activeProject;if(!t)return"";let n="";return t.instructions&&t.instructions.trim()&&(n+=t.instructions.trim()+`
`),`<BetterDeepSeek>
<BDS:PROJECT name="${t.name}">
${n}</BDS:PROJECT>
</BetterDeepSeek>`}function fe(e){const t=e.config.activeCharacter;if(!t||!t.content)return"";let n=`Character Name: ${t.name}
`;return t.usage&&(n+=`Usage Domain: ${t.usage}
`),n+=`---
${t.content.trim()}`,`<BetterDeepSeek> <BDS:RP>
${n}
</BDS:RP> </BetterDeepSeek>`}function he(e){const t=[];if(e.config.injectSystemDateTime!==!1){const o=new Date;t.push(`User's System Date & Time: ${o.toLocaleString()}`)}const n=e.config.preferredLang;return n&&n.trim()&&t.push(`Always respond in ${n.trim()}.`),t.length===0?"":`<BetterDeepSeek>
${t.join(`
`)}
</BetterDeepSeek>`}function me(e,t){var w;const n=(w=e.config)==null?void 0:w.mcpToolSchemas;if(!Array.isArray(n)||!n.length)return"";const o=Number(e.config.mcpInlineMaxChars)||8e3,r=n.length,s=[`<BetterDeepSeek> <BDS:MCP fingerprint="${t}">`,"You have access to the following MCP (Model Context Protocol) tools via remote servers.",`To invoke them, use: <BDS:AUTO:MCP url="SERVER_NAME_OR_URL" tool="TOOL_NAME" args='{"key":"value"}'>`,"The extension will call the tool and inject the result.","Important: Only ONE tool per response. Wait for the result before invoking another. Never invoke multiple tools at the same time.","","Available tools:"].join(`
`),l="</BDS:MCP> </BetterDeepSeek>",a=n.map(i=>{let c=`- Server: ${i.serverName} (${i.serverUrl||i.serverName}) | Tool: ${i.toolName}`;if(i.description&&(c+=` | Description: ${i.description}`),i.inputSchema&&typeof i.inputSchema=="object"){const f=i.inputSchema.properties;if(f){const m=Object.entries(f).map(([b,T])=>{const x=(i.inputSchema.required||[]).includes(b)?" (required)":"";return`${b}: ${(T==null?void 0:T.type)||"any"}${x}`});m.length&&(c+=` | Params: ${m.join(", ")}`)}}return c}),p=[s,...a,l].join(`
`);if(p.length<=o)return p;const u=i=>`
... and ${i} more tool(s) not shown (MCP tool list exceeds inline character limit \u2014 all tools are still available for invocation).`,d=u(1),h=s.length+1+l.length+d.length;let y=o-h;const E=[];for(const i of a){const c=i.length+1;if(y-c<0)break;y-=c,E.push(i)}const S=r-E.length,k=u(S);let g=[s,...E,k,l].join(`
`);for(;E.length>0&&g.length>o;){E.pop();const i=r-E.length,c=u(i);g=[s,...E,c,l].join(`
`)}return g}function ge(e,t,n,o){const s=(o.getInjectedEntries?o.getInjectedEntries(n):[]).includes(e.id);switch(e.schedule.type){case"first":return!s;case"always":return!0;case"interval":{const l=e.schedule.everyNTurns||3;return s?(t-1)%l===0:!0}default:return!1}}function Se(e,t=null){if(!Array.isArray(e))return null;for(let n=e.length-1;n>=0;n--){const o=e[n];if(o===t)continue;const r=C(o);if(!r.includes("<BDS:RP>"))continue;const s=r.match(/Character Name:\s*(.*?)\n/);if(s&&s[1])return s[1].trim()}return null}function we(e,t=null){if(!Array.isArray(e))return null;for(let n=e.length-1;n>=0;n--){const o=e[n];if(o===t)continue;const s=C(o).match(/<BDS:SKILLS fingerprint="(.*?)">/);if(s&&s[1])return s[1]}return null}function ye(e,t=null){if(!Array.isArray(e))return null;for(let n=e.length-1;n>=0;n--){const o=e[n];if(o===t)continue;const s=C(o).match(/<BDS:MCP fingerprint="(.*?)">/);if(s&&s[1])return s[1]}return null}function be(e,t=null){if(!Array.isArray(e))return null;for(let n=e.length-1;n>=0;n--){const o=e[n];if(o===t)continue;const s=C(o).match(/<BDS:PROJECT name="(.*?)">/);if(s&&s[1])return s[1]}return null}function j(e){let t=String(e||"");return t=t.replace(/<BetterDeepSeek>([\s\S]*?)<\/BetterDeepSeek>/gi,(n,o)=>o.includes("[BDS:AUTO]")||o.includes("[BDS:DEEP_RESEARCH]")||/<BDS:memory_calls[\s>]/i.test(o)?n:""),t=t.replace(/<BDS:SKILLS>[\s\S]*?<\/BDS:SKILLS>/gi,""),t=t.replace(/<BDS:memory_calls[^>]*>[\s\S]*?<\/BDS:memory_calls>/gi,""),t=t.replace(/<BDS:RP>[\s\S]*?<\/BDS:RP>/gi,""),t=t.replace(/<BDS:PROJECT[^>]*>[\s\S]*?<\/BDS:PROJECT>/gi,""),t=t.replace(/<BDS:PROJECT_CONTEXT>[\s\S]*?<\/BDS:PROJECT_CONTEXT>/gi,""),t.trim()}function Te(){try{const e=document.querySelector("._46a12ab");if(!e)return null;const t=(e.textContent||"").toLowerCase().trim();return t.includes("vision")?"vision":t.includes("expert")||t.includes("reasoner")?"expert":t.includes("deepthink")||t.includes("deep think")||t.includes("r1")?"deepthink":t.includes("instant")||t.includes("chat")||t.includes("flash")?"instant":null}catch{return null}}function Ee(e,t,n,o){const r=window.fetch;window.fetch=async function(l,a){try{const p=ke(l);if(!t(p))return r.apply(this,arguments);if(De(l,a,e),p.includes("/api/v0/chat_session/fetch_page")){const u=await r.apply(this,arguments);return u.clone().json().then(h=>{window.dispatchEvent(new CustomEvent("bds:session-data",{detail:JSON.stringify(h)}))}).catch(()=>{}),u}if(p.includes("/api/v0/chat/history_messages")){const u=await r.apply(this,arguments);return u.clone().json().then(h=>{window.dispatchEvent(new CustomEvent("bds:history-msgs",{detail:JSON.stringify(h)}))}).catch(()=>{}),u}n(p);try{const u=await xe(l,a,e);if(!u){const h=await r.apply(this,arguments);return M(h,p,u==null?void 0:u.modelName),h}const d=await r.call(this,u.input,u.init);return d&&d.status>=500&&window.dispatchEvent(new CustomEvent("bds:network-error",{detail:JSON.stringify({url:p,status:d.status,type:"fetch"})})),M(d,p,u.modelName),d}catch(u){throw window.dispatchEvent(new CustomEvent("bds:network-error",{detail:JSON.stringify({url:p,status:0,type:"fetch",error:String(u)})})),u}finally{o(p)}}catch(p){return console.warn("[BetterDeepSeek] Request patch failed:",p),r.apply(this,arguments)}}}function M(e,t,n){if(!(!e||!e.clone))try{const o=e.clone();Ce(o,n).catch(()=>{})}catch{}}function ke(e){return typeof e=="string"?e:e instanceof URL?e.toString():e instanceof Request?e.url:""}async function xe(e,t,n){const o=await Ae(e,t);if(!o)return null;let r;try{r=JSON.parse(o)}catch{return null}const s=r.model||null,l=v(r,n);if(!l.changed)return null;const a=JSON.stringify(l.payload),p=t&&t.headers?t.headers:e instanceof Request?e.headers:void 0,u=new Headers(p||{});u.set("content-type","application/json");const d={method:t&&t.method||(e instanceof Request?e.method:"POST"),headers:u,body:a,credentials:t&&t.credentials||(e instanceof Request?e.credentials:void 0),cache:t&&t.cache||(e instanceof Request?e.cache:void 0),mode:t&&t.mode||(e instanceof Request?e.mode:void 0),redirect:t&&t.redirect||(e instanceof Request?e.redirect:void 0),referrer:t&&t.referrer||(e instanceof Request?e.referrer:void 0),referrerPolicy:t&&t.referrerPolicy||(e instanceof Request?e.referrerPolicy:void 0),keepalive:t&&t.keepalive||(e instanceof Request?e.keepalive:void 0),integrity:t&&t.integrity||(e instanceof Request?e.integrity:void 0),signal:t&&t.signal||(e instanceof Request?e.signal:void 0)};return{input:typeof e=="string"||e instanceof URL?e:e.url,init:d,modelName:s}}async function Ce(e,t){try{const n=e.headers.get("content-type")||"";if(n.includes("text/event-stream")||n.includes("stream"))await Le(e,t);else{const o=await e.text();try{const r=JSON.parse(o),s=(r==null?void 0:r.usage)||(r==null?void 0:r.token_usage);s&&X(s.prompt_tokens||s.input_tokens||0,s.completion_tokens||s.output_tokens||0,t)}catch{}}}catch{}}async function Le(e,t){var l;const n=(l=e.body)==null?void 0:l.getReader();if(!n)return;const o=new TextDecoder;let r="";try{for(;;){const{done:a,value:p}=await n.read();if(p&&(r+=o.decode(p,{stream:!a})),a)break}}catch{return}const s=r.split(`
`);for(let a=s.length-1;a>=0;a--){const p=s[a].trim();if(!p.startsWith("data: "))continue;const u=p.slice(6).trim();if(u!=="[DONE]")try{const d=JSON.parse(u),h=(d==null?void 0:d.usage)||(d==null?void 0:d.token_usage);if(h){X(h.prompt_tokens||h.input_tokens||0,h.completion_tokens||h.output_tokens||0,t||(d==null?void 0:d.model));break}}catch{}}}function X(e,t,n){typeof e!="number"&&typeof t!="number"||window.dispatchEvent(new CustomEvent("bds:token-usage",{detail:JSON.stringify({inputTokens:Number(e)||0,outputTokens:Number(t)||0,modelName:n||null,timestamp:Date.now()})}))}async function Ae(e,t){return t&&typeof t.body=="string"?t.body:t&&t.body instanceof URLSearchParams?t.body.toString():e instanceof Request?e.clone().text():""}function De(e,t,n){try{let o;if(t&&t.headers){const r=t.headers;if(r instanceof Headers)o=r.get("authorization");else if(Array.isArray(r)){for(const[s,l]of r)if(s.toLowerCase()==="authorization"){o=l;break}}else typeof r=="object"&&(o=r.Authorization||r.authorization)}!o&&e instanceof Request&&(o=e.headers.get("authorization")),o&&typeof(n==null?void 0:n.setAuthToken)=="function"&&n.setAuthToken(o)}catch{}}function Re(e,t,n,o){const r=XMLHttpRequest.prototype.open,s=XMLHttpRequest.prototype.send,l=XMLHttpRequest.prototype.setRequestHeader;XMLHttpRequest.prototype.open=function(p,u){return this.__bdsRequestMeta={method:String(p||"GET").toUpperCase(),url:String(u||"")},r.apply(this,arguments)},XMLHttpRequest.prototype.setRequestHeader=function(p,u){return p&&String(p).toLowerCase()==="authorization"&&typeof(e==null?void 0:e.setAuthToken)=="function"&&e.setAuthToken(String(u||"")),l.apply(this,arguments)},XMLHttpRequest.prototype.send=function(p){try{const u=this.__bdsRequestMeta||{};if(!t(u.url))return s.call(this,p);if(u.url.includes("/api/v0/chat_session/fetch_page"))return this.addEventListener("load",()=>{try{const i=JSON.parse(this.responseText);window.dispatchEvent(new CustomEvent("bds:session-data",{detail:JSON.stringify(i)}))}catch{}}),s.call(this,p);if(u.url.includes("/api/v0/chat/history_messages"))return this.addEventListener("load",()=>{try{const i=JSON.parse(this.responseText);window.dispatchEvent(new CustomEvent("bds:history-msgs",{detail:JSON.stringify(i)}))}catch{}}),s.call(this,p);n(u.url);let d=!1;const h=()=>{d||(d=!0,(this.status>=500||this.status===0)&&window.dispatchEvent(new CustomEvent("bds:network-error",{detail:JSON.stringify({url:u.url,status:this.status,type:"xhr"})})),o(u.url))};this.addEventListener("loadend",h,{once:!0});const y=Ne(p);if(!y)return s.call(this,p);const E=JSON.parse(y),S=E.model||null,k=v(E,e);if(!k.changed)return s.call(this,p);const g=JSON.stringify(k.payload),w=this;return this.addEventListener("load",()=>{try{const i=w.responseText;i&&Oe(i,w,S)}catch{}},{once:!0}),s.call(this,g)}catch(u){const d=this.__bdsRequestMeta||{};console.warn("[BetterDeepSeek] XHR patch failed:",u);try{return s.call(this,p)}catch(h){throw t(d.url)&&o(d.url),h}}}}function Ne(e){return typeof e=="string"?e:e instanceof URLSearchParams?e.toString():""}function Oe(e,t,n){var o;try{if((((o=t.getResponseHeader)==null?void 0:o.call(t,"content-type"))||"").includes("text/event-stream")||e.startsWith("data: ")){const s=e.split(`
`);for(let l=s.length-1;l>=0;l--){const a=s[l].trim();if(!a.startsWith("data: "))continue;const p=a.slice(6).trim();if(p!=="[DONE]")try{const u=JSON.parse(p),d=u==null?void 0:u.usage;if(d){window.dispatchEvent(new CustomEvent("bds:token-usage",{detail:JSON.stringify({inputTokens:d.prompt_tokens||d.input_tokens||0,outputTokens:d.completion_tokens||d.output_tokens||0,modelName:n||(u==null?void 0:u.model)||null,timestamp:Date.now()})}));break}}catch{}}}}catch{}}const A="Nexo AI",ve=/(?:better\s*)?deep\s*seek(?:\.com|\s*ai)?/gi;function Pe(){if(typeof document>"u")return;function e(r){return!r||typeof r!="string"||!/deep\s*seek/i.test(r)?r:r.replace(ve,A)}try{let r=e(document.title)||A;document.title&&/deep\s*seek/i.test(document.title)&&(document.title=r);const s=Object.getOwnPropertyDescriptor(Document.prototype,"title")||Object.getOwnPropertyDescriptor(HTMLDocument.prototype,"title");s&&s.configurable&&Object.defineProperty(document,"title",{get(){return e(s.get.call(document))||A},set(l){s.set.call(document,e(l)||A)},configurable:!0})}catch{}function t(r){if(r){if(r.nodeType===Node.TEXT_NODE){const s=r.parentElement;if(s){const l=(s.tagName||"").toUpperCase();if(l==="SCRIPT"||l==="STYLE"||l==="TEXTAREA"||l==="CODE"||l==="PRE")return}r.nodeValue&&/deep\s*seek/i.test(r.nodeValue)&&(r.nodeValue=e(r.nodeValue));return}if(r.nodeType===Node.ELEMENT_NODE){const s=(r.tagName||"").toUpperCase();if(s==="SCRIPT"||s==="STYLE"||s==="TEXTAREA"||s==="CODE"||s==="PRE")return;if(r.placeholder&&/deep\s*seek/i.test(r.placeholder)&&(r.placeholder=e(r.placeholder)),r.title&&/deep\s*seek/i.test(r.title)&&(r.title=e(r.title)),r.value&&typeof r.value=="string"&&/deep\s*seek/i.test(r.value)&&(r.tagName==="BUTTON"||r.type==="button"||r.type==="submit")&&(r.value=e(r.value)),r.getAttribute){const a=["aria-label","placeholder","aria-placeholder","data-placeholder","alt","title","data-tip"];for(let p=0;p<a.length;p++){const u=a[p],d=r.getAttribute(u);d&&/deep\s*seek/i.test(d)&&r.setAttribute(u,e(d))}}let l=r.firstChild;for(;l;)t(l),l=l.nextSibling;r.shadowRoot&&t(r.shadowRoot)}}}function n(){document.title&&/deep\s*seek/i.test(document.title)&&(document.title=e(document.title)),document.documentElement&&t(document.documentElement)}n();const o=new MutationObserver(r=>{for(let s=0;s<r.length;s++){const l=r[s];if(l.type==="childList")for(let a=0;a<l.addedNodes.length;a++)t(l.addedNodes[a]);else l.type==="characterData"?l.target&&l.target.nodeValue&&/deep\s*seek/i.test(l.target.nodeValue)&&(l.target.nodeValue=e(l.target.nodeValue)):l.type==="attributes"&&t(l.target)}document.title&&/deep\s*seek/i.test(document.title)&&(document.title=e(document.title))});document.documentElement&&o.observe(document.documentElement,{childList:!0,subtree:!0,characterData:!0,attributes:!0,attributeFilter:["placeholder","title","aria-label","alt","aria-placeholder","data-placeholder"]}),typeof window<"u"&&setInterval(()=>{document.hidden||n()},2e3),document.readyState==="loading"&&document.addEventListener("DOMContentLoaded",n,{once:!0})}(function(){"use strict";Pe();const e={configUpdate:"bds:config-update",deepResearchConfigUpdate:"bds:deep-research-config-update",requestConfig:"bds:request-config",markVoiceMessage:"bds:mark-voice-message",sessionData:"bds:session-data"},t="/api/v0/chat_session/fetch_page",n="/api/v0/chat/history_messages",o="/api/v0/chat/completion";function r(){try{return JSON.parse(localStorage.getItem("bds_injected_chats")||"[]")}catch{return[]}}function s(i){const c=r();c.includes(i)||(c.push(i),c.length>50&&c.shift(),localStorage.setItem("bds_injected_chats",JSON.stringify(c)))}function l(){try{return JSON.parse(localStorage.getItem("bds_injected_chars")||"{}")}catch{return{}}}function a(i,c){const f=l();f[i]=c;const m=Object.keys(f);m.length>50&&delete f[m[0]],localStorage.setItem("bds_injected_chars",JSON.stringify(f))}function p(i){try{return JSON.parse(localStorage.getItem("bds_injected_entries")||"{}")[i]||[]}catch{return[]}}function u(i,c){try{const f=JSON.parse(localStorage.getItem("bds_injected_entries")||"{}");f[i]||(f[i]=[]),f[i].includes(c)||f[i].push(c);const m=Object.keys(f);m.length>50&&delete f[m[0]],localStorage.setItem("bds_injected_entries",JSON.stringify(f))}catch{}}function d(){var i,c;try{for(let m=0;m<localStorage.length;m++){const b=localStorage.key(m);if(b&&/token|auth|session/i.test(b)){const T=localStorage.getItem(b);if(!T)continue;if(T.trim().startsWith("{"))try{const x=JSON.parse(T),L=x.token||x.accessToken||x.access_token||x.user_token||((i=x.user)==null?void 0:i.token);if(L&&typeof L=="string")return L}catch{}else if(typeof T=="string"&&T.length>20){let x=T;return x.startsWith("Bearer ")&&(x=x.substring(7)),x.startsWith('"')&&x.endsWith('"')&&(x=x.slice(1,-1)),x}}}const f=(c=document.cookie.split("; ").find(m=>m.startsWith("user_token=")||m.startsWith("token=")))==null?void 0:c.split("=")[1];if(f)return decodeURIComponent(f)}catch(f){console.warn("[BDS] Failed to search auth token in storage:",f)}return null}const h={config:{systemPrompt:"",systemPromptEntries:[],skills:[],memories:[],activeCharacter:null,mcpToolSchemas:[]},hasInjected:i=>r().includes(i),markInjected:i=>s(i),getInjectedEntries:i=>p(i),markEntryInjected:(i,c)=>u(i,c),getLastChar:i=>l()[i]||null,setLastChar:(i,c)=>a(i,c),currentSessionChar:null,activeCompletionRequests:0,isNextVoiceMessage:!1,authToken:d(),setAuthToken:function(i){i&&i!==this.authToken&&(this.authToken=i)}};if(window.__bdsNetworkPatched)return;window.__bdsNetworkPatched=!0,(function(){if(window.__BDS_CONFIG__)return;let i=0;const c=new Map;window.addEventListener("bds:debug-api-response",m=>{let b=m.detail;if(typeof b=="string")try{b=JSON.parse(b)}catch{return}const T=c.get(b.id);T&&(T(b.result),c.delete(b.id))});function f(m){return function(){const b=Array.from(arguments);return new Promise(T=>{const x=++i;c.set(x,T),window.dispatchEvent(new CustomEvent("bds:debug-api-request",{detail:JSON.stringify({id:x,method:m,args:b})}))})}}window.__BDS_CONFIG__={raw:f("getRaw"),getFlag:f("getFlag"),getConfig:f("getConfig"),applyRemote:f("applyRemote"),replaceRemote:f("replaceRemote"),resetToBuiltin:f("resetToBuiltin"),detectModel:f("detectModel"),toggleDebugPanel:f("toggleDebugPanel")}})(),window.addEventListener(e.configUpdate,i=>{let c=i&&i.detail?i.detail:{};if(typeof c=="string")try{c=JSON.parse(c)}catch(f){console.error("[BDS] Failed to parse configUpdate detail:",f)}h.config=F(c||{})}),window.addEventListener(e.deepResearchConfigUpdate,i=>{let c=i&&i.detail?i.detail:{};if(typeof c=="string")try{c=JSON.parse(c)}catch(f){console.error("[BDS] Failed to parse deepResearchConfigUpdate detail:",f)}h.config.deepResearch=R(c||{})}),window.addEventListener(e.markVoiceMessage,()=>{h.isNextVoiceMessage=!0}),window.addEventListener("bds:request-history-msgs",async i=>{let c=i&&i.detail?i.detail:{};if(typeof c=="string")try{c=JSON.parse(c)}catch{return}const f=c==null?void 0:c.sessionId;if(!f)return;const m=`${n}?chat_session_id=${encodeURIComponent(f)}`,b={"Content-Type":"application/json"};h.authToken&&(b.Authorization=`Bearer ${h.authToken}`);try{const T=await y(m,{method:"GET",headers:b,credentials:"include"});if(!T.ok){console.warn("[BDS] history_mgs fetch failed:",T.status);return}const x=await T.json();x.__bdsExplicit=!0,window.dispatchEvent(new CustomEvent("bds:history-msgs",{detail:JSON.stringify(x)}))}catch(T){console.warn("[BDS] history_msgs fetch error:",T)}}),E();const y=window.fetch.bind(window);Ee(h,S,g,w),Re(h,S,g,w);function E(){window.dispatchEvent(new CustomEvent(e.requestConfig))}function S(i){const c=String(i||"");return c.includes("/api/v0/chat/completion")||c.includes("/api/v0/chat/edit_message")||c.includes(t)||c.includes(n)}function k(i,c){const f={status:i,url:String(c||""),activeCompletionRequests:h.activeCompletionRequests,timestamp:Date.now()};window.dispatchEvent(new CustomEvent(e.networkState,{detail:JSON.stringify(f)}))}function g(i){h.activeCompletionRequests+=1,k("start",i)}function w(i){h.activeCompletionRequests=Math.max(0,h.activeCompletionRequests-1),k("end",i)}})()})();

function esc(value) {

  return String(value || "")
    .replace(
      /[\\()]/g,
      match =>
        "\\" + match
    )
    .replace(
      /[\r\n]+/g,
      " "
    );

}


function latin(value) {

  return esc(value)
    .replace(
      /[^\x20-\xFF]/g,
      "?"
    );

}


function wrap(
  text,
  max = 86
) {

  const words =
    String(text || "")
      .split(/\s+/)
      .filter(Boolean);


  const output = [];

  let line = "";


  for (const word of words) {

    const next =
      line
        ? line + " " + word
        : word;


    if (
      next.length >
      max
    ) {

      if (line) {
        output.push(line);
      }

      line =
        word;

    } else {

      line =
        next;

    }

  }


  if (line) {

    output.push(line);

  }


  return output;

}


function section(
  lines,
  title,
  items
) {

  if (!items?.length) {
    return;
  }


  lines.push({
    t: title,
    b: true,
    s: 12,
    space: 5
  });


  for (const item of items) {

    lines.push(
      ...item
    );

  }


  lines.push({
    space: 5
  });

}


export function downloadPdf(cv) {

  const lines = [];


  lines.push({
    t:
      cv.personal.name ||
      "Tu nombre",

    b: true,
    s: 20,
    space: 2
  });


  if (
    cv.personal.headline
  ) {

    lines.push({
      t:
        cv.personal.headline,

      b: true,
      s: 11,
      space: 3
    });

  }


  const contact = [

    cv.personal.email,
    cv.personal.phone,
    cv.personal.city,
    cv.personal.linkedin

  ]
    .filter(Boolean)
    .join(
      "  |  "
    );


  if (contact) {

    lines.push({
      t: contact,
      s: 9,
      space: 7
    });

  }


  if (cv.summary) {

    lines.push({
      t: "PERFIL",
      b: true,
      s: 12,
      space: 3
    });


    wrap(
      cv.summary
    ).forEach(
      text =>
        lines.push({
          t: text,
          s: 9
        })
    );


    lines.push({
      space: 5
    });

  }


  section(

    lines,

    "EXPERIENCIA",

    (
      cv.experience ||
      []
    )
      .filter(
        item =>
          item.role ||
          item.company
      )
      .map(
        item => [

          {
            t:
              [
                item.role,
                item.company
              ]
                .filter(Boolean)
                .join(" — "),

            b: true,
            s: 10
          },

          {
            t:
              [
                item.start,
                item.end
              ]
                .filter(Boolean)
                .join(" – "),

            s: 8
          },

          ...wrap(
            item.description ||
            "",
            90
          ).map(
            text => ({
              t: text,
              s: 9
            })
          ),

          {
            space: 3
          }

        ]
      )

  );


  section(

    lines,

    "FORMACIÓN",

    (
      cv.education ||
      []
    )
      .filter(
        item =>
          item.degree ||
          item.institution
      )
      .map(
        item => [

          {
            t:
              [
                item.degree,
                item.institution
              ]
                .filter(Boolean)
                .join(" — "),

            b: true,
            s: 10
          },

          {
            t:
              [
                item.start,
                item.end
              ]
                .filter(Boolean)
                .join(" – "),

            s: 8
          },

          {
            space: 3
          }

        ]
      )

  );


  if (
    cv.skills?.length
  ) {

    section(

      lines,

      "COMPETENCIAS",

      [
        [
          {
            t:
              cv.skills.join(
                "  •  "
              ),

            s: 9
          }
        ]
      ]

    );

  }


  if (
    cv.languages?.some(
      item =>
        item.name
    )
  ) {

    section(

      lines,

      "IDIOMAS",

      cv.languages
        .filter(
          item =>
            item.name
        )
        .map(
          item => [

            {
              t:
                `${item.name}${
                  item.level
                    ? " — " +
                      item.level
                    : ""
                }`,

              s: 9
            }

          ]
        )

    );

  }


  if (
    cv.certifications?.some(
      item =>
        item.name
    )
  ) {

    section(

      lines,

      "CERTIFICACIONES",

      cv.certifications
        .filter(
          item =>
            item.name
        )
        .map(
          item => [

            {
              t:
                [
                  item.name,
                  item.issuer,
                  item.year
                ]
                  .filter(Boolean)
                  .join(" — "),

              s: 9
            }

          ]
        )

    );

  }


  if (
    cv.projects?.some(
      item =>
        item.name
    )
  ) {

    section(

      lines,

      "PROYECTOS",

      cv.projects
        .filter(
          item =>
            item.name
        )
        .map(
          item => [

            {
              t:
                item.name,

              b: true,
              s: 10
            },

            ...wrap(
              item.description ||
              ""
            ).map(
              text => ({
                t: text,
                s: 9
              })
            ),

            ...(
              item.link
                ? [
                    {
                      t:
                        item.link,

                      s: 8
                    }
                  ]
                : []
            ),

            {
              space: 3
            }

          ]
        )

    );

  }


  const content = [];

  let y =
    800;


  const add = (
    text,
    size = 10,
    bold = false
  ) => {

    content.push(

      `BT /F${bold ? 2 : 1} ${size} Tf 52 ${y} Td (${latin(text)}) Tj ET`

    );


    y -=
      size + 5;

  };


  for (
    const line of lines
  ) {

    if (
      line.space
    ) {

      y -= line.space;

      continue;

    }


    if (
      y < 55
    ) {

      break;

    }


    add(
      line.t,
      line.s || 9,
      line.b
    );

  }


  const stream =
    content.join(
      "\n"
    );


  const objects = [];


  objects[1] =
    "<< /Type /Catalog /Pages 2 0 R >>";


  objects[2] =
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>";


  objects[3] =
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>";


  objects[4] =
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";


  objects[5] =
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";


  objects[6] =
    `<< /Length ${stream.length} >>
stream
${stream}
endstream`;


  let pdf =
    "%PDF-1.4\n";


  const offsets =
    [0];


  for (
    let index = 1;
    index <= 6;
    index++
  ) {

    offsets[index] =
      pdf.length;


    pdf +=
      `${index} 0 obj
${objects[index]}
endobj
`;

  }


  const xref =
    pdf.length;


  pdf +=
    "xref\n0 7\n0000000000 65535 f \n";


  for (
    let index = 1;
    index <= 6;
    index++
  ) {

    pdf +=
      String(
        offsets[index]
      )
        .padStart(
          10,
          "0"
        ) +
      " 00000 n \n";

  }


  pdf +=
    `trailer
<< /Size 7 /Root 1 0 R >>
startxref
${xref}
%%EOF`;


  const blob =
    new Blob(

      [
        new Uint8Array(

          [
            ...pdf
          ].map(
            character =>
              character.charCodeAt(0) &
              255
          )

        )
      ],

      {
        type:
          "application/pdf"
      }

    );


  const anchor =
    document.createElement(
      "a"
    );


  anchor.href =
    URL.createObjectURL(
      blob
    );


  anchor.download =
    (
      cv.personal.name ||
      "CV_UMA"
    )
      .replace(
        /\s+/g,
        "_"
      ) +
    ".pdf";


  anchor.click();


  setTimeout(
    () =>
      URL.revokeObjectURL(
        anchor.href
      ),

    1000
  );

}
export async function downloadDocx(
  cv
) {

  if (!window.docx) {

    alert(
      "El generador DOCX no está disponible."
    );

    return;

  }


  const docx =
    window.docx;


  const children =
    [];


  const paragraph = (
    text,
    options = {}
  ) =>
    new docx.Paragraph({

      text,

      spacing: {
        after:
          options.after ??
          100
      },

      heading:
        options.heading,

      border:
        options.border,

      style:
        options.style

    });


  children.push(

    new docx.Paragraph({

      children: [

        new docx.TextRun({

          text:
            cv.personal.name ||
            "Tu nombre",

          bold: true,
          size: 34,
          color: "951D4B"

        })

      ],

      spacing: {
        after: 80
      }

    })

  );


  if (
    cv.personal.headline
  ) {

    children.push(

      new docx.Paragraph({

        children: [

          new docx.TextRun({

            text:
              cv.personal.headline,

            bold: true,
            size: 22,
            color: "334155"

          })

        ],

        spacing: {
          after: 90
        }

      })

    );

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

    children.push(

      new docx.Paragraph({

        text: contact,

        spacing: {
          after: 180
        }

      })

    );

  }


  const heading =
    text => {

      children.push(

        new docx.Paragraph({

          children: [

            new docx.TextRun({

              text,

              bold: true,
              size: 22,
              color: "951D4B"

            })

          ],

          spacing: {
            before: 140,
            after: 80
          },

          border: {

            bottom: {

              style:
                docx.BorderStyle.SINGLE,

              size: 4,

              color:
                "E2E8F0"

            }

          }

        })

      );

    };


  if (
    cv.summary
  ) {

    heading(
      "PERFIL"
    );


    children.push(

      paragraph(
        cv.summary,
        {
          after: 130
        }
      )

    );

  }


  if (
    cv.experience?.some(
      item =>
        item.role ||
        item.company
    )
  ) {

    heading(
      "EXPERIENCIA"
    );


    cv.experience
      .filter(
        item =>
          item.role ||
          item.company
      )
      .forEach(
        item => {

          children.push(

            new docx.Paragraph({

              children: [

                new docx.TextRun({

                  text:
                    [
                      item.role,
                      item.company
                    ]
                      .filter(Boolean)
                      .join(
                        " — "
                      ),

                  bold: true

                })

              ],

              spacing: {
                after: 30
              }

            })

          );


          if (
            item.start ||
            item.end
          ) {

            children.push(

              paragraph(

                [
                  item.start,
                  item.end
                ]
                  .filter(Boolean)
                  .join(
                    " – "
                  ),

                {
                  after: 50
                }

              )

            );

          }


          if (
            item.description
          ) {

            children.push(

              paragraph(
                item.description,
                {
                  after: 120
                }
              )

            );

          }

        }
      );

  }


  if (
    cv.education?.some(
      item =>
        item.degree ||
        item.institution
    )
  ) {

    heading(
      "FORMACIÓN"
    );


    cv.education
      .filter(
        item =>
          item.degree ||
          item.institution
      )
      .forEach(
        item => {

          children.push(

            new docx.Paragraph({

              children: [

                new docx.TextRun({

                  text:
                    [
                      item.degree,
                      item.institution
                    ]
                      .filter(Boolean)
                      .join(
                        " — "
                      ),

                  bold: true

                })

              ],

              spacing: {
                after: 30
              }

            })

          );


          if (
            item.start ||
            item.end
          ) {

            children.push(

              paragraph(

                [
                  item.start,
                  item.end
                ]
                  .filter(Boolean)
                  .join(
                    " – "
                  ),

                {
                  after: 100
                }

              )

            );

          }

        }
      );

  }


  if (
    cv.skills?.length
  ) {

    heading(
      "COMPETENCIAS"
    );


    children.push(

      paragraph(
        cv.skills.join(
          " • "
        )
      )

    );

  }


  if (
    cv.languages?.some(
      item =>
        item.name
    )
  ) {

    heading(
      "IDIOMAS"
    );


    cv.languages
      .filter(
        item =>
          item.name
      )
      .forEach(
        item =>

          children.push(

            paragraph(

              `${
                item.name
              }${
                item.level
                  ? " — " +
                    item.level
                  : ""
              }`

            )

          )
      );

  }


  if (
    cv.certifications?.some(
      item =>
        item.name
    )
  ) {

    heading(
      "CERTIFICACIONES"
    );


    cv.certifications
      .filter(
        item =>
          item.name
      )
      .forEach(
        item =>

          children.push(

            paragraph(

              [
                item.name,
                item.issuer,
                item.year
              ]
                .filter(Boolean)
                .join(
                  " — "
                )

            )

          )
      );

  }


  if (
    cv.projects?.some(
      item =>
        item.name
    )
  ) {

    heading(
      "PROYECTOS"
    );


    cv.projects
      .filter(
        item =>
          item.name
      )
      .forEach(
        item => {

          children.push(

            new docx.Paragraph({

              children: [

                new docx.TextRun({
                  text:
                    item.name,

                  bold: true
                })

              ],

              spacing: {
                after: 30
              }

            })

          );


          if (
            item.description
          ) {

            children.push(

              paragraph(
                item.description,
                {
                  after: 40
                }
              )

            );

          }


          if (
            item.link
          ) {

            children.push(

              paragraph(
                item.link,
                {
                  after: 100
                }
              )

            );

          }

        }
      );

  }


  const documentFile =
    new docx.Document({

      sections: [

        {

          properties: {

            page: {

              margin: {

                top: 720,
                right: 720,
                bottom: 720,
                left: 720

              }

            }

          },

          children

        }

      ]

    });


  const blob =
    await docx.Packer.toBlob(
      documentFile
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
    ".docx";


  anchor.click();


  setTimeout(
    () =>
      URL.revokeObjectURL(
        anchor.href
      ),

    1000
  );

}
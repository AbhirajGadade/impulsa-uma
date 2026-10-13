async function extractPdf(file) {

  const pdfjs =
    await import(
      '/vendor/pdf.min.mjs'
    );


  pdfjs.GlobalWorkerOptions.workerSrc =
    '/vendor/pdf.worker.min.mjs';


  const pdf =
    await pdfjs.getDocument({
      data:
        await file.arrayBuffer()
    }).promise;


  let text = '';


  for (
    let pageNumber = 1;
    pageNumber <= pdf.numPages;
    pageNumber++
  ) {

    const page =
      await pdf.getPage(
        pageNumber
      );


    const content =
      await page.getTextContent();


    text +=
      content.items
        .map(
          item =>
            item.str
        )
        .join(' ') +
      '\n';

  }


  return text;

}


async function extractDocx(file) {

  const zip =
    await window.JSZip.loadAsync(
      await file.arrayBuffer()
    );


  const xml =
    await zip
      .file(
        'word/document.xml'
      )
      ?.async(
        'text'
      );


  if (!xml) {

    throw new Error(
      'DOCX inválido'
    );

  }


  return xml
    .replace(
      /<w:tab\/>/g,
      ' '
    )
    .replace(
      /<w:br\/>/g,
      '\n'
    )
    .replace(
      /<\/w:p>/g,
      '\n'
    )
    .replace(
      /<[^>]+>/g,
      ' '
    )
    .replace(
      /&amp;/g,
      '&'
    )
    .replace(
      /\s+/g,
      ' '
    );

}


export async function extractText(
  file
) {

  const name =
    file.name.toLowerCase();


  if (
    name.endsWith(
      '.pdf'
    )
  ) {

    return extractPdf(file);

  }


  if (
    name.endsWith(
      '.docx'
    )
  ) {

    return extractDocx(file);

  }


  return file.text();

}


export function scoreCv(text) {

  const normalized =
    text.toLowerCase();


  let score = 0;

  const checks = [];


  const add = (
    name,
    points,
    ok,
    tip
  ) => {

    if (ok) {
      score += points;
    }

    checks.push({
      name,
      points,
      ok,
      tip
    });

  };


  add(
    'Datos de contacto',
    15,

    /@[\w.-]+\.[a-z]{2,}/i
      .test(text) &&

    /(\+?51)?[\s-]?9\d{8}/
      .test(
        text.replace(
          /\s+/g,
          ''
        )
      ),

    'Incluye correo profesional y teléfono.'
  );


  add(
    'Perfil profesional',
    15,

    /(perfil|resumen|objetivo|sobre mí|sobre mi)/
      .test(normalized),

    'Agrega un resumen de 3 a 5 líneas adaptado al puesto.'
  );


  add(
    'Experiencia o proyectos',
    20,

    /(experiencia|proyecto|práctica|practica|voluntariado)/
      .test(normalized),

    'Incluye experiencia, prácticas o proyectos con resultados.'
  );


  add(
    'Formación',
    15,

    /(educación|educacion|formación|formacion|universidad|instituto)/
      .test(normalized),

    'Haz visible tu formación académica.'
  );


  add(
    'Competencias',
    15,

    /(habilidades|competencias|skills|tecnologías|tecnologias)/
      .test(normalized),

    'Agrupa habilidades técnicas y profesionales relevantes.'
  );


  add(
    'Logros cuantificables',
    10,

    /\b\d+(%|\+|\s*(usuarios|personas|proyectos|horas|clientes|casos))/
      .test(normalized),

    'Añade cifras cuando puedas demostrar impacto.'
  );


  add(
    'Extensión adecuada',
    10,

    text.trim().length > 700 &&
    text.trim().length < 7500,

    'Mantén el CV conciso: normalmente 1–2 páginas.'
  );


  const words = [

    ...new Set(

      (
        normalized.match(
          /\b[a-záéíóúñ]{5,}\b/g
        ) || []
      ).filter(
        word =>
          ![
            'para',
            'como',
            'desde',
            'hasta',
            'sobre',
            'entre',
            'donde',
            'cuando',
            'universidad'
          ].includes(word)
      )

    )

  ];


  const keywords =
    words
      .map(
        word => [

          word,

          (
            normalized.match(
              new RegExp(
                `\\b${word}\\b`,
                'g'
              )
            ) || []
          ).length

        ]
      )
      .sort(
        (a, b) =>
          b[1] - a[1]
      )
      .slice(
        0,
        8
      )
      .map(
        value =>
          value[0]
      );


  return {
    score,
    checks,
    keywords
  };

}
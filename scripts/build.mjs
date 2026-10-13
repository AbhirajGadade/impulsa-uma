import {
  createHash
} from "node:crypto";


import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";


import path from "node:path";


import {
  fileURLToPath
} from "node:url";


/* ============================================================
   PATHS
   ============================================================ */

export const projectRoot =

  fileURLToPath(

    new URL(
      "../",
      import.meta.url
    )

  );


export const distRoot =

  path.join(
    projectRoot,
    "dist"
  );


/* ============================================================
   ENV
   ============================================================ */

const envPath =

  path.join(
    projectRoot,
    ".env"
  );


if (
  existsSync(
    envPath
  )
) {

  process.loadEnvFile(
    envPath
  );
}


/* ============================================================
   BUILD
   ============================================================ */

export function build() {


  /* ----------------------------------------------------------
     Source
     ---------------------------------------------------------- */

  const source =

    path.join(
      projectRoot,
      "src",
      "portal"
    );


  /* ----------------------------------------------------------
     JS + CSS
     ---------------------------------------------------------- */

  const files =

    readdirSync(
      source
    )

      .filter(

        name =>

          /\.(js|css)$/
            .test(
              name
            )

      )

      .sort();


  /* ----------------------------------------------------------
     Contents
     ---------------------------------------------------------- */

  const contents =

    new Map(

      files.map(

        name => [

          name,

          readFileSync(

            path.join(
              source,
              name
            )

          )

        ]

      )

    );


  /* ----------------------------------------------------------
     Hash
     ---------------------------------------------------------- */

  const hash =

    createHash(
      "sha256"
    );


  for (
    const name
    of files
  ) {

    hash
      .update(
        name
      )
      .update(
        "\0"
      )
      .update(
        contents.get(
          name
        )
      );
  }


  const release =

    hash
      .digest(
        "hex"
      )
      .slice(
        0,
        12
      );


  /* ----------------------------------------------------------
     Versioned filenames
     ---------------------------------------------------------- */

  const names =

    new Map(

      files.map(

        name => {


          const ext =

            path.extname(
              name
            );


          return [

            name,

            `${
              name.slice(
                0,
                -ext.length
              )
            }.uma-${
              release
            }${
              ext
            }`

          ];

        }

      )

    );


  /* ----------------------------------------------------------
     Rewrite imports and asset refs
     ---------------------------------------------------------- */

  const rewrite =

    text => {


      for (
        const [
          oldName,
          newName
        ]
        of names
      ) {

        text =

          text.replaceAll(
            oldName,
            newName
          );
      }


      return text;
    };


  /* ----------------------------------------------------------
     Routes
     ---------------------------------------------------------- */

  const routes =

    JSON.parse(

      readFileSync(

        path.join(
          projectRoot,
          "src",
          "routes.json"
        ),

        "utf8"

      )

    );


  if (

    !Array.isArray(
      routes
    )

    ||

    !routes.every(

      route =>

        typeof route ===
          "string"

        &&

        /^(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/
          .test(
            route
          )

    )

  ) {

    throw new Error(

      "src/routes.json must contain relative route paths without leading slashes."

    );
  }


  /* ----------------------------------------------------------
     Clean dist
     ---------------------------------------------------------- */

  rmSync(

    distRoot,

    {
      recursive:
        true,

      force:
        true
    }

  );


  /* ----------------------------------------------------------
     Public
     ---------------------------------------------------------- */

  cpSync(

    path.join(
      projectRoot,
      "public"
    ),

    distRoot,

    {
      recursive:
        true
    }

  );


  /* ----------------------------------------------------------
     Assets
     ---------------------------------------------------------- */

  const assets =

    path.join(
      distRoot,
      "assets"
    );


  mkdirSync(

    assets,

    {
      recursive:
        true
    }

  );


  /* ----------------------------------------------------------
     Write JS/CSS
     ---------------------------------------------------------- */

  for (
    const name
    of files
  ) {

    writeFileSync(

      path.join(
        assets,
        names.get(
          name
        )
      ),

      rewrite(

        contents
          .get(
            name
          )
          .toString(
            "utf8"
          )

      )

    );
  }


  /* ----------------------------------------------------------
     HTML
     ---------------------------------------------------------- */

  const html =

    rewrite(

      readFileSync(

        path.join(
          projectRoot,
          "src",
          "index.html"
        ),

        "utf8"

      )

    );


  /* ----------------------------------------------------------
     Generate routes
     ---------------------------------------------------------- */

  for (
    const route
    of routes
  ) {

    const directory =

      path.join(
        distRoot,
        route
      );


    mkdirSync(

      directory,

      {
        recursive:
          true
      }

    );


    writeFileSync(

      path.join(
        directory,
        "index.html"
      ),

      html

    );
  }


  /* ----------------------------------------------------------
     Build metadata
     ---------------------------------------------------------- */

  writeFileSync(

    path.join(
      projectRoot,
      "src",
      "portal-build.json"
    ),


    `${
      JSON.stringify(

        {

          release,

          entry:
            names.get(
              "index-DSiOxGBJ.js"
            ),

          routes,

        },

        null,
        2

      )
    }\n`

  );


  console.log(

    `Built ${files.length} modules and ${routes.length} routes (release ${release}).`

  );


  return {

    release,

    routes

  };
}


/* ============================================================
   RUN
   ============================================================ */

if (

  process.argv[1]

  &&

  path.resolve(
    process.argv[1]
  )

  ===

  fileURLToPath(
    import.meta.url
  )

) {

  build();
}

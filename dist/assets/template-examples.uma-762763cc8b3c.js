// Fictional examples shared by the gallery's preview and editable Word export.
const university = "Universidad María Auxiliadora";
const spanishLabels = {
  profile: "PERFIL", skills: "COMPETENCIAS", languages: "IDIOMAS",
  experience: "EXPERIENCIA", projects: "PROYECTOS Y PRÁCTICAS",
  education: "FORMACIÓN", achievements: "LOGROS Y CERTIFICACIONES",
  note: "Ejemplo ficticio. Reemplaza todos los datos con tu información real.",
};

const samples = {
  general: {
    name: "Sofía Vargas", role: "Profesional UMA · Administración",
    profile: "Egresada de Administración con experiencia en organización de procesos, análisis de información y atención al cliente. Interés en gestión operativa y mejora continua.",
    skills: ["Excel y Power BI", "Gestión de procesos", "Análisis de indicadores", "Comunicación y trabajo en equipo"],
    experience: [{ title: "Asistente de Operaciones", meta: "Servicios Andinos · 2023–2024", lines: ["Organicé el seguimiento de 35 solicitudes semanales y reduje los tiempos de respuesta en 20%.", "Preparé reportes de indicadores para apoyar las decisiones del equipo."] }],
    education: [{ title: "Administración de Empresas", meta: university + " · 2019–2023", lines: ["Bachiller · Proyecto de mejora de procesos comerciales."] }],
    achievements: [{ title: "Certificación en Excel Avanzado", meta: "Centro de Formación Profesional · 2024", lines: ["Diseñé un tablero de seguimiento de ventas e inventarios."] }],
  },
  derecho: {
    con: {
      name: "Valeria Mendoza", role: "Abogada · Derecho Civil y Corporativo",
      profile: "Abogada con experiencia en revisión de contratos, seguimiento de expedientes y asesoría corporativa. Capacidad de investigación, argumentación y organización documental.",
      skills: ["Derecho civil y comercial", "Redacción de contratos", "Investigación jurídica", "Conciliación y negociación"],
      experience: [{ title: "Asistente Legal", meta: "Estudio Jurídico Horizonte · 2023–2024", lines: ["Revisé 40 contratos comerciales y elaboré informes de observaciones.", "Organicé 120 expedientes y mejoré el seguimiento de plazos procesales."] }, { title: "Practicante de Asesoría Jurídica", meta: "Consultorio Jurídico Universitario · 2022–2023", lines: ["Apoyé la orientación legal de 60 personas en asuntos civiles y de familia."] }],
      education: [{ title: "Título Profesional en Derecho", meta: university + " · 2018–2023", lines: ["Investigación final sobre mecanismos de conciliación extrajudicial."] }],
      achievements: [{ title: "Curso de Redacción Jurídica", meta: "Centro de Formación Legal · 2024", lines: ["Implementé un registro de vencimientos para el equipo legal."] }],
    },
    sin: {
      name: "Sebastián Ruiz", role: "Estudiante de Derecho · 8.º ciclo",
      profile: "Estudiante de Derecho interesado en prácticas jurídicas. Formación en investigación normativa, redacción de escritos y atención al usuario, con participación en actividades académicas.",
      skills: ["Investigación normativa", "Redacción jurídica", "Argumentación oral", "Organización de expedientes"],
      experience: [{ title: "Proyecto de Clínica Jurídica", meta: university + " · 2024", lines: ["Analicé 12 casos académicos de derecho de familia y elaboré fichas de jurisprudencia.", "Preparé materiales informativos para una campaña de orientación legal."] }, { title: "Voluntariado de Orientación Ciudadana", meta: "Programa Universitario · 2023", lines: ["Apoyé el registro y seguimiento de 30 consultas bajo supervisión docente."] }],
      education: [{ title: "Pregrado en Derecho", meta: university + " · 2021–Actualidad", lines: ["8.º ciclo · Participación en taller de litigación oral."] }],
      achievements: [{ title: "Concurso de Debate Jurídico", meta: "Actividad Académica · 2024", lines: ["Finalista en una simulación de audiencia civil."] }],
    },
  },
  ingenieria: {
    con: {
      name: "Andrea Torres", role: "Ingeniera de Sistemas · Desarrollo de Software",
      profile: "Ingeniera de Sistemas con experiencia en desarrollo web y bases de datos. Orientada a crear aplicaciones accesibles, optimizar procesos y colaborar con equipos ágiles.",
      skills: ["JavaScript y TypeScript", "React y Node.js", "PostgreSQL y SQL", "Git y metodologías ágiles"],
      experience: [{ title: "Desarrolladora Full Stack Junior", meta: "Innovación Digital · 2023–2024", lines: ["Desarrollé 5 módulos web y reduje los tiempos de carga en 28%.", "Implementé 12 servicios REST para integrar información académica."] }, { title: "Practicante de Sistemas", meta: "Servicios Tecnológicos UMA · 2022–2023", lines: ["Automaticé reportes semanales y brindé soporte a 80 usuarios."] }],
      education: [{ title: "Ingeniería de Sistemas e Informática", meta: university + " · 2019–2023", lines: ["Titulada · Proyecto de gestión académica con React y Node.js."] }],
      achievements: [{ title: "Desarrollo Web y Bases de Datos", meta: "Programa de Formación Técnica · 2024", lines: ["Publiqué una aplicación de seguimiento de tareas con autenticación."] }],
    },
    sin: {
      name: "Diego Rojas", role: "Estudiante de Ingeniería de Sistemas · 7.º ciclo",
      profile: "Estudiante de Ingeniería de Sistemas interesado en prácticas de desarrollo web. Experiencia académica en programación, bases de datos y proyectos colaborativos.",
      skills: ["HTML, CSS y JavaScript", "Python y SQL", "Git y GitHub", "Resolución de problemas"],
      experience: [{ title: "Sistema Académico de Biblioteca", meta: "Proyecto Universitario · 2024", lines: ["Desarrollé un registro de préstamos con Python y una base de datos SQL.", "Trabajé en un equipo de 4 estudiantes para probar y documentar la aplicación."] }, { title: "Voluntariado de Soporte Digital", meta: "Programa Estudiantil UMA · 2023", lines: ["Orienté a 25 estudiantes en herramientas digitales y uso de plataformas."] }],
      education: [{ title: "Ingeniería de Sistemas e Informática", meta: university + " · 2021–Actualidad", lines: ["7.º ciclo · Cursos de programación y diseño de bases de datos."] }],
      achievements: [{ title: "Fundamentos de Desarrollo Web", meta: "Curso Complementario · 2024", lines: ["Portafolio académico con una web de reservas y un gestor de tareas."] }],
    },
  },
  negocios: {
    con: {
      name: "Mariana López", role: "Administradora · Operaciones y Gestión Comercial",
      profile: "Administradora con experiencia en procesos comerciales, análisis financiero y gestión de proveedores. Enfoque en eficiencia operativa y seguimiento de resultados.",
      skills: ["Power BI y Excel avanzado", "Gestión de proveedores", "Análisis financiero", "Indicadores comerciales"],
      experience: [{ title: "Analista de Operaciones", meta: "Grupo Comercial Andino · 2023–2024", lines: ["Rediseñé el flujo de distribución y reduje los tiempos de entrega en 22%.", "Implementé tableros de indicadores para compras, ventas e inventarios."] }, { title: "Practicante Comercial", meta: "Distribuidora del Pacífico · 2022–2023", lines: ["Apoyé el seguimiento de 35 clientes y preparé reportes de rentabilidad."] }],
      education: [{ title: "Administración de Empresas", meta: university + " · 2019–2023", lines: ["Licenciada · Investigación sobre mejora de procesos comerciales."] }],
      achievements: [{ title: "Gestión de Procesos y Power BI", meta: "Centro de Formación Empresarial · 2024", lines: ["Coordiné la digitalización del control de inventarios de una tienda."] }],
    },
    sin: {
      name: "Mateo Salinas", role: "Estudiante de Administración · 8.º ciclo",
      profile: "Estudiante de Administración interesado en prácticas comerciales y operativas. Formación en análisis de datos, atención al cliente y planificación de proyectos.",
      skills: ["Excel y análisis de datos", "Investigación de mercados", "Atención al cliente", "Organización y comunicación"],
      experience: [{ title: "Plan de Negocio Universitario", meta: university + " · 2024", lines: ["Realicé una encuesta a 80 consumidores y elaboré una proyección de costos.", "Presenté una propuesta de comercialización junto a un equipo de 5 estudiantes."] }, { title: "Feria de Emprendimiento", meta: "Programa Estudiantil · 2023", lines: ["Apoyé el registro de participantes y la coordinación de 15 expositores."] }],
      education: [{ title: "Administración de Empresas", meta: university + " · 2021–Actualidad", lines: ["8.º ciclo · Cursos de finanzas, marketing y gestión operativa."] }],
      achievements: [{ title: "Excel para la Gestión Empresarial", meta: "Curso Complementario · 2024", lines: ["Elaboré un tablero académico de ventas y costos."] }],
    },
  },
  salud: {
    con: {
      name: "Lucía Ramos", role: "Licenciada en Enfermería · Atención Asistencial",
      profile: "Enfermera con experiencia en atención integral al paciente, educación preventiva y registro clínico. Compromiso con la seguridad, el trato empático y el trabajo multidisciplinario.",
      skills: ["Atención de enfermería", "Bioseguridad", "Registro de historias clínicas", "Educación preventiva"],
      experience: [{ title: "Enfermera Asistencial", meta: "Centro de Salud Los Olivos · 2023–2024", lines: ["Participé en la atención de 30 pacientes por turno siguiendo los protocolos del servicio.", "Realicé 18 sesiones educativas sobre hábitos saludables y prevención."] }, { title: "Interna de Enfermería", meta: "Hospital Comunitario · 2022–2023", lines: ["Apoyé el seguimiento de signos vitales y el registro clínico bajo supervisión."] }],
      education: [{ title: "Licenciatura en Enfermería", meta: university + " · 2018–2023", lines: ["Rotaciones en atención primaria y servicios hospitalarios."] }],
      achievements: [{ title: "Primeros Auxilios y Soporte Básico", meta: "Centro de Capacitación Asistencial · 2024", lines: ["Colaboré en una campaña de educación sanitaria para 60 familias."] }],
    },
    sin: {
      name: "Paola Herrera", role: "Estudiante de Enfermería · 8.º ciclo",
      profile: "Estudiante de Enfermería interesada en prácticas asistenciales. Formación en cuidados básicos, bioseguridad y promoción de la salud, con experiencia académica supervisada.",
      skills: ["Cuidados básicos de enfermería", "Control de signos vitales", "Bioseguridad", "Comunicación empática"],
      experience: [{ title: "Rotación Académica Supervisada", meta: "Centro de Atención Primaria · 2024", lines: ["Apoyé el registro de signos vitales y la orientación de pacientes.", "Organicé material educativo sobre higiene y prevención de infecciones."] }, { title: "Voluntariado de Promoción de Salud", meta: "Programa Universitario · 2023", lines: ["Participé en 6 jornadas de educación sanitaria en la comunidad."] }],
      education: [{ title: "Pregrado en Enfermería", meta: university + " · 2021–Actualidad", lines: ["8.º ciclo · Prácticas académicas de atención primaria."] }],
      achievements: [{ title: "Taller de Primeros Auxilios", meta: "Actividad Académica · 2024", lines: ["Elaboré material de promoción de hábitos saludables."] }],
    },
  },
  farmacia: {
    con: {
      name: "Camila Salazar", role: "Química Farmacéutica · Farmacia y Bioquímica",
      profile: "Química farmacéutica con experiencia en dispensación, control de inventarios y buenas prácticas de almacenamiento. Orientada a la atención responsable y al uso seguro de medicamentos.",
      skills: ["Atención farmacéutica", "Control de inventarios", "Buenas prácticas de almacenamiento", "Farmacovigilancia"],
      experience: [{ title: "Asistente de Farmacia", meta: "Boticas Salud y Vida · 2023–2024", lines: ["Apoyé la revisión y dispensación de 60 recetas diarias siguiendo los protocolos del establecimiento.", "Implementé un control de vencimientos que redujo las mermas en 18%."] }, { title: "Practicante de Control de Calidad", meta: "Laboratorio Andino · 2022–2023", lines: ["Apoyé análisis fisicoquímicos y organicé registros de trazabilidad."] }],
      education: [{ title: "Farmacia y Bioquímica", meta: university + " · 2018–2023", lines: ["Título profesional · Investigación en control de calidad farmacéutico."] }],
      achievements: [{ title: "Buenas Prácticas de Almacenamiento", meta: "Programa de Formación Farmacéutica · 2024", lines: ["Colaboré en una campaña sobre uso responsable de medicamentos."] }],
    },
    sin: {
      name: "Alex Vargas", role: "Estudiante de Farmacia y Bioquímica · 8.º ciclo",
      profile: "Estudiante de Farmacia y Bioquímica interesado en prácticas de laboratorio y atención farmacéutica. Formación en análisis fisicoquímico, documentación y buenas prácticas.",
      skills: ["Técnicas de laboratorio", "Análisis fisicoquímico", "Registro y trazabilidad", "Buenas prácticas y bioseguridad"],
      experience: [{ title: "Proyecto de Control de Calidad", meta: "Laboratorio Académico UMA · 2024", lines: ["Analicé muestras académicas y elaboré reportes de resultados bajo supervisión.", "Preparé un registro de trazabilidad para reactivos y material de laboratorio."] }, { title: "Campaña de Educación Farmacéutica", meta: "Voluntariado Universitario · 2023", lines: ["Apoyé la preparación de materiales sobre almacenamiento seguro de medicamentos."] }],
      education: [{ title: "Pregrado en Farmacia y Bioquímica", meta: university + " · 2021–Actualidad", lines: ["8.º ciclo · Cursos de farmacología y control de calidad."] }],
      achievements: [{ title: "Buenas Prácticas de Laboratorio", meta: "Taller Académico · 2024", lines: ["Presenté un proyecto estudiantil de organización de reactivos."] }],
    },
  },
};

const englishLabels = {
  profile: "PROFILE", skills: "SKILLS", languages: "LANGUAGES",
  experience: "EXPERIENCE", education: "EDUCATION", achievements: "PROJECTS AND CERTIFICATIONS",
  note: "Fictional CV example. Replace all details with your own information.",
};
const international = {
  10: {
    name: "Elena Castillo", role: "Betriebswirtschaft · Projektkoordination",
    labels: { profile: "PROFIL", skills: "KENNTNISSE", languages: "SPRACHEN", experience: "BERUFSERFAHRUNG", education: "AUSBILDUNG", achievements: "PROJEKTE UND ZERTIFIKATE", note: "Fiktives Beispiel. Ersetzen Sie alle Angaben durch Ihre eigenen Daten." },
    profile: "Absolventin der Betriebswirtschaft mit Erfahrung in Projektkoordination, Datenanalyse und digitalem Marketing. Strukturierte Arbeitsweise und Freude an internationaler Zusammenarbeit.",
    skills: ["Excel und Power BI", "Projektkoordination", "Digitales Marketing", "Prozessanalyse"], languages: ["Spanisch · Muttersprache", "Englisch · B2", "Deutsch · B1"],
    experience: [{ title: "Assistentin im Projektmanagement", meta: "Andes Consulting · 2023–2024", lines: ["Koordinierte den Fortschritt von 3 Projekten und erstellte wöchentliche Berichte.", "Vereinfachte die Datenerfassung und reduzierte den Aufwand um 20 %."] }],
    education: [{ title: "B.A. Betriebswirtschaft", meta: university + " · 2019–2023", lines: ["Schwerpunkt Unternehmensprozesse und internationales Management."] }],
    achievements: [{ title: "Datenanalyse mit Excel", meta: "Weiterbildung · 2024", lines: ["Entwickelte ein Dashboard zur Projektüberwachung."] }],
  },
  11: {
    name: "Daniela Paredes", role: "Business Analyst · Operations and Reporting", labels: englishLabels,
    profile: "Business graduate with experience in operational reporting, customer service and data analysis. Skilled in translating information into practical process improvements.",
    skills: ["Excel and Power BI", "Operational reporting", "Customer service", "Process improvement"], languages: ["Spanish · Native", "English · C1", "French · A2"],
    experience: [{ title: "Operations Assistant", meta: "Pacific Services · 2023–2024", lines: ["Prepared weekly reports for 4 service teams and improved response times by 18%.", "Created a dashboard to track customer requests and service performance."] }],
    education: [{ title: "Bachelor of Business Administration", meta: university + ", Peru · 2019–2023", lines: ["Final project focused on operational performance indicators."] }],
    achievements: [{ title: "Data Analysis and Business Reporting", meta: "Professional Training · 2024", lines: ["Built an inventory reporting project using Excel and Power BI."] }],
  },
  12: {
    name: "Gabriel Romero", role: "International Business · Supply Chain", labels: englishLabels,
    profile: "International Business graduate with experience in purchasing support, supplier coordination and export documentation. Interested in trade and logistics operations.",
    skills: ["Supplier coordination", "Export documentation", "Excel reporting", "Inventory planning"], languages: ["Spanish · Native", "English · B2", "Mandarin · A2"],
    experience: [{ title: "International Trade Assistant", meta: "Andes Export · 2023–2024", lines: ["Coordinated documents for 24 shipments and maintained supplier records.", "Prepared purchasing reports that supported inventory planning."] }],
    education: [{ title: "Bachelor of International Business", meta: university + " · 2019–2023", lines: ["Academic project on distribution and export feasibility."] }],
    achievements: [{ title: "International Logistics", meta: "Professional Training · 2024", lines: ["Developed a supplier comparison tool for a student export project."] }],
  },
  13: {
    name: "Renata Flores", role: "Administración · Gestión de Proyectos",
    profile: "Graduada en Administración con experiencia en coordinación de proyectos y análisis de indicadores. Capacidad de organización, atención al cliente y colaboración entre equipos.",
    skills: ["Excel y Power BI", "Coordinación de proyectos", "Análisis de indicadores", "Atención al cliente"], languages: ["Español · Nativo", "Inglés · B2"],
    experience: [{ title: "Asistente de Proyectos", meta: "Gestión Integral · 2023–2024", lines: ["Coordiné el seguimiento de 3 proyectos y preparé reportes de avance.", "Organicé un registro de entregables que redujo las incidencias administrativas en 20%."] }],
    education: [{ title: "Administración de Empresas", meta: university + " · 2019–2023", lines: ["Trabajo final sobre planificación y seguimiento de proyectos."] }],
    achievements: [{ title: "Gestión de Proyectos y Análisis de Datos", meta: "Formación Complementaria · 2024", lines: ["Elaboré un tablero de seguimiento de objetivos para un proyecto comercial."] }],
  },
  14: {
    name: "Nicolás Silva", role: "Project Coordinator · Business Operations", labels: englishLabels,
    profile: "Business graduate with experience coordinating projects, tracking milestones and analysing operational data. Strong communication skills and a practical approach to process improvement.",
    skills: ["Project coordination", "Excel and Power BI", "Stakeholder communication", "Operational analysis"], languages: ["Spanish · Native", "English · C1"],
    experience: [{ title: "Project Support Assistant", meta: "Global Operations · 2023–2024", lines: ["Tracked milestones across 3 projects and prepared weekly progress reports.", "Introduced a shared reporting process that reduced administrative rework by 20%."] }],
    education: [{ title: "BA in Business Administration", meta: university + " · 2019–2023", lines: ["Final project on performance reporting and process improvement."] }],
    achievements: [{ title: "Project Management Fundamentals", meta: "Professional Development · 2024", lines: ["Led a student team developing a business feasibility study."] }],
  },
};

const palettes = {
  general: ["951d4b", "5f1734", "f9edf2"], derecho: ["7b513b", "503326", "f6eee9"],
  ingenieria: ["315b71", "203d4d", "eaf2f6"], negocios: ["51455f", "342b3e", "f1edf4"],
  salud: ["356b67", "224844", "eaf5f3"], farmacia: ["516e42", "33482a", "eef5e9"],
  internacional: ["315f52", "203f37", "e9f3f0"],
};
const layouts = ["modern", "executive", "corporate", "minimal", "photo", "classic"];

export function getTemplateExample(template) {
  const isInternational = template.facultad === "internacional";
  const family = samples[template.facultad] || samples.general;
  const sample = isInternational ? international[template.id] : family[template.experiencia || "con"] || family;
  if (!sample) throw new Error("No existe un ejemplo para esta plantilla.");
  const [accent, ink, tint] = palettes[template.facultad] || palettes.general;
  const labels = sample.labels || spanishLabels;
  const layout = isInternational ? (template.id % 2 ? "minimal" : "classic") : layouts[(template.id - 1) % layouts.length];
  return {
    ...sample, id: template.id, layout, accent, ink, tint, labels,
    contact: ["estudiante@example.com", "+51 900 000 000", "Lima, Perú"],
    languages: sample.languages || ["Español · Nativo", "Inglés · Intermedio B1"],
    sections: [
      { title: template.experiencia === "sin" ? labels.projects : labels.experience, entries: sample.experience },
      { title: labels.education, entries: sample.education },
      { title: labels.achievements, entries: sample.achievements },
    ],
  };
}

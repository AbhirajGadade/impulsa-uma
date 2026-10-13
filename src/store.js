const KEY = "impulsa-uma-cv-v1";

export const emptyCv = {

  template: "nexo",

  personal: {
    name: "",
    headline: "",
    email: "",
    phone: "",
    city: "Lima, Perú",
    linkedin: ""
  },

  summary: "",

  education: [
    {
      institution: "",
      degree: "",
      start: "",
      end: ""
    }
  ],

  experience: [
    {
      company: "",
      role: "",
      start: "",
      end: "",
      description: ""
    }
  ],

  skills: [],

  languages: [
    {
      name: "",
      level: ""
    }
  ],

  certifications: [
    {
      name: "",
      issuer: "",
      year: ""
    }
  ],

  projects: [
    {
      name: "",
      description: "",
      link: ""
    }
  ]
};

export function loadCv() {

  try {

    return {
      ...structuredClone(emptyCv),
      ...JSON.parse(
        localStorage.getItem(KEY) || "{}"
      )
    };

  } catch {

    return structuredClone(emptyCv);

  }
}

export function saveCv(data) {

  localStorage.setItem(
    KEY,
    JSON.stringify(data)
  );

}

export function clearCv() {

  localStorage.removeItem(KEY);

}
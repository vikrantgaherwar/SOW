export const flyerLanguageFields = {
  en: "English",
  fr: "French",
  ita: "Italian",
  es: "Spanish",
  de: "German",
};

export const flyerContactFields = [
  [
    {
      id: 1,
      name: "hpeName",
      type: "text",
      placeholder: "Enter HPE Name",
      required: true,
      title: "HPE Name",
    },
    {
      id: 2,
      name: "customerName",
      type: "text",
      required: true,
      placeholder: "Enter Customer Name",
      title: "Customer Name",
    },
  ],
  [
    {
      id: 3,
      name: "hpeEmail",
      required: true,
      type: "email",
      placeholder: "Enter HPE Email",
      title: "HPE Email",
    },
    {
      id: 4,
      name: "customerEmail",
      required: true,
      type: "email",
      placeholder: "Enter Customer Email",
      title: "Customer Email",
    },
  ],
  [
    {
      id: 5,
      name: "hpePhone",
      required: true,
      type: "text",
      placeholder: "Enter HPE Phone",
      title: "HPE Phone",
    },
    {
      id: 6,
      name: "customerPhone",
      type: "text",
      required: true,
      placeholder: "Enter Customer Phone",
      title: "Customer Phone",
    },
  ],
  [
    {
      id: 7,
      name: "hpeAddress",
      type: "textarea",
      required: true,
      placeholder: "Enter HPE Address",
      title: "HPE Address",
      rows: 1,
      maxLength: 22,
    },
    {
      id: 8,
      name: "customerAddress",
      type: "textarea",
      required: true,
      placeholder: "Enter Customer Address",
      title: "Customer Address",
      rows: 1,
      maxLength: 44,
    },
  ],
];

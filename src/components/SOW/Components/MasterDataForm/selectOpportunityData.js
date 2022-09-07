export const selectMasterFormData = [
  // {
  //   id: 1,
  //   name:"clone",
  //   type: "select",
  //   placeholder: "Clone",
  //   required: false,
  //   title: "Clone From"
  // },
  {
    id: 2,
    name: "business",
    type: "select",
    placeholder: "Select Business",
    required: true,
    title: "Business",
  },
  {
    id: 3,
    name: "country",
    required: true,
    type: "select",
    placeholder: "Select Country",
    title: "Country",
  },

  {
    id: 4,
    name: "contractTerms",
    required: true,
    type: "select",
    placeholder: "Select Contract Terms",
    title: "Contract Terms",
  },

  {
    id: 5,
    name: "revRecog",
    required: true,
    type: "select",
    placeholder: "Select Revenue Recognition",
    title: "Revenue Recognition",
  },

  {
    id: 6,
    name: "sowTemplate",
    type: "select",
    required: true,
    hasSelectData: true,
    placeholder: "Select SOW Template",
    title: "SOW Template",
  },
];

export const EDIT_DISABLED_MASTER_DATA_FIELDS = [
  "country",
  "business",
  "sowTemplate",
];

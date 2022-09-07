export const customerDataFields = [
  [
    {
      id: 1,
      name: "accountName",
      type: "text",
      placeholder: "Enter Account Name",
      required: true,
      title: "Account Name",
    },
    {
      id: 2,
      name: "geo",
      required: true,
      type: "text",
      placeholder: "Enter Geo",
      title: "Geo",
    },
  ],
  [
    {
      id: 3,
      name: "countryName",
      required: true,
      type: "text",
      placeholder: "Enter Country",
      title: "Country",
    },
    {
      id: 4,
      name: "businessName",
      required: true,
      type: "text",
      placeholder: "Enter Business",
      title: "Business Name",
    },
  ],
  [
    {
      id: 5,
      name: "salesStage",
      required: true,
      type: "text",
      placeholder: "Enter Sales Stage",
      title: "Sales Stage",
      readonly: true,
    },
    {
      id: 6,
      name: "winLossReason",
      type: "text",
      required: true,
      placeholder: "Select Win Loss Reason",
      title: "Win Loss Reason",
      readonly: true,
    },
  ],
  [
    {
      id: 7,
      name: "productLine",
      type: "select",
      required: true,
      placeholder: "Select Product Line",
      title: "Product Line",
    },
  ],
];

export const EDIT_DISABLED_CUSTOMER_DATA_FIELDS = ["productLine"];

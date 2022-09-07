const ReferenceCategories = [
  { value: "DA Opinion", name: "DA Opinion" },
  { value: "Design Documents", name: "Design Documents" },
  { value: "Effort Estimation (E3T)", name: "Effort Estimation (E3T)" },
  { value: "Framework", name: "Framework" },
  { value: "Lessons Learnt", name: "Lessons Learnt" },
  { value: "Others", name: "Others" },
  { value: "Project Plan", name: "Project Plan" },
  { value: "Risk Logs", name: "Risk Logs" },
  { value: "SA Opinion", name: "SA Opinion" },
  { value: "Statement of Work (SoW)", name: "Statement of Work (SoW)" },
];
const KnowledgeCategories = [
  { name: "Additional Presentations", value: "Additional Presentations" },
  { name: "Additional Resources", value: "Additional Resources" },
  {
    name: "Announcements and Communications",
    value: "Announcements and Communications",
  },
  { name: "Audio", value: "Audio" },
  { name: "Best Practices", value: "Best Practices" },
  { name: "Brochures", value: "Brochures" },
  { name: "Case Study", value: "Case Study" },
  { name: "Competitive Insights", value: "Competitive Insights" },
  { name: "Customer Presentations", value: "Customer Presentations" },
  { name: "Customer References", value: "Customer References" },
  { name: "Datasheets", value: "Datasheets" },
  { name: "Event Presentations", value: "Event Presentations" },
  { name: "FAQ", value: "FAQ" },
  { name: "Framework", value: "Framework" },
  { name: "Infographic", value: "Infographic" },
  {
    name: "Installation and Configuration Guides",
    value: "Installation and Configuration Guides",
  },
  { name: "Internal Trainings", value: "Internal Trainings" },
  {
    name: "Maintenance and Service Guides",
    value: "Maintenance and Service Guides",
  },
  { name: "Market Insights", value: "Market Insights" },
  { name: "Ordering Guides", value: "Ordering Guides" },
  { name: "Partner Presentations", value: "Partner Presentations" },
  { name: "Playbook", value: "Playbook" },
  { name: "Process Delivery Guide", value: "Process Delivery Guide" },
  { name: "Process Documents", value: "Process Documents" },
  { name: "Product Presentations", value: "Product Presentations" },
  { name: "Quick Reference Cards", value: "Quick Reference Cards" },
  { name: "QuickSpecs", value: "QuickSpecs" },
  { name: "Reference Architectures", value: "Reference Architectures" },
  { name: "Sales and Pursuit Guides", value: "Sales and Pursuit Guides" },
  { name: "Sales Presentations", value: "Sales Presentations" },
  { name: "Solution or Service Briefs", value: "Solution or Service Briefs" },
  {
    name: "Technology and Product Documentation",
    value: "Technology and Product Documentation",
  },
  { name: "User Guides", value: "User Guides" },
  { name: "Video", value: "Video" },
  { name: "Whitepapers", value: "Whitepapers" },
  { name: "Workshop Presentations", value: "Workshop Presentations" },
];

const Audience = [
  { id: 1, name: "A&PS Executive" },
  { id: 2, name: "A&PS Management" },
  { id: 3, name: "Delivery" },
  { id: 4, name: "Guest" },
  { id: 5, name: "Practice" },
  { id: 6, name: "Pursuit" },
  { id: 7, name: "Sales" },
];
export function GetKnowledgeCategories() {
  return KnowledgeCategories;
}

export function GetAudiance() {
  return Audience;
}

export function GetRefrenceCategories() {
  return ReferenceCategories;
}

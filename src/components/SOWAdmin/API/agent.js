import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_ADMIN_API_URL;

// axios.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response) {
//       const { data, status } = error?.response;
//       switch (status) {
//         case 400:
//           if (data.errors) {
//             const modelStateErrors = [];
//             for (const key in data.errors) {
//               if (data.errors[key]) {
//                 modelStateErrors.push(data.errors[key] + " for " + key);
//               }
//             }
//             toast.warn(`${data.title}: ` + modelStateErrors.join(", "), {
//               toastId: "errorToastAdminModuleId",
//             });
//           }
//           break;
//         case 500:
//           if (process.env.REACT_APP_ENV === "PROD") {
//             toast.error(data.title, {
//               toastId: "errorToastAdminModuleId",
//             });
//           } else {
//             var bootBoxModal = bootbox.alert({
//               title: data.title,
//               message: data.detail,
//               size: "large",
//               backdrop: true,
//             });
//             bootBoxModal.init(function () {
//               bootBoxModal.attr("id", "exceptionModal");
//             });
//           }
//           break;
//         default:
//           toast.error(data.title, {
//             toastId: "errorToastAdminModuleId",
//           });
//           break;
//       }
//       return Promise.reject(error.response);
//     } else {
//       return Promise.reject(JSON.stringify(error.message ?? error));
//     }
//   }
// );

// axios.interceptors.request.use(
//   (request) => {
//     // request.headers.common.employeeID = Cookies.get("empnumber")
//     return request;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

const responseBody = (response) => response.data;

const requests = {
  get: (url) => axios.get(url).then(responseBody),
  post: (url, body) => axios.post(url, body).then(responseBody),
  put: (url, body) => axios.put(url, body).then(responseBody),
  del: (url) => axios.delete(url).then(responseBody),
  getWithCancelToken: (url, cancelToken) =>
    axios.get(url, { cancelToken: cancelToken }).then(responseBody),
};

const DropDownData = {
  list: (url) => requests.get(url)
};

const WorkItemNameList = {
  list: (url) => requests.get(url)
};

const TemplateIDList = {
  list: (url) => requests.get(url)
};
const GetWorkPackageSections = {
  list: (url) => requests.get(url)
}
const AdminPredifinedModules = {
  create: (predefinedModule) => requests.post("api/SOWAdminPreDefinedModule", predefinedModule),
}

const LoginInfo = {
  details: (id) =>
    requests.get(`api/SOWAdminUser/GetSowUserDetails_v1?empNumber=${id}`),
};

const UserManagement = {
  list: (url) => requests.get(url),
  details: (url) => requests.get(url),
  create: (user) => requests.post("api/SOWAdminUser/AddSowUser/", user),
  update: (user) => requests.put(`api/SOWAdminUser/EditSowUser/`, user),
  delete: (empID) => requests.del(`api/SOWAdminUser/DeleteSowUser/${empID}`),
  listWithCancelToken: (url, cancelToken) =>
    requests.getWithCancelToken(url, cancelToken),
};

const RolesManagement = {
  list: (url) => requests.get(url),
  create: (role) => requests.post("api/SOWAdminUser/AddSowRole/", role),
  update: (role) => requests.put("api/SOWAdminUser/EditSowRole/", role),
  delete: (url) => requests.del(url),
  listWithCancelToken: (url, cancelToken) =>
    requests.getWithCancelToken(url, cancelToken),
};

const TypeOfWorkManagement = {
  list: (url) => requests.get(url),
  listPackageData: (moduleId, packageId, templateId) =>
    requests.get(
      `api/SOWAdminWorkPackage/GetWorkPackageData/${moduleId}/${packageId}/${templateId}`
    ),
  listWithCancelToken: (url, cancelToken) =>
    requests.getWithCancelToken(url, cancelToken),
  update: (url, sowSolutionHubData) => requests.put(url, sowSolutionHubData),
  delete: (typeOfWorkId, packageId, modifiedBy) =>
    requests.del(
      `api/SOWAdminWorkPackage/DeleteWorkPackage/${typeOfWorkId}/${packageId}/${modifiedBy}`
    ),
  typeOfWorkUpdate: (typeOfWorkData) =>
    requests.put(
      "api/SOWAdminWorkPackage/EditSowTypeOfWorkName/",
      typeOfWorkData
    ),
  Add : (url,sowSolutionHubData) => requests.post(url,sowSolutionHubData),
};
const CostManagement = {
  list: (url) => requests.get(url),
  update: (costManagementDataToUpdate) =>
    requests.put(
      "api/SOWAdminWorkPackage/CostingEstimationDataEdit/",
      costManagementDataToUpdate
    ),
};

const CustomModulesApproval = {
  list: (url) => requests.get(url),
  listWithCancelToken: (url, cancelToken) =>
    requests.getWithCancelToken(url, cancelToken),
  update: (url, typeOfWork) => requests.put(url, typeOfWork),
};
const agent = {
  UserManagement,
  RolesManagement,
  LoginInfo,
  TypeOfWorkManagement,
  CostManagement,
  CustomModulesApproval,
  DropDownData,
  TemplateIDList,
  GetWorkPackageSections,
  AdminPredifinedModules,
  WorkItemNameList,
};

export default agent;

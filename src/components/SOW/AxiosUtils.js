import axios from "axios";
import { join } from "lodash";
import bootbox from "bootbox";
import { toast } from 'react-toastify';

// Declare a Map to store the identification and cancellation functions for each request
const pending = new Map();

/**
 * Add Request
 * @param {Object} config
 */
const addPending = (config) => {
  const flag = join(
    [
      config.method,
      config.url,
      // JSON.stringify(config.params),
      // JSON.stringify(config.data),
    ],
    "&"
  );
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pending.has(flag)) {
        // If the current request does not exist in pending, add it
        pending.set(flag, cancel);
      }
    });
};

/**
 * Remove Request
 * @param {Object} config
 */
const removePending = (config) => {
  const flag = join(
    [
      config.method,
      config.url,
      // JSON.stringify(config.params),
      // JSON.stringify(config.data),
    ],
    "&"
  );
  if (pending.has(flag)) {
    // If the current request identity exists in pending, you need to cancel the current request and remove it
    const cancel = pending.get(flag);
    cancel(flag);
    pending.delete(flag);
  }
};

/**
 * Empty requests in pending (called on route jumps)
 */
export const clearPending = () => {
  for (const [url, cancel] of pending) {
    cancel(url);
  }
  pending.clear();
};

axios.interceptors.request.use(
  (request) => {
    removePending(request); // Check previous requests to cancel before the request starts
    addPending(request); // Add current request to pending
    // other code before request
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    removePending(response); // Remove this request at the end of the request
    return response;
  },
  (error) => {
    if (axios.isCancel(error)) {
      console.log("repeated request: " + error.message);
    } else if (error.response) {
      const { data, status } = error?.response;
      switch (status) {
        case 400:
          if (data.errors) {
            const modelStateErrors = [];
            for (const key in data.errors) {
              if (data.errors[key]) {
                modelStateErrors.push(data.errors[key] + " for " + key)
              }
            };
            toast.warn(`${data.title}: ` + modelStateErrors.join(", "), {
              toastId: 'errorToastSOWModuleId',
            })
          }
          break;
        case 500:
          if (process.env.REACT_APP_ENV === "PROD") {
            toast.error(data.title, {
              toastId: 'errorToastSOWModuleId',
            })
          }
          else {
            var bootBoxModal = bootbox.alert({
              title: data.title,
              message: data.detail,
              size: 'large',
              backdrop: true
            });
            bootBoxModal.init(function () {
              bootBoxModal.attr("id", "exceptionModal")
            });
          }
          break;
        default:
          toast.error(data.title, {
            toastId: 'errorToastSOWModuleId',
          })
          break;
      }
      return Promise.reject(error.response);
    }
    else {
      return Promise.reject(JSON.stringify(error.message ?? error));
    }
    return Promise.reject(error);
  }
);

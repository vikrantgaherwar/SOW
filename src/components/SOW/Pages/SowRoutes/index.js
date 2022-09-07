import { useRouteMatch, Switch } from "react-router-dom";
import Header from "../../Header-Copy";
import PageTitle from "../../Components/PageTitle";
import { Provider, useDispatch } from "react-redux";
import SelectOpportunity from "../SelectOpportunityPage";
import { Store } from "../../Redux/Store";
import CustomerData from "../CustomerData";
import E3T from "../E3T";
import MasterFormRoute from "../../Components/RouteComponents/MasterFormRoute";
import CustomerFormRoute from "../../Components/RouteComponents/CustomerFormRoute";
import E3TFormRoute from "../../Components/RouteComponents/E3TFormRoute";
import SidePanels from "../../Components/SidePanels";
import DynamicDataRoute from "../../Components/RouteComponents/DynamicDataRoute";
import DynamicData from "../DynamicData";
import EditDataLoadedPath from "../../Components/EditDataLoadedPath";
import GeneratePreviewPath from "../../Components/GeneratePreviewPath";
import GeneratePage from "../GeneratePage";
import EditCustomerFormRoute from "../../Components/RouteComponents/EditCustomerFormRoute";
import EditDynamicDataRoute from "../../Components/RouteComponents/EditDynamicDataRoute";
import EditGeneratePreview from "../../Components/EditGeneratePreview";
import SOWTabs from "../../Components/SOWTabs";
import EditE3TRoute from "../../Components/RouteComponents/EditE3TRoute";
import ModeProvider from "../../Components/ModeProvider";
import ConfirmationModal from "../../Components/ConfirmationModal";
import ConfirmationModalContainer from "../../Components/ConfirmationModalContainer";
import ErrorBoundary from "../../Components/ErrorBoundary";
import E3TSummary from "../E3TSummary";
import { useEffect } from "react";
import { actionMasterDropDownFetchAll } from "../../Redux/Actions/MasterDropDown";
import LoaderComponent from "../../Components/LoaderComponent";
import SharingModal from "../../Components/SharingModal";
const SowRoutes = () => {
  const match = useRouteMatch();

  return (
    <Provider store={Store}>
      <ModeProvider>
        <LoaderComponent />
        <Header />
        <ErrorBoundary>
          <SidePanels />
          <SharingModal />
          <div className="page-layout-sow">
            <div className="empty"></div>

            <div className="my-form-container">
              <PageTitle title="Solution 360 (POC)" />

              <SOWTabs />
              <ConfirmationModalContainer />
              <Switch>
                <EditDataLoadedPath
                  exact
                  checkState
                  path={`${match.url}/draft`}
                >
                  <h1>Loaded</h1>
                </EditDataLoadedPath>

                <EditCustomerFormRoute exact path={`${match.url}/draft/:id`}>
                  <CustomerData />
                </EditCustomerFormRoute>
                
                <EditE3TRoute exact path={`${match.url}/draft/:id/e3t`}>
                  <E3T />
                </EditE3TRoute>

                <EditE3TRoute exact path={`${match.url}/draft/:id/summary`}>
                  <E3TSummary />
                </EditE3TRoute>

                <EditDynamicDataRoute
                  exact
                  path={`${match.url}/draft/:id/dynamic-data`}
                >
                  <DynamicData />
                </EditDynamicDataRoute>

                <EditGeneratePreview
                  exact
                  path={`${match.url}/draft/:id/generate-preview`}
                >
                  <GeneratePage />
                </EditGeneratePreview>


                <EditDataLoadedPath
                  exact
                  checkState
                  path={`${match.url}/clone`}
                >
                  <h1>Loaded</h1>
                </EditDataLoadedPath>

                <EditCustomerFormRoute exact path={`${match.url}/clone/:id`}>
                  <CustomerData />
                </EditCustomerFormRoute>

                <EditE3TRoute exact path={`${match.url}/clone/:id/e3t`}>
                  <E3T />
                </EditE3TRoute>

                <EditE3TRoute exact path={`${match.url}/clone/:id/summary`}>
                  <E3TSummary />
                </EditE3TRoute>

                <EditDynamicDataRoute
                  exact
                  path={`${match.url}/clone/:id/dynamic-data`}
                >
                  <DynamicData />
                </EditDynamicDataRoute>

                <EditGeneratePreview
                  exact
                  path={`${match.url}/clone/:id/generate-preview`}
                >
                  <GeneratePage />
                </EditGeneratePreview>

                <EditDataLoadedPath exact checkState path={`${match.url}/edit`}>
                  <h1>Loaded</h1>
                </EditDataLoadedPath>

                <EditCustomerFormRoute exact path={`${match.url}/edit/:id`}>
                  <CustomerData />
                </EditCustomerFormRoute>

                {/* <EditCustomerFormRoute
                exact
                path={`${match.url}/edit/:oppId/:id/customer-data`}
              >
                <CustomerData />
              </EditCustomerFormRoute> */}

                <EditE3TRoute exact path={`${match.url}/edit/:id/e3t`}>
                  <E3T />
                </EditE3TRoute>

                <EditE3TRoute exact path={`${match.url}/edit/:id/summary`}>
                  <E3TSummary />
                </EditE3TRoute>

                <EditDynamicDataRoute
                  exact
                  path={`${match.url}/edit/:id/dynamic-data`}
                >
                  <DynamicData />
                </EditDynamicDataRoute>

                <EditGeneratePreview
                  exact
                  path={`${match.url}/edit/:id/generate-preview`}
                >
                  <GeneratePage />
                </EditGeneratePreview>

                <EditDataLoadedPath exact checkState path={`${match.url}/view`}>
                  <h1>Loaded</h1>
                </EditDataLoadedPath>

                <EditCustomerFormRoute exact path={`${match.url}/view/:id`}>
                  <CustomerData />
                </EditCustomerFormRoute>

                <EditE3TRoute exact path={`${match.url}/view/:id/e3t`}>
                  <E3T />
                </EditE3TRoute>

                <EditE3TRoute exact path={`${match.url}/view/:id/summary`}>
                  <E3TSummary />
                </EditE3TRoute>

                <EditDynamicDataRoute
                  exact
                  path={`${match.url}/view/:id/dynamic-data`}
                >
                  <DynamicData />
                </EditDynamicDataRoute>

                <EditGeneratePreview
                  exact
                  path={`${match.url}/view/:id/generate-preview`}
                >
                  <GeneratePage edit />
                </EditGeneratePreview>

                <MasterFormRoute path={`${match.url}`} exact>
                  <CustomerData />
                </MasterFormRoute>

                {/* <CustomerFormRoute
                shouldLoad
                exact
                path={`${match.url}/:id/customer-data`}
              >
                <CustomerData />
              </CustomerFormRoute> */}

                <E3TFormRoute shouldLoad exact path={`${match.url}/:id/e3t`}>
                  <E3T />
                </E3TFormRoute>

                <E3TFormRoute
                  shouldLoad
                  exact
                  path={`${match.url}/:id/summary`}
                >
                  <E3TSummary />
                </E3TFormRoute>

                <DynamicDataRoute
                  shouldLoad
                  exact
                  path={`${match.url}/:id/dynamic-data`}
                >
                  <DynamicData />
                </DynamicDataRoute>
                <DynamicDataRoute
                  shouldLoad
                  exact
                  path={`${match.url}/:id/generate-preview`}
                >
                  <GeneratePreviewPath>
                    <GeneratePage />
                  </GeneratePreviewPath>
                </DynamicDataRoute>
              </Switch>
            </div>
            <div className="empty"></div>
          </div>
        </ErrorBoundary>
      </ModeProvider>
    </Provider>
  );
};

export default SowRoutes;

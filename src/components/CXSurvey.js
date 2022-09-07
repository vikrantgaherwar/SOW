import React, { Fragment } from "react";
import TableFilter from "react-table-filter/lib/bundle";
import {} from "react-table-filter/lib/styles.css";
import Modal from "react-bootstrap/Modal";
import { CSVLink } from "react-csv";
import Cookies from "js-cookie";
import TrackingService from "./TrackingService";
class CXSurvey extends React.Component {
  constructor(props) {
    super(props);
    this.TrackingService = new TrackingService();
    this.state = {
      customerSurveyData: this.props.customerSurveyData,
      TCEcustomerSurveyData: this.props.customerSurveyData,
      NPScustomerSurveyData: this.props.customerSurveyData,
      Surveycount: Object.keys(this.props.customerSurveyData).length,
      top2: "",
      mid: "",
      bottom: "",
      promoter: "",
      neutral: "",
      detractor: "",
      overallsatisfactionsad: "",
      overallsatisfactionhappy: "",
      overallsatisfactionflat: "",
      likelihoodtorecommendsad: "",
      likelihoodtorecommendflat: "",
      likelihoodtorecommendhappy: "",
      easeofusesad: "",
      easeofuseflat: "",
      easeofusehappy: "",
      ImplementationWithinTimelinessad: "",
      ImplementationWithinTimelinesflat: "",
      ImplementationWithinTimelineshappy: "",
      SolutionQualitysad: "",
      SolutionQualityflat: "",
      SolutionQualityhappy: "",
      OverallCommunicationsad: "",
      OverallCommunicationflat: "",
      OverallCommunicationhappy: "",
      PmProfessionalismhappy: "",
      PmProfessionalismflat: "",
      PmProfessionalismsad: "",
      TechnicalExpertisesad: "",
      TechnicalExpertiseflat: "",
      TechnicalExpertisehappy: "",
      IsOverallsatisfactionHappy: false,
      overallsatisfactionhappyarr: [],
      IsOverallsatisfactionFlat: false,
      overallsatisfactionflatarr: [],
      IsOverallsatisfactionSad: false,
      overallsatisfactionsadarr: [],
      IslikelihoodtorecommendHappy: false,
      likelihoodtorecommendhappyarr: [],
      IslikelihoodtorecommendFlat: false,
      likelihoodtorecommendflatarr: [],
      IslikelihoodtorecommendSad: false,
      likelihoodtorecommendsadarr: [],
      IsEaseOfUseHappy: false,
      EaseOfUsehappyarr: [],
      IsEaseOfUseFlat: false,
      EaseOfUseflatarr: [],
      IsEaseOfUseSad: false,
      EaseOfUsesadarr: [],
      IsSolutionQualityHappy: false,
      SolutionQualityhappyarr: [],
      IsSolutionQualityFlat: false,
      SolutionQualityflatarr: [],
      IsSolutionQualitySad: false,
      SolutionQualitysadarr: [],
      IsOverallCommunicationHappy: false,
      OverallCommunicationhappyarr: [],
      IsOverallCommunicationFlat: false,
      OverallCommunicationflatarr: [],
      IsOverallCommunicationSad: false,
      OverallCommunicationsadarr: [],
      IsImplementationWithinTimelinesHappy: false,
      ImplementationWithinTimelineshappyarr: [],
      IsImplementationWithinTimelinesFlat: false,
      ImplementationWithinTimelinesflatarr: [],
      IsImplementationWithinTimelinesSad: false,
      ImplementationWithinTimelinessadarr: [],
      IsPmProfessionalismHappy: false,
      PmProfessionalismhappyarr: [],
      IsPmProfessionalismFlat: false,
      PmProfessionalismflatarr: [],
      IsPmProfessionalismSad: false,
      PmProfessionalismsadarr: [],
      IsTechnicalExpertiseHappy: false,
      TechnicalExpertisehappyarr: [],
      IsTechnicalExpertiseFlat: false,
      TechnicalExpertiseflatarr: [],
      IsTechnicalExpertiseSad: false,
      TechnicalExpertisesadarr: [],
      IsTCESurveyCount: false,
      IsNPSSurveyCount: false,
      IsNPSDetractor: false,
      IsNPSNeutral: false,
      IsNPSpromoter: false,
      IsTCETop: false,
      IsTCEMid: false,
      IsTCEBottom: false,
      activePage: 1,
      search: "",
      searchNPS: "",
      searchTCETop: "",
      searchTCEMid: "",
      searchTCEBottom: "",
      searchNPSPromoter: "",
      searchNPSNeutral: "",
      searchNPSDetractor: "",
      applySearch: false,
      tceoverallsatisfactionhappyarr: [],
      tceoverallsatisfactionflatarr: [],
      tceoverallsatisfactionsadarr: [],
      npslikelihoodtorecommendhappyarr: [],
      npslikelihoodtorecommendsadarr: [],
      npslikelihoodtorecommendflatarr: [],
    };
  }

  componentDidMount = () => {
    this.getTCESummaryboxdata();
    this.getNPSSummaryboxdata();
    this.getComponentScoredata();
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.customerSurveyData !== this.props.customerSurveyData) {
      this.setState(
        {
          customerSurveyData: this.props.customerSurveyData,
          TCEcustomerSurveyData: this.props.customerSurveyData,
          NPScustomerSurveyData: this.props.customerSurveyData,
          Surveycount: Object.keys(this.props.customerSurveyData).length,
        },
        () => {
          this.getTCESummaryboxdata();
          this.getNPSSummaryboxdata();
          this.getComponentScoredata();
        }
      );
    }
  };

  getTCESummaryboxdata = () => {
    const top2count =
      this.round(
        (this.state.customerSurveyData.filter(
          (x) => x.q1OverallSatisfaction == 9 || x.q1OverallSatisfaction == 10
        ).length /
          this.state.Surveycount) *
          100
      ) + "%";

    const midcount =
      this.round(
        (this.state.customerSurveyData.filter(
          (x) =>
            x.q1OverallSatisfaction == 5 ||
            x.q1OverallSatisfaction == 6 ||
            x.q1OverallSatisfaction == 7 ||
            x.q1OverallSatisfaction == 8
        ).length /
          this.state.Surveycount) *
          100
      ) + "%";

    const sadcount =
      this.round(
        (this.state.customerSurveyData.filter(
          (x) =>
            x.q1OverallSatisfaction == 0 ||
            x.q1OverallSatisfaction == 1 ||
            x.q1OverallSatisfaction == 2 ||
            x.q1OverallSatisfaction == 3 ||
            x.q1OverallSatisfaction == 4
        ).length /
          this.state.Surveycount) *
          100
      ) + "%";

    this.setState({ top2: top2count, mid: midcount, bottom: sadcount });
  };
  getNPSSummaryboxdata = () => {
    const top2count = this.round(
      (this.state.customerSurveyData.filter(
        (x) => x.q2LikelihoodToRecommend == 9 || x.q2LikelihoodToRecommend == 10
      ).length /
        this.state.Surveycount) *
        100
    );

    const midcount = this.round(
      (this.state.customerSurveyData.filter(
        (x) =>
          x.q2LikelihoodToRecommend == 5 ||
          x.q2LikelihoodToRecommend == 6 ||
          x.q2LikelihoodToRecommend == 7 ||
          x.q2LikelihoodToRecommend == 8
      ).length /
        this.state.Surveycount) *
        100
    );

    const sadcount = this.round(
      (this.state.customerSurveyData.filter(
        (x) =>
          x.q2LikelihoodToRecommend == 0 ||
          x.q2LikelihoodToRecommend == 1 ||
          x.q2LikelihoodToRecommend == 2 ||
          x.q2LikelihoodToRecommend == 3 ||
          x.q2LikelihoodToRecommend == 4
      ).length /
        this.state.Surveycount) *
        100
    );

    this.setState({
      promoter: top2count,
      neutral: midcount,
      detractor: sadcount,
    });
  };
  getComponentScoredata = () => {
    const overallsatisfactionhappy = this.state.customerSurveyData.filter(
      (x) => x.q1OverallSatisfaction == 9 || x.q1OverallSatisfaction == 10
    ).length;

    const overallsatisfactionflat = this.state.customerSurveyData.filter(
      (x) =>
        x.q1OverallSatisfaction == 5 ||
        x.q1OverallSatisfaction == 6 ||
        x.q1OverallSatisfaction == 7 ||
        x.q1OverallSatisfaction == 8
    ).length;

    const overallsatisfactionsad = this.state.customerSurveyData.filter(
      (x) =>
        x.q1OverallSatisfaction == 0 ||
        x.q1OverallSatisfaction == 1 ||
        x.q1OverallSatisfaction == 2 ||
        x.q1OverallSatisfaction == 3 ||
        x.q1OverallSatisfaction == 4
    ).length;

    const likelihoodtorecommendhappy = this.state.customerSurveyData.filter(
      (x) => x.q2LikelihoodToRecommend == 9 || x.q2LikelihoodToRecommend == 10
    ).length;

    const likelihoodtorecommendflat = this.state.customerSurveyData.filter(
      (x) =>
        x.q2LikelihoodToRecommend == 5 ||
        x.q2LikelihoodToRecommend == 6 ||
        x.q2LikelihoodToRecommend == 7 ||
        x.q2LikelihoodToRecommend == 8
    ).length;

    const likelihoodtorecommendsad = this.state.customerSurveyData.filter(
      (x) =>
        x.q2LikelihoodToRecommend == 0 ||
        x.q2LikelihoodToRecommend == 1 ||
        x.q2LikelihoodToRecommend == 2 ||
        x.q2LikelihoodToRecommend == 3 ||
        x.q2LikelihoodToRecommend == 4
    ).length;

    const easeofusehappy = this.state.customerSurveyData.filter(
      (x) => x.q3EaseOfUse == 9 || x.q3EaseOfUse == 10
    ).length;

    const easeofuseflat = this.state.customerSurveyData.filter(
      (x) =>
        x.q3EaseOfUse == 5 ||
        x.q3EaseOfUse == 6 ||
        x.q3EaseOfUse == 7 ||
        x.q3EaseOfUse == 8
    ).length;

    const easeofusesad = this.state.customerSurveyData.filter(
      (x) =>
        x.q3EaseOfUse == 0 ||
        x.q3EaseOfUse == 1 ||
        x.q3EaseOfUse == 2 ||
        x.q3EaseOfUse == 3 ||
        x.q3EaseOfUse == 4
    ).length;

    const ImplementationWithinTimelineshappy =
      this.state.customerSurveyData.filter(
        (x) =>
          x.q4ImplementationWithinTimelines == 9 ||
          x.q4ImplementationWithinTimelines == 10
      ).length;

    const ImplementationWithinTimelinesflat =
      this.state.customerSurveyData.filter(
        (x) =>
          x.q4ImplementationWithinTimelines == 5 ||
          x.q4ImplementationWithinTimelines == 6 ||
          x.q4ImplementationWithinTimelines == 7 ||
          x.q4ImplementationWithinTimelines == 8
      ).length;

    const ImplementationWithinTimelinessad =
      this.state.customerSurveyData.filter(
        (x) =>
          x.q4ImplementationWithinTimelines == 0 ||
          x.q4ImplementationWithinTimelines == 1 ||
          x.q4ImplementationWithinTimelines == 2 ||
          x.q4ImplementationWithinTimelines == 3 ||
          x.q4ImplementationWithinTimelines == 4
      ).length;

    const SolutionQualityhappy = this.state.customerSurveyData.filter(
      (x) => x.q5SolutionQuality == 9 || x.q5SolutionQuality == 10
    ).length;

    const SolutionQualityflat = this.state.customerSurveyData.filter(
      (x) =>
        x.q5SolutionQuality == 5 ||
        x.q5SolutionQuality == 6 ||
        x.q5SolutionQuality == 7 ||
        x.q5SolutionQuality == 8
    ).length;

    const SolutionQualitysad = this.state.customerSurveyData.filter(
      (x) =>
        x.q5SolutionQuality == 0 ||
        x.q5SolutionQuality == 1 ||
        x.q5SolutionQuality == 2 ||
        x.q5SolutionQuality == 3 ||
        x.q5SolutionQuality == 4
    ).length;

    const OverallCommunicationhappy = this.state.customerSurveyData.filter(
      (x) => x.q6OverallCommunication == 9 || x.q6OverallCommunication == 10
    ).length;

    const OverallCommunicationflat = this.state.customerSurveyData.filter(
      (x) =>
        x.q6OverallCommunication == 5 ||
        x.q6OverallCommunication == 6 ||
        x.q6OverallCommunication == 7 ||
        x.q6OverallCommunication == 8
    ).length;

    const OverallCommunicationsad = this.state.customerSurveyData.filter(
      (x) =>
        x.q6OverallCommunication == 0 ||
        x.q6OverallCommunication == 1 ||
        x.q6OverallCommunication == 2 ||
        x.q6OverallCommunication == 3 ||
        x.q6OverallCommunication == 4
    ).length;

    const PmProfessionalismhappy = this.state.customerSurveyData.filter(
      (x) => x.q7PmProfessionalism == 9 || x.q7PmProfessionalism == 10
    ).length;

    const PmProfessionalismflat = this.state.customerSurveyData.filter(
      (x) =>
        x.q7PmProfessionalism == 5 ||
        x.q7PmProfessionalism == 6 ||
        x.q7PmProfessionalism == 7 ||
        x.q7PmProfessionalism == 8
    ).length;

    const PmProfessionalismsad = this.state.customerSurveyData.filter(
      (x) =>
        x.q7PmProfessionalism == 0 ||
        x.q7PmProfessionalism == 1 ||
        x.q7PmProfessionalism == 2 ||
        x.q7PmProfessionalism == 3 ||
        x.q7PmProfessionalism == 4
    ).length;

    const TechnicalExpertisehappy = this.state.customerSurveyData.filter(
      (x) => x.q8TechnicalExpertise == 9 || x.q8TechnicalExpertise == 10
    ).length;

    const TechnicalExpertiseflat = this.state.customerSurveyData.filter(
      (x) =>
        x.q8TechnicalExpertise == 5 ||
        x.q8TechnicalExpertise == 6 ||
        x.q8TechnicalExpertise == 7 ||
        x.q8TechnicalExpertise == 8
    ).length;

    const TechnicalExpertisesad = this.state.customerSurveyData.filter(
      (x) =>
        x.q8TechnicalExpertise == 0 ||
        x.q8TechnicalExpertise == 1 ||
        x.q8TechnicalExpertise == 2 ||
        x.q8TechnicalExpertise == 3 ||
        x.q8TechnicalExpertise == 4
    ).length;

    this.setState({
      overallsatisfactionhappy: overallsatisfactionhappy,
      overallsatisfactionflat: overallsatisfactionflat,
      overallsatisfactionsad: overallsatisfactionsad,
      likelihoodtorecommendhappy: likelihoodtorecommendhappy,
      likelihoodtorecommendflat: likelihoodtorecommendflat,
      likelihoodtorecommendsad: likelihoodtorecommendsad,
      easeofusehappy: easeofusehappy,
      easeofuseflat: easeofuseflat,
      easeofusesad: easeofusesad,
      ImplementationWithinTimelineshappy: ImplementationWithinTimelineshappy,
      ImplementationWithinTimelinesflat: ImplementationWithinTimelinesflat,
      ImplementationWithinTimelinessad: ImplementationWithinTimelinessad,
      SolutionQualityhappy: SolutionQualityhappy,
      SolutionQualityflat: SolutionQualityflat,
      SolutionQualitysad: SolutionQualitysad,
      OverallCommunicationhappy: OverallCommunicationhappy,
      OverallCommunicationflat: OverallCommunicationflat,
      OverallCommunicationsad: OverallCommunicationsad,
      PmProfessionalismhappy: PmProfessionalismhappy,
      PmProfessionalismflat: PmProfessionalismflat,
      PmProfessionalismsad: PmProfessionalismsad,
      TechnicalExpertisehappy: TechnicalExpertisehappy,
      TechnicalExpertiseflat: TechnicalExpertiseflat,
      TechnicalExpertisesad: TechnicalExpertisesad,
    });
  };
  overallsatisfactionhappy = () => {
    const resultant = this.state.customerSurveyData.filter(
      (x) => x.q1OverallSatisfaction == 9 || x.q1OverallSatisfaction == 10
    );
    this.setState({
      overallsatisfactionhappyarr: resultant,
      tceoverallsatisfactionhappyarr: resultant,
    });
  };
  overallsatisfactionflat = () => {
    const resultant = this.state.customerSurveyData.filter(
      (x) =>
        x.q1OverallSatisfaction == 5 ||
        x.q1OverallSatisfaction == 6 ||
        x.q1OverallSatisfaction == 7 ||
        x.q1OverallSatisfaction == 8
    );
    this.setState({
      overallsatisfactionflatarr: resultant,
      tceoverallsatisfactionflatarr: resultant,
    });
  };
  overallsatisfactionsad = () => {
    const resultant = this.state.customerSurveyData.filter(
      (x) =>
        x.q1OverallSatisfaction == 0 ||
        x.q1OverallSatisfaction == 1 ||
        x.q1OverallSatisfaction == 2 ||
        x.q1OverallSatisfaction == 3 ||
        x.q1OverallSatisfaction == 4
    );
    this.setState({
      overallsatisfactionsadarr: resultant,
      tceoverallsatisfactionsadarr: resultant,
    });
  };
  _filterUpdatedoverallsatisfactionhappy = (newData, filtersObject) => {
    this.setState({
      overallsatisfactionhappyarr: newData,
      tceoverallsatisfactionhappyarr: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  _filterUpdatedoverallsatisfactionflat = (newData, filtersObject) => {
    this.setState({
      overallsatisfactionflatarr: newData,
      tceoverallsatisfactionflatarr: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  _filterUpdatedoverallsatisfactionsad = (newData, filtersObject) => {
    this.setState({
      overallsatisfactionsadarr: newData,
      tceoverallsatisfactionsadarr: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  likelihoodtorecommendhappy = () => {
    const resultant = this.state.customerSurveyData.filter(
      (x) => x.q2LikelihoodToRecommend == 9 || x.q2LikelihoodToRecommend == 10
    );
    this.setState({
      likelihoodtorecommendhappyarr: resultant,
      npslikelihoodtorecommendhappyarr: resultant,
    });
  };
  likelihoodtorecommendflat = () => {
    const resultant = this.state.customerSurveyData.filter(
      (x) =>
        x.q2LikelihoodToRecommend == 5 ||
        x.q2LikelihoodToRecommend == 6 ||
        x.q2LikelihoodToRecommend == 7 ||
        x.q2LikelihoodToRecommend == 8
    );
    this.setState({
      likelihoodtorecommendflatarr: resultant,
      npslikelihoodtorecommendflatarr: resultant,
    });
  };
  likelihoodtorecommendsad = () => {
    const resultant = this.state.customerSurveyData.filter(
      (x) =>
        x.q2LikelihoodToRecommend == 0 ||
        x.q2LikelihoodToRecommend == 1 ||
        x.q2LikelihoodToRecommend == 2 ||
        x.q2LikelihoodToRecommend == 3 ||
        x.q2LikelihoodToRecommend == 4
    );
    this.setState({
      likelihoodtorecommendsadarr: resultant,
      npslikelihoodtorecommendsadarr: resultant,
    });
  };
  _filterUpdatedlikelihoodtorecommendhappy = (newData, filtersObject) => {
    this.setState({
      likelihoodtorecommendhappyarr: newData,
      npslikelihoodtorecommendhappyarr: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  _filterUpdatedlikelihoodtorecommendflat = (newData, filtersObject) => {
    this.setState({
      likelihoodtorecommendflatarr: newData,
      npslikelihoodtorecommendflatarr: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  _filterUpdatedlikelihoodtorecommendsad = (newData, filtersObject) => {
    this.setState({
      likelihoodtorecommendsadarr: newData,
      npslikelihoodtorecommendsadarr: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  EaseOfUsehappy = () => {
    const resultant = this.state.customerSurveyData.filter(
      (x) => x.q3EaseOfUse == 9 || x.q3EaseOfUse == 10
    );
    this.setState({ EaseOfUsehappyarr: resultant });
  };
  EaseOfUseflat = () => {
    const resultant = this.state.customerSurveyData.filter(
      (x) =>
        x.q3EaseOfUse == 5 ||
        x.q3EaseOfUse == 6 ||
        x.q3EaseOfUse == 7 ||
        x.q3EaseOfUse == 8
    );
    this.setState({ EaseOfUseflatarr: resultant });
  };
  EaseOfUsesad = () => {
    const resultant = this.state.customerSurveyData.filter(
      (x) =>
        x.q3EaseOfUse == 0 ||
        x.q3EaseOfUse == 1 ||
        x.q3EaseOfUse == 2 ||
        x.q3EaseOfUse == 3 ||
        x.q3EaseOfUse == 4
    );
    this.setState({ EaseOfUsesadarr: resultant });
  };
  _filterUpdatedeaseofusehappy = (newData, filtersObject) => {
    this.setState({
      EaseOfUsehappyarr: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  _filterUpdatedeaseofuseflat = (newData, filtersObject) => {
    this.setState({
      EaseOfUseflatarr: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  _filterUpdatedeaseofusesad = (newData, filtersObject) => {
    this.setState({
      EaseOfUsesadarr: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  SolutionQualityhappy = () => {
    const resultant = this.state.customerSurveyData.filter(
      (x) => x.q5SolutionQuality == 9 || x.q5SolutionQuality == 10
    );
    this.setState({ SolutionQualityhappyarr: resultant });
  };
  SolutionQualityflat = () => {
    const resultant = this.state.customerSurveyData.filter(
      (x) =>
        x.q5SolutionQuality == 5 ||
        x.q5SolutionQuality == 6 ||
        x.q5SolutionQuality == 7 ||
        x.q5SolutionQuality == 8
    );
    this.setState({ SolutionQualityflatarr: resultant });
  };
  SolutionQualitysad = () => {
    const resultant = this.state.customerSurveyData.filter(
      (x) =>
        x.q5SolutionQuality == 0 ||
        x.q5SolutionQuality == 1 ||
        x.q5SolutionQuality == 2 ||
        x.q5SolutionQuality == 3 ||
        x.q5SolutionQuality == 4
    );
    this.setState({ SolutionQualitysadarr: resultant });
  };
  _filterUpdatedSolutionQualityhappy = (newData, filtersObject) => {
    this.setState({
      SolutionQualityhappyarr: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  _filterUpdatedSolutionQualityflat = (newData, filtersObject) => {
    this.setState({
      SolutionQualityflatarr: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  _filterUpdatedSolutionQualitysad = (newData, filtersObject) => {
    this.setState({
      SolutionQualitysadarr: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  OverallCommunicationhappy = () => {
    const resultant = this.state.customerSurveyData.filter(
      (x) => x.q6OverallCommunication == 9 || x.q6OverallCommunication == 10
    );
    this.setState({ OverallCommunicationhappyarr: resultant });
  };
  OverallCommunicationflat = () => {
    const resultant = this.state.customerSurveyData.filter(
      (x) =>
        x.q6OverallCommunication == 5 ||
        x.q6OverallCommunication == 6 ||
        x.q6OverallCommunication == 7 ||
        x.q6OverallCommunication == 8
    );
    this.setState({ OverallCommunicationflatarr: resultant });
  };
  OverallCommunicationsad = () => {
    const resultant = this.state.customerSurveyData.filter(
      (x) =>
        x.q6OverallCommunication == 0 ||
        x.q6OverallCommunication == 1 ||
        x.q6OverallCommunication == 2 ||
        x.q6OverallCommunication == 3 ||
        x.q6OverallCommunication == 4
    );
    this.setState({ OverallCommunicationsadarr: resultant });
  };
  _filterUpdatedOverallCommunicationhappy = (newData, filtersObject) => {
    this.setState({
      OverallCommunicationhappyarr: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  _filterUpdatedOverallCommunicationflat = (newData, filtersObject) => {
    this.setState({
      OverallCommunicationflatarr: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  _filterUpdatedOverallCommunicationsad = (newData, filtersObject) => {
    this.setState({
      OverallCommunicationsadarr: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  ImplementationWithinTimelineshappy = () => {
    const resultant = this.state.customerSurveyData.filter(
      (x) =>
        x.q4ImplementationWithinTimelines == 9 ||
        x.q4ImplementationWithinTimelines == 10
    );
    this.setState({ ImplementationWithinTimelineshappyarr: resultant });
  };
  ImplementationWithinTimelinesflat = () => {
    const resultant = this.state.customerSurveyData.filter(
      (x) =>
        x.q4ImplementationWithinTimelines == 5 ||
        x.q4ImplementationWithinTimelines == 6 ||
        x.q4ImplementationWithinTimelines == 7 ||
        x.q4ImplementationWithinTimelines == 8
    );
    this.setState({ ImplementationWithinTimelinesflatarr: resultant });
  };
  ImplementationWithinTimelinessad = () => {
    const resultant = this.state.customerSurveyData.filter(
      (x) =>
        x.q4ImplementationWithinTimelines == 0 ||
        x.q4ImplementationWithinTimelines == 1 ||
        x.q4ImplementationWithinTimelines == 2 ||
        x.q4ImplementationWithinTimelines == 3 ||
        x.q4ImplementationWithinTimelines == 4
    );
    this.setState({ ImplementationWithinTimelinessadarr: resultant });
  };
  _filterUpdatedImplementationWithinTimelineshappy = (
    newData,
    filtersObject
  ) => {
    this.setState({
      ImplementationWithinTimelineshappyarr: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  _filterUpdatedImplementationWithinTimelinesflat = (
    newData,
    filtersObject
  ) => {
    this.setState({
      ImplementationWithinTimelinesflatarr: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  _filterUpdatedImplementationWithinTimelinessad = (newData, filtersObject) => {
    this.setState({
      ImplementationWithinTimelinessadarr: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  PmProfessionalismhappy = () => {
    const resultant = this.state.customerSurveyData.filter(
      (x) => x.q7PmProfessionalism == 9 || x.q7PmProfessionalism == 10
    );
    this.setState({ PmProfessionalismhappyarr: resultant });
  };
  PmProfessionalismflat = () => {
    const resultant = this.state.customerSurveyData.filter(
      (x) =>
        x.q7PmProfessionalism == 5 ||
        x.q7PmProfessionalism == 6 ||
        x.q7PmProfessionalism == 7 ||
        x.q7PmProfessionalism == 8
    );
    this.setState({ PmProfessionalismflatarr: resultant });
  };
  PmProfessionalismsad = () => {
    const resultant = this.state.customerSurveyData.filter(
      (x) =>
        x.q7PmProfessionalism == 0 ||
        x.q7PmProfessionalism == 1 ||
        x.q7PmProfessionalism == 2 ||
        x.q7PmProfessionalism == 3 ||
        x.q7PmProfessionalism == 4
    );
    this.setState({ PmProfessionalismsadarr: resultant });
  };
  _filterUpdatedPmProfessionalismhappy = (newData, filtersObject) => {
    this.setState({
      PmProfessionalismhappyarr: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  _filterUpdatedPmProfessionalismflat = (newData, filtersObject) => {
    this.setState({
      PmProfessionalismflatarr: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  _filterUpdatedPmProfessionalismsad = (newData, filtersObject) => {
    this.setState({
      PmProfessionalismsadarr: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  TechnicalExpertisehappy = () => {
    const resultant = this.state.customerSurveyData.filter(
      (x) => x.q8TechnicalExpertise == 9 || x.q8TechnicalExpertise == 10
    );
    this.setState({ TechnicalExpertisehappyarr: resultant });
  };
  TechnicalExpertiseflat = () => {
    const resultant = this.state.customerSurveyData.filter(
      (x) =>
        x.q8TechnicalExpertise == 5 ||
        x.q8TechnicalExpertise == 6 ||
        x.q8TechnicalExpertise == 7 ||
        x.q8TechnicalExpertise == 8
    );
    this.setState({ TechnicalExpertiseflatarr: resultant });
  };
  TechnicalExpertisesad = () => {
    const resultant = this.state.customerSurveyData.filter(
      (x) =>
        x.q8TechnicalExpertise == 0 ||
        x.q8TechnicalExpertise == 1 ||
        x.q8TechnicalExpertise == 2 ||
        x.q8TechnicalExpertise == 3 ||
        x.q8TechnicalExpertise == 4
    );
    this.setState({ TechnicalExpertisesadarr: resultant });
  };
  _filterUpdatedTechnicalExpertisehappy = (newData, filtersObject) => {
    this.setState({
      TechnicalExpertisehappyarr: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  _filterUpdatedTechnicalExpertiseflat = (newData, filtersObject) => {
    this.setState({
      TechnicalExpertiseflatarr: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  _filterUpdatedTechnicalExpertisesad = (newData, filtersObject) => {
    this.setState({
      TechnicalExpertisesadarr: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  _filterUpdatedTCESurveyData = (newData, filtersObject) => {
    this.setState({
      TCEcustomerSurveyData: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  _filterUpdatedNPSSurveyData = (newData, filtersObject) => {
    this.setState({
      NPScustomerSurveyData: newData,
      totalItemsCount: newData.length,
      activePage: 1,
    });
  };
  updateSearch(event) {
    this.setState(
      { search: event.target.value, activePage: 1, applySearch: true },
      () => this.dosearch()
    );
    if (event.target.value.length === 0) {
      this.setState({
        applySearch: false,
        TCEcustomerSurveyData: this.props.customerSurveyData,
      });
    }
  }
  updateNPSSearch(event) {
    this.setState({ searchNPS: event.target.value, activePage: 1 }, () =>
      this.doNPSsearch()
    );
    if (event.target.value.length === 0) {
      this.setState({ NPScustomerSurveyData: this.props.customerSurveyData });
    }
  }
  updateTCETopSearch(event) {
    this.setState({ searchTCETop: event.target.value, activePage: 1 }, () =>
      this.doTCETopsearch()
    );
    if (event.target.value.length === 0) {
      this.setState({
        tceoverallsatisfactionhappyarr: this.state.overallsatisfactionhappyarr,
      });
    }
  }
  updateTCEMidSearch(event) {
    this.setState({ searchTCEMid: event.target.value, activePage: 1 }, () =>
      this.doTCEMidsearch()
    );
    if (event.target.value.length === 0) {
      this.setState({
        tceoverallsatisfactionflatarr: this.state.overallsatisfactionflatarr,
      });
    }
  }
  updateTCEBottomSearch(event) {
    this.setState({ searchTCEBottom: event.target.value, activePage: 1 }, () =>
      this.doTCEBottomsearch()
    );
    if (event.target.value.length === 0) {
      this.setState({
        tceoverallsatisfactionsadarr: this.state.overallsatisfactionsadarr,
      });
    }
  }
  dosearch = () => {
    const result = this.props.customerSurveyData.filter((list) => {
      return (
        list.fy.toLowerCase().indexOf(this.state.search) != -1 ||
        list.q.toLowerCase().indexOf(this.state.search.toLowerCase()) != -1 ||
        list.wbs.toLowerCase().indexOf(this.state.search.toLowerCase()) != -1 ||
        list.sfdcid.toLowerCase().indexOf(this.state.search.toLowerCase()) !=
          -1 ||
        list.accountStName
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) != -1 ||
        list.accountStId.toLowerCase().indexOf(this.state.search) != -1 ||
        list.ppmcRequestNo
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) != -1 ||
        list.status.toLowerCase().indexOf(this.state.search.toLowerCase()) !=
          -1 ||
        list.statusDate
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) != -1 ||
        list.createdOn.toLowerCase().indexOf(this.state.search.toLowerCase()) !=
          -1 ||
        list.projectName
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) != -1 ||
        list.projectDescription
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) != -1 ||
        list.serviceLine
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) != -1 ||
        list.geoFy19.toLowerCase().indexOf(this.state.search.toLowerCase()) !=
          -1 ||
        list.geoFy20.toLowerCase().indexOf(this.state.search.toLowerCase()) !=
          -1 ||
        list.country.toLowerCase().indexOf(this.state.search.toLowerCase()) !=
          -1 ||
        list.leadPm.toLowerCase().indexOf(this.state.search.toLowerCase()) !=
          -1 ||
        list.pmEmail.toLowerCase().indexOf(this.state.search.toLowerCase()) !=
          -1 ||
        list.pmoLead.toLowerCase().indexOf(this.state.search.toLowerCase()) !=
          -1 ||
        list.pmoEmail.toLowerCase().indexOf(this.state.search.toLowerCase()) !=
          -1 ||
        list.customerName
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) != -1 ||
        list.reasonForNoSurvey
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) != -1 ||
        list.customerProjectName
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) != -1 ||
        list.customerContactNames
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) != -1 ||
        list.customerContactEmail
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) != -1 ||
        list.customerLanguage
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) != -1 ||
        list.mostRecentNote
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) != -1 ||
        list.q1OverallSatisfaction.toLowerCase().indexOf(this.state.search) !=
          -1 ||
        list.q1aOverallSatisfactionComments
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) != -1 ||
        list.q1aWhatDidYouAppreciateTheMostComments910
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) != -1 ||
        list.q1bWhatCouldHaveBeenDoneBetterComments08
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) != -1 ||
        list.q2LikelihoodToRecommend.toLowerCase().indexOf(this.state.search) !=
          -1 ||
        list.q2aRecommendComments
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) != -1 ||
        list.q3EaseOfUse.toLowerCase().indexOf(this.state.search) != -1 ||
        list.q3aEaseOfUseComments
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) != -1 ||
        list.q4ImplementationWithinTimelines
          .toLowerCase()
          .indexOf(this.state.search) != -1 ||
        list.q5SolutionQuality.toLowerCase().indexOf(this.state.search) != -1 ||
        list.q6OverallCommunication.toLowerCase().indexOf(this.state.search) !=
          -1 ||
        list.q7PmProfessionalism.toLowerCase().indexOf(this.state.search) !=
          -1 ||
        list.q8TechnicalExpertise.toLowerCase().indexOf(this.state.search) !=
          -1 ||
        list.commentsQ4Q8
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) != -1 ||
        list.csat.toLowerCase().indexOf(this.state.search) != -1 ||
        list.dsat.toLowerCase().indexOf(this.state.search) != -1 ||
        list.npsLabel.toLowerCase().indexOf(this.state.search.toLowerCase()) !=
          -1 ||
        list.npsScore.toLowerCase().indexOf(this.state.search) != -1 ||
        list.ces.toLowerCase().indexOf(this.state.search) != -1 ||
        list.clcaStatus
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) != -1 ||
        list.clcaStatusDate.toLowerCase().indexOf(this.state.search) != -1 ||
        list.orcSurveyId
          .toLowerCase()
          .indexOf(this.state.search.toLowerCase()) != -1
      );
    });
    this.setState({ TCEcustomerSurveyData: result });
  };
  doNPSsearch = () => {
    const npsresult = this.props.customerSurveyData.filter((list) => {
      return (
        list.fy.toLowerCase().indexOf(this.state.searchNPS) != -1 ||
        list.q.toLowerCase().indexOf(this.state.searchNPS.toLowerCase()) !=
          -1 ||
        list.wbs.toLowerCase().indexOf(this.state.searchNPS.toLowerCase()) !=
          -1 ||
        list.sfdcid.toLowerCase().indexOf(this.state.searchNPS.toLowerCase()) !=
          -1 ||
        list.accountStName
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.accountStId.toLowerCase().indexOf(this.state.searchNPS) != -1 ||
        list.ppmcRequestNo
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.status.toLowerCase().indexOf(this.state.searchNPS.toLowerCase()) !=
          -1 ||
        list.statusDate
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.createdOn
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.projectName
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.projectDescription
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.serviceLine
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.geoFy19
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.geoFy20
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.country
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.leadPm.toLowerCase().indexOf(this.state.searchNPS.toLowerCase()) !=
          -1 ||
        list.pmEmail
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.pmoLead
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.pmoEmail
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.customerName
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.reasonForNoSurvey
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.customerProjectName
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.customerContactNames
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.customerContactEmail
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.customerLanguage
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.mostRecentNote
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.q1OverallSatisfaction
          .toLowerCase()
          .indexOf(this.state.searchNPS) != -1 ||
        list.q1aOverallSatisfactionComments
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.q1aWhatDidYouAppreciateTheMostComments910
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.q1bWhatCouldHaveBeenDoneBetterComments08
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.q2LikelihoodToRecommend
          .toLowerCase()
          .indexOf(this.state.searchNPS) != -1 ||
        list.q2aRecommendComments
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.q3EaseOfUse.toLowerCase().indexOf(this.state.searchNPS) != -1 ||
        list.q3aEaseOfUseComments
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.q4ImplementationWithinTimelines
          .toLowerCase()
          .indexOf(this.state.searchNPS) != -1 ||
        list.q5SolutionQuality.toLowerCase().indexOf(this.state.searchNPS) !=
          -1 ||
        list.q6OverallCommunication
          .toLowerCase()
          .indexOf(this.state.searchNPS) != -1 ||
        list.q7PmProfessionalism.toLowerCase().indexOf(this.state.searchNPS) !=
          -1 ||
        list.q8TechnicalExpertise.toLowerCase().indexOf(this.state.searchNPS) !=
          -1 ||
        list.commentsQ4Q8
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.csat.toLowerCase().indexOf(this.state.searchNPS) != -1 ||
        list.dsat.toLowerCase().indexOf(this.state.searchNPS) != -1 ||
        list.npsLabel
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.npsScore.toLowerCase().indexOf(this.state.searchNPS) != -1 ||
        list.ces.toLowerCase().indexOf(this.state.searchNPS) != -1 ||
        list.clcaStatus
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1 ||
        list.clcaStatusDate.toLowerCase().indexOf(this.state.searchNPS) != -1 ||
        list.orcSurveyId
          .toLowerCase()
          .indexOf(this.state.searchNPS.toLowerCase()) != -1
      );
    });
    this.setState({ NPScustomerSurveyData: npsresult });
  };
  doTCETopsearch = () => {
    const npsresult = this.state.overallsatisfactionhappyarr.filter((list) => {
      return (
        list.fy.toLowerCase().indexOf(this.state.searchTCETop) != -1 ||
        list.q.toLowerCase().indexOf(this.state.searchTCETop.toLowerCase()) !=
          -1 ||
        list.wbs.toLowerCase().indexOf(this.state.searchTCETop.toLowerCase()) !=
          -1 ||
        list.sfdcid
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.accountStName
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.accountStId.toLowerCase().indexOf(this.state.searchTCETop) != -1 ||
        list.ppmcRequestNo
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.status
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.statusDate
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.createdOn
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.projectName
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.projectDescription
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.serviceLine
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.geoFy19
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.geoFy20
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.country
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.leadPm
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.pmEmail
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.pmoLead
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.pmoEmail
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.customerName
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.reasonForNoSurvey
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.customerProjectName
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.customerContactNames
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.customerContactEmail
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.customerLanguage
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.mostRecentNote
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.q1OverallSatisfaction
          .toLowerCase()
          .indexOf(this.state.searchTCETop) != -1 ||
        list.q1aOverallSatisfactionComments
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.q1aWhatDidYouAppreciateTheMostComments910
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.q1bWhatCouldHaveBeenDoneBetterComments08
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.q2LikelihoodToRecommend
          .toLowerCase()
          .indexOf(this.state.searchTCETop) != -1 ||
        list.q2aRecommendComments
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.q3EaseOfUse.toLowerCase().indexOf(this.state.searchTCETop) != -1 ||
        list.q3aEaseOfUseComments
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.q4ImplementationWithinTimelines
          .toLowerCase()
          .indexOf(this.state.searchTCETop) != -1 ||
        list.q5SolutionQuality.toLowerCase().indexOf(this.state.searchTCETop) !=
          -1 ||
        list.q6OverallCommunication
          .toLowerCase()
          .indexOf(this.state.searchTCETop) != -1 ||
        list.q7PmProfessionalism
          .toLowerCase()
          .indexOf(this.state.searchTCETop) != -1 ||
        list.q8TechnicalExpertise
          .toLowerCase()
          .indexOf(this.state.searchTCETop) != -1 ||
        list.commentsQ4Q8
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.csat.toLowerCase().indexOf(this.state.searchTCETop) != -1 ||
        list.dsat.toLowerCase().indexOf(this.state.searchTCETop) != -1 ||
        list.npsLabel
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.npsScore.toLowerCase().indexOf(this.state.searchTCETop) != -1 ||
        list.ces.toLowerCase().indexOf(this.state.searchTCETop) != -1 ||
        list.clcaStatus
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1 ||
        list.clcaStatusDate.toLowerCase().indexOf(this.state.searchTCETop) !=
          -1 ||
        list.orcSurveyId
          .toLowerCase()
          .indexOf(this.state.searchTCETop.toLowerCase()) != -1
      );
    });
    this.setState({ tceoverallsatisfactionhappyarr: npsresult });
  };
  doTCEMidsearch = () => {
    const npsresult = this.state.overallsatisfactionflatarr.filter((list) => {
      return (
        list.fy.toLowerCase().indexOf(this.state.searchTCEMid) != -1 ||
        list.q.toLowerCase().indexOf(this.state.searchTCEMid.toLowerCase()) !=
          -1 ||
        list.wbs.toLowerCase().indexOf(this.state.searchTCEMid.toLowerCase()) !=
          -1 ||
        list.sfdcid
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.accountStName
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.accountStId.toLowerCase().indexOf(this.state.searchTCEMid) != -1 ||
        list.ppmcRequestNo
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.status
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.statusDate
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.createdOn
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.projectName
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.projectDescription
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.serviceLine
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.geoFy19
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.geoFy20
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.country
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.leadPm
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.pmEmail
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.pmoLead
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.pmoEmail
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.customerName
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.reasonForNoSurvey
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.customerProjectName
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.customerContactNames
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.customerContactEmail
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.customerLanguage
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.mostRecentNote
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.q1OverallSatisfaction
          .toLowerCase()
          .indexOf(this.state.searchTCEMid) != -1 ||
        list.q1aOverallSatisfactionComments
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.q1aWhatDidYouAppreciateTheMostComments910
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.q1bWhatCouldHaveBeenDoneBetterComments08
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.q2LikelihoodToRecommend
          .toLowerCase()
          .indexOf(this.state.searchTCEMid) != -1 ||
        list.q2aRecommendComments
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.q3EaseOfUse.toLowerCase().indexOf(this.state.searchTCEMid) != -1 ||
        list.q3aEaseOfUseComments
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.q4ImplementationWithinTimelines
          .toLowerCase()
          .indexOf(this.state.searchTCEMid) != -1 ||
        list.q5SolutionQuality.toLowerCase().indexOf(this.state.searchTCEMid) !=
          -1 ||
        list.q6OverallCommunication
          .toLowerCase()
          .indexOf(this.state.searchTCEMid) != -1 ||
        list.q7PmProfessionalism
          .toLowerCase()
          .indexOf(this.state.searchTCEMid) != -1 ||
        list.q8TechnicalExpertise
          .toLowerCase()
          .indexOf(this.state.searchTCEMid) != -1 ||
        list.commentsQ4Q8
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.csat.toLowerCase().indexOf(this.state.searchTCEMid) != -1 ||
        list.dsat.toLowerCase().indexOf(this.state.searchTCEMid) != -1 ||
        list.npsLabel
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.npsScore.toLowerCase().indexOf(this.state.searchTCEMid) != -1 ||
        list.ces.toLowerCase().indexOf(this.state.searchTCEMid) != -1 ||
        list.clcaStatus
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1 ||
        list.clcaStatusDate.toLowerCase().indexOf(this.state.searchTCEMid) !=
          -1 ||
        list.orcSurveyId
          .toLowerCase()
          .indexOf(this.state.searchTCEMid.toLowerCase()) != -1
      );
    });
    this.setState({ tceoverallsatisfactionflatarr: npsresult });
  };
  doTCEBottomsearch = () => {
    const npsresult = this.state.overallsatisfactionsadarr.filter((list) => {
      return (
        list.fy.toLowerCase().indexOf(this.state.searchTCEBottom) != -1 ||
        list.q
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.wbs
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.sfdcid
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.accountStName
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.accountStId.toLowerCase().indexOf(this.state.searchTCEBottom) !=
          -1 ||
        list.ppmcRequestNo
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.status
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.statusDate
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.createdOn
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.projectName
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.projectDescription
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.serviceLine
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.geoFy19
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.geoFy20
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.country
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.leadPm
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.pmEmail
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.pmoLead
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.pmoEmail
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.customerName
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.reasonForNoSurvey
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.customerProjectName
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.customerContactNames
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.customerContactEmail
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.customerLanguage
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.mostRecentNote
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.q1OverallSatisfaction
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom) != -1 ||
        list.q1aOverallSatisfactionComments
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.q1aWhatDidYouAppreciateTheMostComments910
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.q1bWhatCouldHaveBeenDoneBetterComments08
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.q2LikelihoodToRecommend
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom) != -1 ||
        list.q2aRecommendComments
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.q3EaseOfUse.toLowerCase().indexOf(this.state.searchTCEBottom) !=
          -1 ||
        list.q3aEaseOfUseComments
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.q4ImplementationWithinTimelines
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom) != -1 ||
        list.q5SolutionQuality
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom) != -1 ||
        list.q6OverallCommunication
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom) != -1 ||
        list.q7PmProfessionalism
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom) != -1 ||
        list.q8TechnicalExpertise
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom) != -1 ||
        list.commentsQ4Q8
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.csat.toLowerCase().indexOf(this.state.searchTCEBottom) != -1 ||
        list.dsat.toLowerCase().indexOf(this.state.searchTCEBottom) != -1 ||
        list.npsLabel
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.npsScore.toLowerCase().indexOf(this.state.searchTCEBottom) != -1 ||
        list.ces.toLowerCase().indexOf(this.state.searchTCEBottom) != -1 ||
        list.clcaStatus
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1 ||
        list.clcaStatusDate.toLowerCase().indexOf(this.state.searchTCEBottom) !=
          -1 ||
        list.orcSurveyId
          .toLowerCase()
          .indexOf(this.state.searchTCEBottom.toLowerCase()) != -1
      );
    });
    this.setState({ tceoverallsatisfactionsadarr: npsresult });
  };
  updateNPSPromoterSearch(event) {
    this.setState(
      { searchNPSPromoter: event.target.value, activePage: 1 },
      () => this.doNPSPromotersearch()
    );
    if (event.target.value.length === 0) {
      this.setState({
        npslikelihoodtorecommendhappyarr:
          this.state.likelihoodtorecommendhappyarr,
      });
    }
  }
  updateNPSNeutralSearch(event) {
    this.setState({ searchNPSNeutral: event.target.value, activePage: 1 }, () =>
      this.doNPSNeutralsearch()
    );
    if (event.target.value.length === 0) {
      this.setState({
        npslikelihoodtorecommendflatarr:
          this.state.likelihoodtorecommendflatarr,
      });
    }
  }
  updateNPSDetractorSearch(event) {
    this.setState(
      { searchNPSDetractor: event.target.value, activePage: 1 },
      () => this.doNPSDetractorsearch()
    );
    if (event.target.value.length === 0) {
      this.setState({
        npslikelihoodtorecommendsadarr: this.state.likelihoodtorecommendsadarr,
      });
    }
  }
  doNPSPromotersearch = () => {
    const npsresult = this.state.likelihoodtorecommendhappyarr.filter(
      (list) => {
        return (
          list.fy.toLowerCase().indexOf(this.state.searchNPSPromoter) != -1 ||
          list.q
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.wbs
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.sfdcid
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.accountStName
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.accountStId
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter) != -1 ||
          list.ppmcRequestNo
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.status
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.statusDate
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.createdOn
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.projectName
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.projectDescription
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.serviceLine
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.geoFy19
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.geoFy20
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.country
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.leadPm
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.pmEmail
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.pmoLead
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.pmoEmail
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.customerName
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.reasonForNoSurvey
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.customerProjectName
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.customerContactNames
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.customerContactEmail
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.customerLanguage
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.mostRecentNote
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.q1OverallSatisfaction
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter) != -1 ||
          list.q1aOverallSatisfactionComments
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.q1aWhatDidYouAppreciateTheMostComments910
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.q1bWhatCouldHaveBeenDoneBetterComments08
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.q2LikelihoodToRecommend
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter) != -1 ||
          list.q2aRecommendComments
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.q3EaseOfUse
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter) != -1 ||
          list.q3aEaseOfUseComments
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.q4ImplementationWithinTimelines
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter) != -1 ||
          list.q5SolutionQuality
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter) != -1 ||
          list.q6OverallCommunication
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter) != -1 ||
          list.q7PmProfessionalism
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter) != -1 ||
          list.q8TechnicalExpertise
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter) != -1 ||
          list.commentsQ4Q8
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.csat.toLowerCase().indexOf(this.state.searchNPSPromoter) != -1 ||
          list.dsat.toLowerCase().indexOf(this.state.searchNPSPromoter) != -1 ||
          list.npsLabel
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.npsScore.toLowerCase().indexOf(this.state.searchNPSPromoter) !=
            -1 ||
          list.ces.toLowerCase().indexOf(this.state.searchNPSPromoter) != -1 ||
          list.clcaStatus
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1 ||
          list.clcaStatusDate
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter) != -1 ||
          list.orcSurveyId
            .toLowerCase()
            .indexOf(this.state.searchNPSPromoter.toLowerCase()) != -1
        );
      }
    );
    this.setState({ npslikelihoodtorecommendhappyarr: npsresult });
  };

  doNPSNeutralsearch = () => {
    const npsresult = this.state.likelihoodtorecommendflatarr.filter((list) => {
      return (
        list.fy.toLowerCase().indexOf(this.state.searchNPSNeutral) != -1 ||
        list.q
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.wbs
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.sfdcid
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.accountStName
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.accountStId.toLowerCase().indexOf(this.state.searchNPSNeutral) !=
          -1 ||
        list.ppmcRequestNo
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.status
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.statusDate
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.createdOn
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.projectName
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.projectDescription
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.serviceLine
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.geoFy19
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.geoFy20
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.country
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.leadPm
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.pmEmail
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.pmoLead
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.pmoEmail
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.customerName
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.reasonForNoSurvey
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.customerProjectName
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.customerContactNames
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.customerContactEmail
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.customerLanguage
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.mostRecentNote
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.q1OverallSatisfaction
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral) != -1 ||
        list.q1aOverallSatisfactionComments
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.q1aWhatDidYouAppreciateTheMostComments910
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.q1bWhatCouldHaveBeenDoneBetterComments08
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.q2LikelihoodToRecommend
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral) != -1 ||
        list.q2aRecommendComments
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.q3EaseOfUse.toLowerCase().indexOf(this.state.searchNPSNeutral) !=
          -1 ||
        list.q3aEaseOfUseComments
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.q4ImplementationWithinTimelines
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral) != -1 ||
        list.q5SolutionQuality
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral) != -1 ||
        list.q6OverallCommunication
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral) != -1 ||
        list.q7PmProfessionalism
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral) != -1 ||
        list.q8TechnicalExpertise
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral) != -1 ||
        list.commentsQ4Q8
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.csat.toLowerCase().indexOf(this.state.searchNPSNeutral) != -1 ||
        list.dsat.toLowerCase().indexOf(this.state.searchNPSNeutral) != -1 ||
        list.npsLabel
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.npsScore.toLowerCase().indexOf(this.state.searchNPSNeutral) !=
          -1 ||
        list.ces.toLowerCase().indexOf(this.state.searchNPSNeutral) != -1 ||
        list.clcaStatus
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1 ||
        list.clcaStatusDate
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral) != -1 ||
        list.orcSurveyId
          .toLowerCase()
          .indexOf(this.state.searchNPSNeutral.toLowerCase()) != -1
      );
    });
    this.setState({ npslikelihoodtorecommendflatarr: npsresult });
  };

  doNPSDetractorsearch = () => {
    const npsresult = this.state.likelihoodtorecommendsadarr.filter((list) => {
      return (
        list.fy.toLowerCase().indexOf(this.state.searchNPSDetractor) != -1 ||
        list.q
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.wbs
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.sfdcid
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.accountStName
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.accountStId.toLowerCase().indexOf(this.state.searchNPSDetractor) !=
          -1 ||
        list.ppmcRequestNo
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.status
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.statusDate
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.createdOn
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.projectName
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.projectDescription
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.serviceLine
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.geoFy19
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.geoFy20
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.country
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.leadPm
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.pmEmail
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.pmoLead
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.pmoEmail
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.customerName
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.reasonForNoSurvey
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.customerProjectName
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.customerContactNames
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.customerContactEmail
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.customerLanguage
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.mostRecentNote
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.q1OverallSatisfaction
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor) != -1 ||
        list.q1aOverallSatisfactionComments
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.q1aWhatDidYouAppreciateTheMostComments910
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.q1bWhatCouldHaveBeenDoneBetterComments08
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.q2LikelihoodToRecommend
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor) != -1 ||
        list.q2aRecommendComments
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.q3EaseOfUse.toLowerCase().indexOf(this.state.searchNPSDetractor) !=
          -1 ||
        list.q3aEaseOfUseComments
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.q4ImplementationWithinTimelines
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor) != -1 ||
        list.q5SolutionQuality
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor) != -1 ||
        list.q6OverallCommunication
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor) != -1 ||
        list.q7PmProfessionalism
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor) != -1 ||
        list.q8TechnicalExpertise
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor) != -1 ||
        list.commentsQ4Q8
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.csat.toLowerCase().indexOf(this.state.searchNPSDetractor) != -1 ||
        list.dsat.toLowerCase().indexOf(this.state.searchNPSDetractor) != -1 ||
        list.npsLabel
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.npsScore.toLowerCase().indexOf(this.state.searchNPSDetractor) !=
          -1 ||
        list.ces.toLowerCase().indexOf(this.state.searchNPSDetractor) != -1 ||
        list.clcaStatus
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1 ||
        list.clcaStatusDate
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor) != -1 ||
        list.orcSurveyId
          .toLowerCase()
          .indexOf(this.state.searchNPSDetractor.toLowerCase()) != -1
      );
    });
    this.setState({ npslikelihoodtorecommendsadarr: npsresult });
  };

  round = (number) => {
    const factorTen = Math.pow(10, 2);
    return Math.round(number * factorTen) / factorTen;
  };
  logAPSSurvey = () => {
    console.log(Cookies.get("empnumber"), "APS Survey");
    this.TrackingService.LogAPSSurveyClick(Cookies.get("empnumber"));
  };
  render() {
    return (
      <Fragment>
        <div className="card">
          <div className="card-header" id="headingThree">
            <h5 className="mb-0">
              <button
                className="btn btn-link btn-full collapsed"
                type="button"
                data-toggle="collapse"
                aria-expanded="true"
                aria-controls="survey"
                data-target="#survey"
                onClick={this.logAPSSurvey}
              >
                A&amp;PS Survey
              </button>
            </h5>
          </div>
        </div>

        <div
          aria-labelledby="headingThree"
          data-parent="#accordionCust"
          aria-expanded="true"
          className="collapse"
          id="survey"
        >
          <div className="card-body">
            <div className="col-12" align="right">
              {/* <i className="fas fa-external-link-alt"></i> */}
              {/* <CSVLink data={this.state.customerSurveyData} fileName="CustomerSurveyData.xls">
                                 <i className="fa fa-download" aria-hidden="true"></i>
                            </CSVLink>  */}

              <CSVLink
                data={this.state.customerSurveyData}
                filename="CustomerSurveyData.xls"
                key={Math.random()}
              >
                <i className="fa fa-download" aria-hidden="true" />
              </CSVLink>
            </div>

            <div style={{ marginLeft: "1px" }} className="row col-12 p-0">
              <div
                style={{ borderRadius: "0px" /*! margin-right: 5px; */ }}
                className="col-6 p-0"
              >
                <div className="m-1 p-1 surveybox">
                  <div className="col-12 row p-0">
                    {/* <div className="col-2"><img src={Meter} width="30" height="13"/></div> */}
                    <div
                      className="col-12 pr-0 pl-3 totalcustexptxt"
                      align="center"
                    >
                      Total Customer Experience
                    </div>
                    <div className="col-6 fontx10">
                      <div className="row">
                        <div className="col-6 pr-0 fontx9">
                          <strong>Top 2</strong>
                        </div>
                        <div className="col-6 percentgreentxt">
                          {this.state.top2 == "0%" ||
                          this.state.top2 == "NaN%" ? (
                            0 + "%"
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState({ IsTCETop: true }, () =>
                                  this.overallsatisfactionhappy()
                                )
                              }
                            >
                              {this.state.top2}
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6 pr-0 fontx9">
                          <strong>Mid</strong>
                        </div>
                        <div className="col-6 percentambertxt">
                          {this.state.mid == "0%" ||
                          this.state.mid == "NaN%" ? (
                            0 + "%"
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState({ IsTCEMid: true }, () =>
                                  this.overallsatisfactionflat()
                                )
                              }
                            >
                              {this.state.mid}
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6 pr-0 fontx9">
                          <strong>Bottom</strong>
                        </div>
                        <div className="col-6 percentredtxt">
                          {this.state.bottom == "0%" ||
                          this.state.bottom == "NaN%" ? (
                            0 + "%"
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState({ IsTCEBottom: true }, () =>
                                  this.overallsatisfactionsad()
                                )
                              }
                            >
                              {this.state.bottom}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-6 pr-0">
                      <div className="fontx10" align="center">
                        <strong>Survey Count</strong>
                      </div>
                      <div className="survery_countnbr" align="center">
                        {this.state.Surveycount == 0 ? (
                          this.state.Surveycount
                        ) : (
                          <a
                            className="pointer"
                            onClick={() =>
                              this.setState({ IsTCESurveyCount: true })
                            }
                          >
                            {this.state.Surveycount}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 p-0">
                <div className="m-1 p-1 surveybox">
                  <div className="col-12 row p-0">
                    {/* <div className="col-2 survey-top-pic"><img src={Survey} width="37" height="13"/></div> */}
                    <div
                      className="col-12 pr-0 pl-3 totalcustexptxt"
                      align="center"
                    >
                      Net Promoter Score
                      <span className="promoter_score ml-1 font11">
                        {this.state.promoter - this.state.detractor == 0 ||
                        isNaN(this.state.promoter - this.state.detractor)
                          ? 0 + "%"
                          : this.state.promoter - this.state.detractor + "%"}
                      </span>
                    </div>
                    <div className="col-6 fontx10">
                      <div className="row">
                        <div className="col-6 pr-0 fontx9">
                          <strong>Promoter</strong>
                        </div>
                        <div className="col-6 percentgreentxt">
                          {this.state.promoter == 0 ||
                          isNaN(this.state.promoter) ? (
                            0 + "%"
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState({ IsNPSpromoter: true }, () =>
                                  this.likelihoodtorecommendhappy()
                                )
                              }
                            >
                              {this.state.promoter + "%"}
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6 pr-0 fontx9">
                          <strong>Neutral</strong>
                        </div>
                        <div className="col-6 percentambertxt">
                          {this.state.neutral == 0 ||
                          isNaN(this.state.neutral) ? (
                            0 + "%"
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState({ IsNPSNeutral: true }, () =>
                                  this.likelihoodtorecommendflat()
                                )
                              }
                            >
                              {this.state.neutral + "%"}
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6 pr-0 fontx9">
                          <strong>Detractor</strong>
                        </div>
                        <div className="col-6 percentredtxt">
                          {this.state.detractor == 0 ||
                          isNaN(this.state.detractor) ? (
                            0 + "%"
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState({ IsNPSDetractor: true }, () =>
                                  this.likelihoodtorecommendsad()
                                )
                              }
                            >
                              {this.state.detractor + "%"}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-6 pr-0">
                      <div className="fontx10" align="center">
                        <strong>Survey Count</strong>
                      </div>
                      <div className="survery_countnbr" align="center">
                        {this.state.Surveycount == 0 ? (
                          this.state.Surveycount
                        ) : (
                          <a
                            className="pointer"
                            onClick={() =>
                              this.setState({ IsNPSSurveyCount: true })
                            }
                          >
                            {this.state.Surveycount}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 row mt-3 ml-3">
              <div className="col-6 pl-0 pr-2">
                <div className="col-12 row p-0 mb-1 fontx10">
                  <table className="table table-sm">
                    <tbody>
                      <tr className="pb-1">
                        <td>
                          <strong>Component Score</strong>
                        </td>
                        <td className="fontx15 percentgreentxt">
                          <i className="fas fa-laugh"></i>
                        </td>
                        <td className="fontx15 percentambertxt">
                          <i className="fas fa-meh"></i>
                        </td>
                        <td className="fontx15 percentredtxt">
                          <i className="fas fa-frown"></i>
                        </td>
                      </tr>
                      <tr>
                        <td>Overall Satisfaction</td>
                        <td>
                          {this.state.overallsatisfactionhappy == 0 ? (
                            this.state.overallsatisfactionhappy
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState(
                                  { IsOverallsatisfactionHappy: true },
                                  this.overallsatisfactionhappy()
                                )
                              }
                            >
                              {this.state.overallsatisfactionhappy}
                            </a>
                          )}
                        </td>
                        <td>
                          {this.state.overallsatisfactionflat == 0 ? (
                            this.state.overallsatisfactionflat
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState(
                                  { IsOverallsatisfactionFlat: true },
                                  this.overallsatisfactionflat()
                                )
                              }
                            >
                              {this.state.overallsatisfactionflat}
                            </a>
                          )}
                        </td>
                        <td>
                          {this.state.overallsatisfactionsad == 0 ? (
                            this.state.overallsatisfactionsad
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState(
                                  { IsOverallsatisfactionSad: true },
                                  this.overallsatisfactionsad()
                                )
                              }
                            >
                              {this.state.overallsatisfactionsad}
                            </a>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Likelihood to Recommend</td>
                        <td>
                          {this.state.likelihoodtorecommendhappy == 0 ? (
                            this.state.likelihoodtorecommendhappy
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState(
                                  { IslikelihoodtorecommendHappy: true },
                                  this.likelihoodtorecommendhappy()
                                )
                              }
                            >
                              {this.state.likelihoodtorecommendhappy}
                            </a>
                          )}
                        </td>
                        <td>
                          {this.state.likelihoodtorecommendflat == 0 ? (
                            this.state.likelihoodtorecommendflat
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState(
                                  { IslikelihoodtorecommendFlat: true },
                                  this.likelihoodtorecommendflat()
                                )
                              }
                            >
                              {this.state.likelihoodtorecommendflat}
                            </a>
                          )}
                        </td>
                        <td>
                          {this.state.likelihoodtorecommendsad == 0 ? (
                            this.state.likelihoodtorecommendsad
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState(
                                  { IslikelihoodtorecommendSad: true },
                                  this.likelihoodtorecommendsad()
                                )
                              }
                            >
                              {this.state.likelihoodtorecommendsad}
                            </a>
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td>Ease of Use</td>
                        <td>
                          {this.state.easeofusehappy == 0 ? (
                            this.state.easeofusehappy
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState(
                                  { IsEaseOfUseHappy: true },
                                  this.EaseOfUsehappy()
                                )
                              }
                            >
                              {this.state.easeofusehappy}
                            </a>
                          )}
                        </td>
                        <td>
                          {this.state.easeofuseflat == 0 ? (
                            this.state.easeofuseflat
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState(
                                  { IsEaseOfUseFlat: true },
                                  this.EaseOfUseflat()
                                )
                              }
                            >
                              {this.state.easeofuseflat}
                            </a>
                          )}
                        </td>
                        <td>
                          {this.state.easeofusesad == 0 ? (
                            this.state.easeofusesad
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState(
                                  { IsEaseOfUseSad: true },
                                  this.EaseOfUsesad()
                                )
                              }
                            >
                              {this.state.easeofusesad}
                            </a>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Solution Quality</td>
                        <td>
                          {this.state.SolutionQualityhappy == 0 ? (
                            this.state.SolutionQualityhappy
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState(
                                  { IsSolutionQualityHappy: true },
                                  this.SolutionQualityhappy()
                                )
                              }
                            >
                              {this.state.SolutionQualityhappy}
                            </a>
                          )}
                        </td>
                        <td>
                          {this.state.SolutionQualityflat == 0 ? (
                            this.state.SolutionQualityflat
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState(
                                  { IsSolutionQualityFlat: true },
                                  this.SolutionQualityflat()
                                )
                              }
                            >
                              {this.state.SolutionQualityflat}
                            </a>
                          )}
                        </td>
                        <td>
                          {this.state.SolutionQualitysad == 0 ? (
                            this.state.SolutionQualitysad
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState(
                                  { IsSolutionQualitySad: true },
                                  this.SolutionQualitysad()
                                )
                              }
                            >
                              {this.state.SolutionQualitysad}
                            </a>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-6 p-0">
                <div className="col-12 row p-0 mb-1 fontx10">
                  <table className="table table-sm">
                    <tbody>
                      <tr className="pb-1">
                        <td>
                          <strong>Component Score</strong>
                        </td>
                        <td className="fontx15 percentgreentxt">
                          <i className="fas fa-laugh"></i>
                        </td>
                        <td className="fontx15 percentambertxt">
                          <i className="fas fa-meh"></i>
                        </td>
                        <td className="fontx15 percentredtxt">
                          <i className="fas fa-frown"></i>
                        </td>
                      </tr>

                      <tr>
                        <td>Overall Communication</td>
                        <td>
                          {this.state.OverallCommunicationhappy == 0 ? (
                            this.state.OverallCommunicationhappy
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState(
                                  { IsOverallCommunicationHappy: true },
                                  this.OverallCommunicationhappy()
                                )
                              }
                            >
                              {this.state.OverallCommunicationhappy}
                            </a>
                          )}
                        </td>
                        <td>
                          {this.state.OverallCommunicationflat == 0 ? (
                            this.state.OverallCommunicationflat
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState(
                                  { IsOverallCommunicationFlat: true },
                                  this.OverallCommunicationflat()
                                )
                              }
                            >
                              {this.state.OverallCommunicationflat}
                            </a>
                          )}
                        </td>
                        <td>
                          {this.state.OverallCommunicationsad == 0 ? (
                            this.state.OverallCommunicationsad
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState(
                                  { IsOverallCommunicationSad: true },
                                  this.OverallCommunicationsad()
                                )
                              }
                            >
                              {this.state.OverallCommunicationsad}
                            </a>
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td>Implementation within Timelines</td>
                        <td>
                          {this.state.ImplementationWithinTimelineshappy ==
                          0 ? (
                            this.state.ImplementationWithinTimelineshappy
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState(
                                  {
                                    IsImplementationWithinTimelinesHappy: true,
                                  },
                                  this.ImplementationWithinTimelineshappy()
                                )
                              }
                            >
                              {this.state.ImplementationWithinTimelineshappy}
                            </a>
                          )}
                        </td>
                        <td>
                          {this.state.ImplementationWithinTimelinesflat == 0 ? (
                            this.state.ImplementationWithinTimelinesflat
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState(
                                  { IsImplementationWithinTimelinesFlat: true },
                                  this.ImplementationWithinTimelinesflat()
                                )
                              }
                            >
                              {this.state.ImplementationWithinTimelinesflat}
                            </a>
                          )}
                        </td>
                        <td>
                          {this.state.ImplementationWithinTimelinessad == 0 ? (
                            this.state.ImplementationWithinTimelinessad
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState(
                                  { IsImplementationWithinTimelinesSad: true },
                                  this.ImplementationWithinTimelinessad()
                                )
                              }
                            >
                              {this.state.ImplementationWithinTimelinessad}
                            </a>
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td>PM Professionalism</td>
                        <td>
                          {this.state.PmProfessionalismhappy == 0 ? (
                            this.state.PmProfessionalismhappy
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState(
                                  { IsPmProfessionalismHappy: true },
                                  this.PmProfessionalismhappy()
                                )
                              }
                            >
                              {this.state.PmProfessionalismhappy}
                            </a>
                          )}
                        </td>
                        <td>
                          {this.state.PmProfessionalismflat == 0 ? (
                            this.state.PmProfessionalismflat
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState(
                                  { IsPmProfessionalismFlat: true },
                                  this.PmProfessionalismflat()
                                )
                              }
                            >
                              {this.state.PmProfessionalismflat}
                            </a>
                          )}
                        </td>
                        <td>
                          {this.state.PmProfessionalismsad == 0 ? (
                            this.state.PmProfessionalismsad
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState(
                                  { IsPmProfessionalismSad: true },
                                  this.PmProfessionalismsad()
                                )
                              }
                            >
                              {this.state.PmProfessionalismsad}
                            </a>
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td>Technical Expertise</td>
                        <td>
                          {this.state.TechnicalExpertisehappy == 0 ? (
                            this.state.TechnicalExpertisehappy
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState(
                                  { IsTechnicalExpertiseHappy: true },
                                  this.TechnicalExpertisehappy()
                                )
                              }
                            >
                              {this.state.TechnicalExpertisehappy}
                            </a>
                          )}
                        </td>
                        <td>
                          {this.state.TechnicalExpertiseflat == 0 ? (
                            this.state.TechnicalExpertiseflat
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState(
                                  { IsTechnicalExpertiseFlat: true },
                                  this.TechnicalExpertiseflat()
                                )
                              }
                            >
                              {this.state.TechnicalExpertiseflat}
                            </a>
                          )}
                        </td>
                        <td>
                          {this.state.TechnicalExpertisesad == 0 ? (
                            this.state.TechnicalExpertisesad
                          ) : (
                            <a
                              className="pointer"
                              onClick={() =>
                                this.setState(
                                  { IsTechnicalExpertiseSad: true },
                                  this.TechnicalExpertisesad()
                                )
                              }
                            >
                              {this.state.TechnicalExpertisesad}
                            </a>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals  */}
        {/* Overall satisfaction */}
        <Modal show={this.state.IsOverallsatisfactionHappy} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() =>
                  this.setState({ IsOverallsatisfactionHappy: false })
                }
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table
              className="table table-sm table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.overallsatisfactionhappyarr}
                  onFilterUpdate={this._filterUpdatedoverallsatisfactionhappy}
                >
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="wbs"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="sfdcid"
                  >
                    SFDCID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="q1OverallSatisfaction"
                    alignleft={"true"}
                  >
                    Q1 - Overall Satisfaction
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="q1aOverallSatisfactionComments"
                    alignleft={"true"}
                  >
                    Q1a - Overall Satisfaction Comments
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.overallsatisfactionhappyarr.length == 0 && (
                  <tr>
                    <td colSpan="6">No Data to Show</td>
                  </tr>
                )}
                {!this.state.overallsatisfactionhappyarr.length == 0 &&
                  this.state.overallsatisfactionhappyarr.map((value, index) => (
                    <>
                      <tr>
                        <td>{value.wbs}</td>
                        <td>{value.sfdcid}</td>
                        <td>{value.ppmcRequestNo}</td>
                        <td>{value.serviceLine}</td>
                        <td>{value.q1OverallSatisfaction}</td>
                        <td>{value.q1aOverallSatisfactionComments}</td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
        <Modal show={this.state.IsOverallsatisfactionFlat} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() =>
                  this.setState({ IsOverallsatisfactionFlat: false })
                }
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table
              className="table table-sm table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.overallsatisfactionflatarr}
                  onFilterUpdate={this._filterUpdatedoverallsatisfactionflat}
                >
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="wbs"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="sfdcid"
                  >
                    SFDCID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="q1OverallSatisfaction"
                    alignleft={"true"}
                  >
                    Q1 - Overall Satisfaction
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="q1aOverallSatisfactionComments"
                    alignleft={"true"}
                  >
                    Q1a - Overall Satisfaction Comments
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.overallsatisfactionflatarr.length == 0 && (
                  <tr>
                    <td colSpan="6">No Data to Show</td>
                  </tr>
                )}
                {!this.state.overallsatisfactionflatarr.length == 0 &&
                  this.state.overallsatisfactionflatarr.map((value, index) => (
                    <>
                      <tr>
                        <td>{value.wbs}</td>
                        <td>{value.sfdcid}</td>
                        <td>{value.ppmcRequestNo}</td>
                        <td>{value.serviceLine}</td>
                        <td>{value.q1OverallSatisfaction}</td>
                        <td>{value.q1aOverallSatisfactionComments}</td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
        <Modal show={this.state.IsOverallsatisfactionSad} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() =>
                  this.setState({ IsOverallsatisfactionSad: false })
                }
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table
              className="table table-sm table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.overallsatisfactionsadarr}
                  onFilterUpdate={this._filterUpdatedoverallsatisfactionsad}
                >
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="wbs"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="sfdcid"
                  >
                    SFDCID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="q1OverallSatisfaction"
                    alignleft={"true"}
                  >
                    Q1 - Overall Satisfaction
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="q1aOverallSatisfactionComments"
                    alignleft={"true"}
                  >
                    Q1a - Overall Satisfaction Comments
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.overallsatisfactionsadarr.length == 0 && (
                  <tr>
                    <td colSpan="6">No Data to Show</td>
                  </tr>
                )}
                {!this.state.overallsatisfactionsadarr.length == 0 &&
                  this.state.overallsatisfactionsadarr.map((value, index) => (
                    <>
                      <tr>
                        <td>{value.wbs}</td>
                        <td>{value.sfdcid}</td>
                        <td>{value.ppmcRequestNo}</td>
                        <td>{value.serviceLine}</td>
                        <td>{value.q1OverallSatisfaction}</td>
                        <td>{value.q1aOverallSatisfactionComments}</td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>

        {/* likelihood to recommend */}
        <Modal show={this.state.IslikelihoodtorecommendHappy} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() =>
                  this.setState({ IslikelihoodtorecommendHappy: false })
                }
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table
              className="table table-sm table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.likelihoodtorecommendhappyarr}
                  onFilterUpdate={this._filterUpdatedlikelihoodtorecommendhappy}
                >
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="wbs"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="sfdcid"
                  >
                    SFDCID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="q2LikelihoodToRecommend"
                    alignleft={"true"}
                  >
                    Q2 - Likelihood To Recommend
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="q2aRecommendComments"
                    alignleft={"true"}
                  >
                    Q2a - Recommend Comments
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.likelihoodtorecommendhappyarr.length == 0 && (
                  <tr>
                    <td colSpan="6">No Data to Show</td>
                  </tr>
                )}
                {!this.state.likelihoodtorecommendhappyarr.length == 0 &&
                  this.state.likelihoodtorecommendhappyarr.map(
                    (value, index) => (
                      <>
                        <tr>
                          <td>{value.wbs}</td>
                          <td>{value.sfdcid}</td>
                          <td>{value.ppmcRequestNo}</td>
                          <td>{value.serviceLine}</td>
                          <td>{value.q2LikelihoodToRecommend}</td>
                          <td>{value.q2aRecommendComments}</td>
                        </tr>
                      </>
                    )
                  )}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
        <Modal show={this.state.IslikelihoodtorecommendFlat} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() =>
                  this.setState({ IslikelihoodtorecommendFlat: false })
                }
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table
              className="table table-sm table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.likelihoodtorecommendflatarr}
                  onFilterUpdate={this._filterUpdatedlikelihoodtorecommendflat}
                >
                  <th
                    className="cell servicetbheadersnoborderrad"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    WBS
                  </th>
                  <th className="cell servicetbheadersnoborderrad">SFDCID</th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="serviceLine"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="q2LikelihoodToRecommend"
                    filterkey="q2LikelihoodToRecommend"
                    alignleft={"true"}
                  >
                    Q2 - Likelihood To Recommend
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="q2aRecommendComments"
                    filterkey="q2aRecommendComments"
                    alignleft={"true"}
                  >
                    Q2a - Recommend Comments
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.likelihoodtorecommendflatarr.length == 0 && (
                  <tr>
                    <td colSpan="6">No Data to Show</td>
                  </tr>
                )}
                {!this.state.likelihoodtorecommendflatarr.length == 0 &&
                  this.state.likelihoodtorecommendflatarr.map(
                    (value, index) => (
                      <>
                        <tr>
                          <td>{value.wbs}</td>
                          <td>{value.sfdcid}</td>
                          <td>{value.ppmcRequestNo}</td>
                          <td>{value.serviceLine}</td>
                          <td>{value.q2LikelihoodToRecommend}</td>
                          <td>{value.q2aRecommendComments}</td>
                        </tr>
                      </>
                    )
                  )}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
        <Modal show={this.state.IslikelihoodtorecommendSad} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() =>
                  this.setState({ IslikelihoodtorecommendSad: false })
                }
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table
              className="table table-sm table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.likelihoodtorecommendsadarr}
                  onFilterUpdate={this._filterUpdatedlikelihoodtorecommendsad}
                >
                  <th
                    className="cell servicetbheadersnoborderrad"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    WBS
                  </th>
                  <th className="cell servicetbheadersnoborderrad">SFDCID</th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="serviceLine"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="q2LikelihoodToRecommend"
                    filterkey="q2LikelihoodToRecommend"
                    alignleft={"true"}
                  >
                    Q2 - Likelihood To Recommend
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="q2aRecommendComments"
                    filterkey="q2aRecommendComments"
                    alignleft={"true"}
                  >
                    Q2a - Recommend Comments
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.likelihoodtorecommendsadarr.length == 0 && (
                  <tr>
                    <td colSpan="6">No Data to Show</td>
                  </tr>
                )}
                {!this.state.likelihoodtorecommendsadarr.length == 0 &&
                  this.state.likelihoodtorecommendsadarr.map((value, index) => (
                    <>
                      <tr>
                        <td>{value.wbs}</td>
                        <td>{value.sfdcid}</td>
                        <td>{value.ppmcRequestNo}</td>
                        <td>{value.serviceLine}</td>
                        <td>{value.q2LikelihoodToRecommend}</td>
                        <td>{value.q2aRecommendComments}</td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>

        {/* ease of use  */}
        <Modal show={this.state.IsEaseOfUseHappy} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() => this.setState({ IsEaseOfUseHappy: false })}
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table
              className="table table-sm table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.EaseOfUsehappyarr}
                  onFilterUpdate={this._filterUpdatedeaseofusehappy}
                >
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="wbs"
                    filterkey="wbs"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="sfdcid"
                    filterkey="sfdcid"
                  >
                    SFDCID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="ppmcRequestNo"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="serviceLine"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="EaseofUse"
                    filterkey="EaseofUse"
                    alignleft={"true"}
                  >
                    Q3 - Ease of Use
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="EaseofUseComm"
                    filterkey="EaseofUseComm"
                    alignleft={"true"}
                  >
                    Q3a - Ease of Use Comments
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.EaseOfUsehappyarr.length == 0 && (
                  <tr>
                    <td colSpan="6">No Data to Show</td>
                  </tr>
                )}
                {!this.state.EaseOfUsehappyarr.length == 0 &&
                  this.state.EaseOfUsehappyarr.map((value, index) => (
                    <>
                      <tr>
                        <td>{value.wbs}</td>
                        <td>{value.sfdcid}</td>
                        <td>{value.ppmcRequestNo}</td>
                        <td>{value.serviceLine}</td>
                        <td>{value.q3EaseOfUse}</td>
                        <td>{value.q3aEaseOfUseComments}</td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
        <Modal show={this.state.IsEaseOfUseFlat} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() => this.setState({ IsEaseOfUseFlat: false })}
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table
              className="table table-sm table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.EaseOfUseflatarr}
                  onFilterUpdate={this._filterUpdatedeaseofuseflat}
                >
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="wbs"
                    filterkey="wbs"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="sfdcid"
                    filterkey="sfdcid"
                  >
                    SFDCID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="ppmcRequestNo"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="serviceLine"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="EaseofUse"
                    filterkey="EaseofUse"
                    alignleft={"true"}
                  >
                    Q3 - Ease of Use
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="EaseofUseComm"
                    filterkey="EaseofUseComm"
                    alignleft={"true"}
                  >
                    Q3a - Ease of Use Comments
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.EaseOfUseflatarr.length == 0 && (
                  <tr>
                    <td colSpan="6">No Data to Show</td>
                  </tr>
                )}
                {!this.state.EaseOfUseflatarr.length == 0 &&
                  this.state.EaseOfUseflatarr.map((value, index) => (
                    <>
                      <tr>
                        <td>{value.wbs}</td>
                        <td>{value.sfdcid}</td>
                        <td>{value.ppmcRequestNo}</td>
                        <td>{value.serviceLine}</td>
                        <td>{value.q3EaseOfUse}</td>
                        <td>{value.q3aEaseOfUseComments}</td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
        <Modal show={this.state.IsEaseOfUseSad} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() => this.setState({ IsEaseOfUseSad: false })}
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table
              className="table table-sm table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.EaseOfUsesadarr}
                  onFilterUpdate={this._filterUpdatedeaseofusesad}
                >
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="wbs"
                    filterkey="wbs"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="sfdcid"
                    filterkey="sfdcid"
                  >
                    SFDCID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="ppmcRequestNo"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="serviceLine"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="EaseofUse"
                    filterkey="EaseofUse"
                    alignleft={"true"}
                  >
                    Q3 - Ease of Use
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="EaseofUseComm"
                    filterkey="EaseofUseComm"
                    alignleft={"true"}
                  >
                    Q3a - Ease of Use Comments
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.EaseOfUsesadarr.length == 0 && (
                  <tr>
                    <td colSpan="6">No Data to Show</td>
                  </tr>
                )}
                {!this.state.EaseOfUsesadarr.length == 0 &&
                  this.state.EaseOfUsesadarr.map((value, index) => (
                    <>
                      <tr>
                        <td>{value.wbs}</td>
                        <td>{value.sfdcid}</td>
                        <td>{value.ppmcRequestNo}</td>
                        <td>{value.serviceLine}</td>
                        <td>{value.q3EaseOfUse}</td>
                        <td>{value.q3aEaseOfUseComments}</td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>

        {/* Solution Quality */}
        <Modal show={this.state.IsSolutionQualityHappy} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() => this.setState({ IsSolutionQualityHappy: false })}
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table
              className="table table-sm table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.SolutionQualityhappyarr}
                  onFilterUpdate={this._filterUpdatedSolutionQualityhappy}
                >
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="wbs"
                    filterkey="wbs"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="sfdcid"
                    filterkey="sfdcid"
                  >
                    SFDCID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="ppmcRequestNo"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="serviceLine"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="q5SolutionQuality"
                    filterkey="q5SolutionQuality"
                    alignleft={"true"}
                  >
                    Q5 - Solution Quality
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="commentsq4q8"
                    filterkey="commentsq4q8"
                    alignleft={"true"}
                  >
                    Comments Q4-Q8
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.SolutionQualityhappyarr.length == 0 && (
                  <tr>
                    <td colSpan="6">No Data to Show</td>
                  </tr>
                )}
                {!this.state.SolutionQualityhappyarr.length == 0 &&
                  this.state.SolutionQualityhappyarr.map((value, index) => (
                    <>
                      <tr>
                        <td>{value.wbs}</td>
                        <td>{value.sfdcid}</td>
                        <td>{value.ppmcRequestNo}</td>
                        <td>{value.serviceLine}</td>
                        <td>{value.q5SolutionQuality}</td>
                        <td>{value.commentsQ4Q8}</td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
        <Modal show={this.state.IsSolutionQualityFlat} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() => this.setState({ IsSolutionQualityFlat: false })}
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table
              className="table table-sm table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.SolutionQualityflatarr}
                  onFilterUpdate={this._filterUpdatedSolutionQualityflat}
                >
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="wbs"
                    filterkey="wbs"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="sfdcid"
                    filterkey="sfdcid"
                  >
                    SFDCID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="ppmcRequestNo"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="serviceLine"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="q5SolutionQuality"
                    filterkey="q5SolutionQuality"
                    alignleft={"true"}
                  >
                    Q5 - Solution Quality
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="commentsq4q8"
                    filterkey="commentsq4q8"
                    alignleft={"true"}
                  >
                    Comments Q4-Q8
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.SolutionQualityflatarr.length == 0 && (
                  <tr>
                    <td colSpan="6">No Data to Show</td>
                  </tr>
                )}
                {!this.state.SolutionQualityflatarr.length == 0 &&
                  this.state.SolutionQualityflatarr.map((value, index) => (
                    <>
                      <tr>
                        <td>{value.wbs}</td>
                        <td>{value.sfdcid}</td>
                        <td>{value.ppmcRequestNo}</td>
                        <td>{value.serviceLine}</td>
                        <td>{value.q5SolutionQuality}</td>
                        <td>{value.commentsQ4Q8}</td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
        <Modal show={this.state.IsSolutionQualitySad} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() => this.setState({ IsSolutionQualitySad: false })}
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table
              className="table table-sm table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.SolutionQualitysadarr}
                  onFilterUpdate={this._filterUpdatedSolutionQualitysad}
                >
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="wbs"
                    filterkey="wbs"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="sfdcid"
                    filterkey="sfdcid"
                  >
                    SFDCID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="ppmcRequestNo"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="serviceLine"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="q5SolutionQuality"
                    filterkey="q5SolutionQuality"
                    alignleft={"true"}
                  >
                    Q5 - Solution Quality
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="commentsq4q8"
                    filterkey="commentsq4q8"
                    alignleft={"true"}
                  >
                    Comments Q4-Q8
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.SolutionQualitysadarr.length == 0 && (
                  <tr>
                    <td colSpan="6">No Data to Show</td>
                  </tr>
                )}
                {!this.state.SolutionQualitysadarr.length == 0 &&
                  this.state.SolutionQualitysadarr.map((value, index) => (
                    <>
                      <tr>
                        <td>{value.wbs}</td>
                        <td>{value.sfdcid}</td>
                        <td>{value.ppmcRequestNo}</td>
                        <td>{value.serviceLine}</td>
                        <td>{value.q5SolutionQuality}</td>
                        <td>{value.commentsQ4Q8}</td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>

        {/* overall communication */}

        <Modal show={this.state.IsOverallCommunicationHappy} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() =>
                  this.setState({ IsOverallCommunicationHappy: false })
                }
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table
              className="table table-sm table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.OverallCommunicationhappyarr}
                  onFilterUpdate={this._filterUpdatedOverallCommunicationhappy}
                >
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="wbs"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="sfdcid"
                  >
                    SFDCID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="q6OverallCommunication"
                    alignleft={"true"}
                  >
                    Q6 - Overall Communication
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="commentsQ4Q8"
                    alignleft={"true"}
                  >
                    Comments Q4-Q8
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.OverallCommunicationhappyarr.length == 0 && (
                  <tr>
                    <td colSpan="6">No Data to Show</td>
                  </tr>
                )}
                {!this.state.OverallCommunicationhappyarr.length == 0 &&
                  this.state.OverallCommunicationhappyarr.map(
                    (value, index) => (
                      <>
                        <tr>
                          <td>{value.wbs}</td>
                          <td>{value.sfdcid}</td>
                          <td>{value.ppmcRequestNo}</td>
                          <td>{value.serviceLine}</td>
                          <td>{value.q6OverallCommunication}</td>
                          <td>{value.commentsQ4Q8}</td>
                        </tr>
                      </>
                    )
                  )}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
        <Modal show={this.state.IsOverallCommunicationFlat} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() =>
                  this.setState({ IsOverallCommunicationFlat: false })
                }
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table
              className="table table-sm table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.OverallCommunicationflatarr}
                  onFilterUpdate={this._filterUpdatedOverallCommunicationflat}
                >
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="wbs"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="sfdcid"
                  >
                    SFDCID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="q6OverallCommunication"
                    alignleft={"true"}
                  >
                    Q6 - Overall Communication
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="commentsQ4Q8"
                    alignleft={"true"}
                  >
                    Comments Q4-Q8
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.OverallCommunicationflatarr.length == 0 && (
                  <tr>
                    <td colSpan="6">No Data to Show</td>
                  </tr>
                )}
                {!this.state.OverallCommunicationflatarr.length == 0 &&
                  this.state.OverallCommunicationflatarr.map((value, index) => (
                    <>
                      <tr>
                        <td>{value.wbs}</td>
                        <td>{value.sfdcid}</td>
                        <td>{value.ppmcRequestNo}</td>
                        <td>{value.serviceLine}</td>
                        <td>{value.q6OverallCommunication}</td>
                        <td>{value.commentsQ4Q8}</td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
        <Modal show={this.state.IsOverallCommunicationSad} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() =>
                  this.setState({ IsOverallCommunicationSad: false })
                }
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table
              className="table table-sm table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.OverallCommunicationsadarr}
                  onFilterUpdate={this._filterUpdatedOverallCommunicationsad}
                >
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="wbs"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="sfdcid"
                  >
                    SFDCID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="q6OverallCommunication"
                    alignleft={"true"}
                  >
                    Q6 - Overall Communication
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="commentsQ4Q8"
                    alignleft={"true"}
                  >
                    Comments Q4-Q8
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.OverallCommunicationsadarr.length == 0 && (
                  <tr>
                    <td colSpan="6">No Data to Show</td>
                  </tr>
                )}
                {!this.state.OverallCommunicationsadarr.length == 0 &&
                  this.state.OverallCommunicationsadarr.map((value, index) => (
                    <>
                      <tr>
                        <td>{value.wbs}</td>
                        <td>{value.sfdcid}</td>
                        <td>{value.ppmcRequestNo}</td>
                        <td>{value.serviceLine}</td>
                        <td>{value.q6OverallCommunication}</td>
                        <td>{value.commentsQ4Q8}</td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>

        {/* Implementation Within Timelines */}
        <Modal show={this.state.IsImplementationWithinTimelinesHappy} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() =>
                  this.setState({ IsImplementationWithinTimelinesHappy: false })
                }
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table
              className="table table-sm table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.ImplementationWithinTimelineshappyarr}
                  onFilterUpdate={
                    this._filterUpdatedImplementationWithinTimelineshappy
                  }
                >
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="wbs"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="sfdcid"
                  >
                    SFDCID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="q4ImplementationWithinTimelines"
                    alignleft={"true"}
                  >
                    Q4 - Implementation Within Timelines
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="commentsQ4Q8"
                    alignleft={"true"}
                  >
                    Comments Q4-Q8
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.ImplementationWithinTimelineshappyarr.length ==
                  0 && (
                  <tr>
                    <td colSpan="6">No Data to Show</td>
                  </tr>
                )}
                {!this.state.ImplementationWithinTimelineshappyarr.length ==
                  0 &&
                  this.state.ImplementationWithinTimelineshappyarr.map(
                    (value, index) => (
                      <>
                        <tr>
                          <td>{value.wbs}</td>
                          <td>{value.sfdcid}</td>
                          <td>{value.ppmcRequestNo}</td>
                          <td>{value.serviceLine}</td>
                          <td>{value.q4ImplementationWithinTimelines}</td>
                          <td>{value.commentsQ4Q8}</td>
                        </tr>
                      </>
                    )
                  )}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
        <Modal show={this.state.IsImplementationWithinTimelinesFlat} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() =>
                  this.setState({ IsImplementationWithinTimelinesFlat: false })
                }
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table
              className="table table-sm table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.ImplementationWithinTimelinesflatarr}
                  onFilterUpdate={
                    this._filterUpdatedImplementationWithinTimelinesflat
                  }
                >
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="wbs"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="sfdcid"
                  >
                    SFDCID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="q4ImplementationWithinTimelines"
                    alignleft={"true"}
                  >
                    Q4 - Implementation Within Timelines
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="commentsQ4Q8"
                    alignleft={"true"}
                  >
                    Comments Q4-Q8
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.ImplementationWithinTimelinesflatarr.length ==
                  0 && (
                  <tr>
                    <td colSpan="6">No Data to Show</td>
                  </tr>
                )}
                {!this.state.ImplementationWithinTimelinesflatarr.length == 0 &&
                  this.state.ImplementationWithinTimelinesflatarr.map(
                    (value, index) => (
                      <>
                        <tr>
                          <td>{value.wbs}</td>
                          <td>{value.sfdcid}</td>
                          <td>{value.ppmcRequestNo}</td>
                          <td>{value.serviceLine}</td>
                          <td>{value.q4ImplementationWithinTimelines}</td>
                          <td>{value.commentsQ4Q8}</td>
                        </tr>
                      </>
                    )
                  )}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
        <Modal show={this.state.IsImplementationWithinTimelinesSad} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() =>
                  this.setState({ IsImplementationWithinTimelinesSad: false })
                }
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table
              className="table table-sm table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.ImplementationWithinTimelinessadarr}
                  onFilterUpdate={
                    this._filterUpdatedImplementationWithinTimelinessad
                  }
                >
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="wbs"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="sfdcid"
                  >
                    SFDCID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="q4ImplementationWithinTimelines"
                    alignleft={"true"}
                  >
                    Q4 - Implementation Within Timelines
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    filterkey="commentsQ4Q8"
                    alignleft={"true"}
                  >
                    Comments Q4-Q8
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.ImplementationWithinTimelinessadarr.length == 0 && (
                  <tr>
                    <td colSpan="6">No Data to Show</td>
                  </tr>
                )}
                {!this.state.ImplementationWithinTimelinessadarr.length == 0 &&
                  this.state.ImplementationWithinTimelinessadarr.map(
                    (value, index) => (
                      <>
                        <tr>
                          <td>{value.wbs}</td>
                          <td>{value.sfdcid}</td>
                          <td>{value.ppmcRequestNo}</td>
                          <td>{value.serviceLine}</td>
                          <td>{value.q4ImplementationWithinTimelines}</td>
                          <td>{value.commentsQ4Q8}</td>
                        </tr>
                      </>
                    )
                  )}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>

        {/* Pm Professionalism  */}
        <Modal show={this.state.IsPmProfessionalismHappy} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() =>
                  this.setState({ IsPmProfessionalismHappy: false })
                }
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table
              className="table table-sm table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.PmProfessionalismhappyarr}
                  onFilterUpdate={this._filterUpdatedPmProfessionalismhappy}
                >
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="wbs"
                    filterkey="wbs"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="sfdcid"
                    filterkey="sfdcid"
                  >
                    SFDCID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="ppmcRequestNo"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="serviceLine"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="q7PmProfessionalism"
                    filterkey="q7PmProfessionalism"
                    alignleft={"true"}
                  >
                    Q7 - PM Professionalism
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="commentsQ4Q8"
                    filterkey="commentsQ4Q8"
                    alignleft={"true"}
                  >
                    Comments Q4-Q8
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.PmProfessionalismhappyarr.length == 0 && (
                  <tr>
                    <td colSpan="6">No Data to Show</td>
                  </tr>
                )}
                {!this.state.PmProfessionalismhappyarr.length == 0 &&
                  this.state.PmProfessionalismhappyarr.map((value, index) => (
                    <>
                      <tr>
                        <td>{value.wbs}</td>
                        <td>{value.sfdcid}</td>
                        <td>{value.ppmcRequestNo}</td>
                        <td>{value.serviceLine}</td>
                        <td>{value.q7PmProfessionalism}</td>
                        <td>{value.commentsQ4Q8}</td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
        <Modal show={this.state.IsPmProfessionalismFlat} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() =>
                  this.setState({ IsPmProfessionalismFlat: false })
                }
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table
              className="table table-sm table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.PmProfessionalismflatarr}
                  onFilterUpdate={this._filterUpdatedPmProfessionalismflat}
                >
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="wbs"
                    filterkey="wbs"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="sfdcid"
                    filterkey="sfdcid"
                  >
                    SFDCID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="ppmcRequestNo"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="serviceLine"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="q7PmProfessionalism"
                    filterkey="q7PmProfessionalism"
                    alignleft={"true"}
                  >
                    Q7 - PM Professionalism
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="commentsQ4Q8"
                    filterkey="commentsQ4Q8"
                    alignleft={"true"}
                  >
                    Comments Q4-Q8
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.PmProfessionalismflatarr.length == 0 && (
                  <tr>
                    <td colSpan="6">No Data to Show</td>
                  </tr>
                )}
                {!this.state.PmProfessionalismflatarr.length == 0 &&
                  this.state.PmProfessionalismflatarr.map((value, index) => (
                    <>
                      <tr>
                        <td>{value.wbs}</td>
                        <td>{value.sfdcid}</td>
                        <td>{value.ppmcRequestNo}</td>
                        <td>{value.serviceLine}</td>
                        <td>{value.q7PmProfessionalism}</td>
                        <td>{value.commentsQ4Q8}</td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
        <Modal show={this.state.IsPmProfessionalismSad} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() => this.setState({ IsPmProfessionalismSad: false })}
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table
              className="table table-sm table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.PmProfessionalismsadarr}
                  onFilterUpdate={this._filterUpdatedPmProfessionalismsad}
                >
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="wbs"
                    filterkey="wbs"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="sfdcid"
                    filterkey="sfdcid"
                  >
                    SFDCID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="ppmcRequestNo"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="serviceLine"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="q7PmProfessionalism"
                    filterkey="q7PmProfessionalism"
                    alignleft={"true"}
                  >
                    Q7 - PM Professionalism
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="commentsQ4Q8"
                    filterkey="commentsQ4Q8"
                    alignleft={"true"}
                  >
                    Comments Q4-Q8
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.PmProfessionalismsadarr.length == 0 && (
                  <tr>
                    <td colSpan="6">No Data to Show</td>
                  </tr>
                )}
                {!this.state.PmProfessionalismsadarr.length == 0 &&
                  this.state.PmProfessionalismsadarr.map((value, index) => (
                    <>
                      <tr>
                        <td>{value.wbs}</td>
                        <td>{value.sfdcid}</td>
                        <td>{value.ppmcRequestNo}</td>
                        <td>{value.serviceLine}</td>
                        <td>{value.q7PmProfessionalism}</td>
                        <td>{value.commentsQ4Q8}</td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>

        {/* Technical Expertise */}
        <Modal show={this.state.IsTechnicalExpertiseHappy} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() =>
                  this.setState({ IsTechnicalExpertiseHappy: false })
                }
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table
              className="table table-sm table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.TechnicalExpertisehappyarr}
                  onFilterUpdate={this._filterUpdatedTechnicalExpertisehappy}
                >
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="wbs"
                    filterkey="wbs"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="sfdcid"
                    filterkey="sfdcid"
                  >
                    SFDCID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="ppmcRequestNo"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="serviceLine"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="q8TechnicalExpertise"
                    filterkey="q8TechnicalExpertise"
                    alignleft={"true"}
                  >
                    Q8 - Technical Expertise
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="commentsq4q8"
                    filterkey="commentsq4q8"
                    alignleft={"true"}
                  >
                    Comments Q4-Q8
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.TechnicalExpertisehappyarr.length == 0 && (
                  <tr>
                    <td colSpan="6">No Data to Show</td>
                  </tr>
                )}
                {!this.state.TechnicalExpertisehappyarr.length == 0 &&
                  this.state.TechnicalExpertisehappyarr.map((value, index) => (
                    <>
                      <tr>
                        <td>{value.wbs}</td>
                        <td>{value.sfdcid}</td>
                        <td>{value.ppmcRequestNo}</td>
                        <td>{value.serviceLine}</td>
                        <td>{value.q8TechnicalExpertise}</td>
                        <td>{value.commentsQ4Q8}</td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
        <Modal show={this.state.IsTechnicalExpertiseFlat} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() =>
                  this.setState({ IsTechnicalExpertiseFlat: false })
                }
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table
              className="table table-sm table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.TechnicalExpertiseflatarr}
                  onFilterUpdate={this._filterUpdatedTechnicalExpertiseflat}
                >
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="wbs"
                    filterkey="wbs"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="sfdcid"
                    filterkey="sfdcid"
                  >
                    SFDCID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="ppmcRequestNo"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="serviceLine"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="q8TechnicalExpertise"
                    filterkey="q8TechnicalExpertise"
                    alignleft={"true"}
                  >
                    Q8 - Technical Expertise
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="commentsq4q8"
                    filterkey="commentsq4q8"
                    alignleft={"true"}
                  >
                    Comments Q4-Q8
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.TechnicalExpertiseflatarr.length == 0 && (
                  <tr>
                    <td colSpan="6">No Data to Show</td>
                  </tr>
                )}
                {!this.state.TechnicalExpertiseflatarr.length == 0 &&
                  this.state.TechnicalExpertiseflatarr.map((value, index) => (
                    <>
                      <tr>
                        <td>{value.wbs}</td>
                        <td>{value.sfdcid}</td>
                        <td>{value.ppmcRequestNo}</td>
                        <td>{value.serviceLine}</td>
                        <td>{value.q8TechnicalExpertise}</td>
                        <td>{value.commentsQ4Q8}</td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
        <Modal show={this.state.IsTechnicalExpertiseSad} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() =>
                  this.setState({ IsTechnicalExpertiseSad: false })
                }
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table
              className="table table-sm table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.TechnicalExpertisesadarr}
                  onFilterUpdate={this._filterUpdatedTechnicalExpertisesad}
                >
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="wbs"
                    filterkey="wbs"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="sfdcid"
                    filterkey="sfdcid"
                  >
                    SFDCID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="ppmcRequestNo"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="serviceLine"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="q8TechnicalExpertise"
                    filterkey="q8TechnicalExpertise"
                    alignleft={"true"}
                  >
                    Q8 - Technical Expertise
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad"
                    key="commentsq4q8"
                    filterkey="commentsq4q8"
                    alignleft={"true"}
                  >
                    Comments Q4-Q8
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.TechnicalExpertisesadarr.length == 0 && (
                  <tr>
                    <td colSpan="6">No Data to Show</td>
                  </tr>
                )}
                {!this.state.TechnicalExpertisesadarr.length == 0 &&
                  this.state.TechnicalExpertisesadarr.map((value, index) => (
                    <>
                      <tr>
                        <td>{value.wbs}</td>
                        <td>{value.sfdcid}</td>
                        <td>{value.ppmcRequestNo}</td>
                        <td>{value.serviceLine}</td>
                        <td>{value.q8TechnicalExpertise}</td>
                        <td>{value.commentsQ4Q8}</td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>

        {/* TCESurveyCount */}
        <Modal show={this.state.IsTCESurveyCount} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() => this.setState({ IsTCESurveyCount: false })}
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              value={this.state.search}
              placeholder="Filter"
              className="filterInput mb-2"
              onChange={this.updateSearch.bind(this)}
            />
            <CSVLink
              data={this.state.TCEcustomerSurveyData}
              filename="TCEcustomerSurveyData.xls"
              key={Math.random()}
            >
              <i className="fa fa-download float-right" aria-hidden="true" />
            </CSVLink>
            <table
              className="table table-lg table-responsive table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.TCEcustomerSurveyData}
                  onFilterUpdate={this._filterUpdatedTCESurveyData}
                >
                  <th
                    className="cell servicetbheadersnoborderrad lgtable"
                    key="fy"
                    filterkey="fy"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    FY
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="q"
                    filterkey="q"
                  >
                    Quarter
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="wbs"
                    filterkey="wbs"
                    alignleft={"true"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="sfdcid"
                    filterkey="sfdcid"
                    alignleft={"true"}
                  >
                    SFDC ID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="accountStName"
                    filterkey="q8TechniaccountStNamecalExpertise"
                    alignleft={"true"}
                  >
                    Account ST Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="accountStId"
                    filterkey="accountStId"
                    alignleft={"true"}
                  >
                    Account ST ID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="ppmcRequestNo"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="status"
                    filterkey="status"
                    alignleft={"true"}
                  >
                    Status
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="statusDate"
                    filterkey="statusDate"
                    alignleft={"true"}
                  >
                    Status Date (UTC)
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="createdOn"
                    filterkey="createdOn"
                    alignleft={"true"}
                  >
                    Created On (UTC)
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="projectName"
                    filterkey="projectName"
                    alignleft={"true"}
                  >
                    Project Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="projectDescription"
                    filterkey="projectDescription"
                    alignleft={"true"}
                  >
                    Project Description
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="serviceLine"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="geoFy19"
                    filterkey="geoFy19"
                    alignleft={"true"}
                  >
                    Geo Fy19
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="geoFy20"
                    filterkey="geoFy20"
                    alignleft={"true"}
                  >
                    Geo Fy20
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="country"
                    filterkey="country"
                    alignleft={"true"}
                  >
                    Country
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="leadPm"
                    filterkey="leadPm"
                    alignleft={"true"}
                  >
                    Lead PM
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="pmEmail"
                    filterkey="pmEmail"
                    alignleft={"true"}
                  >
                    PM Email
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="pmoLead"
                    filterkey="pmoLead"
                    alignleft={"true"}
                  >
                    PMO Lead
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="pmoEmail"
                    filterkey="pmoEmail"
                    alignleft={"true"}
                  >
                    PMO Email
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="customerName"
                    filterkey="customerName"
                    alignleft={"true"}
                  >
                    Customer Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="reasonForNoSurvey"
                    filterkey="reasonForNoSurvey"
                    alignleft={"true"}
                  >
                    Reason For No Survey
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerProjectName"
                    filterkey="customerProjectName"
                    alignleft={"true"}
                  >
                    Customer Project Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerContactNames"
                    filterkey="customerContactNames"
                    alignleft={"true"}
                  >
                    Customer Contact Names
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerContactEmail"
                    filterkey="customerContactEmail"
                    alignleft={"true"}
                  >
                    Customer Contact Email
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerLanguage"
                    filterkey="customerLanguage"
                    alignleft={"true"}
                  >
                    Customer Language
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="mostRecentNote"
                    filterkey="mostRecentNote"
                    alignleft={"true"}
                  >
                    Most Recent Note
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="q1OverallSatisfaction"
                    filterkey="q1OverallSatisfaction"
                    alignleft={"true"}
                  >
                    Q1 - Overall Satisfaction
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q1aOverallSatisfactionComments"
                    filterkey="q1aOverallSatisfactionComments"
                    alignleft={"true"}
                  >
                    Q1a - Overall Satisfaction Comments
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw250"
                    key="q1aWhatDidYouAppreciateTheMostComments910"
                    filterkey="q1aWhatDidYouAppreciateTheMostComments910"
                    alignleft={"true"}
                  >
                    Q1a - What Did You Appreciate The Most Comments 910
                  </th>

                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw250 "
                    key="q1bWhatCouldHaveBeenDoneBetterComments08"
                    filterkey="q1bWhatCouldHaveBeenDoneBetterComments08"
                    alignleft={"true"}
                  >
                    Q1b - What Could Have Been Done Better Comments 08
                  </th>

                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q2LikelihoodToRecommend"
                    filterkey="q2LikelihoodToRecommend"
                    alignleft={"true"}
                  >
                    Q2 - Likelihood To Recommend
                  </th>

                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="q2aRecommendComments"
                    filterkey="q2aRecommendComments"
                    alignleft={"true"}
                  >
                    Q2a - Recommend Comments
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="q3EaseOfUse"
                    filterkey="q3EaseOfUse"
                    alignleft={"true"}
                  >
                    Q3 - Ease Of Use
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="q3aEaseOfUseComments"
                    filterkey="q3aEaseOfUseComments"
                    alignleft={"true"}
                  >
                    q3a - Ease Of Use Comments
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="q4ImplementationWithinTimelines"
                    filterkey="q4ImplementationWithinTimelines"
                    alignleft={"true"}
                  >
                    Q4 - Implementation Within Timelines
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q5SolutionQuality"
                    filterkey="q5SolutionQuality"
                    alignleft={"true"}
                  >
                    q5 - Solution Quality
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q6OverallCommunication"
                    filterkey="q6OverallCommunication"
                    alignleft={"true"}
                  >
                    Q6 - Overall Communication
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q7PmProfessionalism"
                    filterkey="q7PmProfessionalism"
                    alignleft={"true"}
                  >
                    Q7 - PM Professionalism
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="q8TechnicalExpertise"
                    filterkey="q8TechnicalExpertise"
                    alignleft={"true"}
                  >
                    Q8 - Technical Expertise
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="commentsQ4Q8"
                    filterkey="commentsQ4Q8"
                    alignleft={"true"}
                  >
                    comments Q4-Q8
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="csat"
                    filterkey="csat"
                    alignleft={"true"}
                  >
                    CSAT
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="dsat"
                    filterkey="dsat"
                    alignleft={"true"}
                  >
                    DSAT
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="npsLabel"
                    filterkey="npsLabel"
                    alignleft={"true"}
                  >
                    NPS Label
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="npsScore"
                    filterkey="npsScore"
                    alignleft={"true"}
                  >
                    NPS Score
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="ces"
                    filterkey="ces"
                    alignleft={"true"}
                  >
                    CES
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="clcaStatus"
                    filterkey="clcaStatus"
                    alignleft={"true"}
                  >
                    CLCA Status
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="clcaStatusDate"
                    filterkey="clcaStatusDate"
                    alignleft={"true"}
                  >
                    CLCA Status Date (UTC)
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="orcSurveyId"
                    filterkey="orcSurveyId"
                    alignleft={"true"}
                  >
                    ORC Survey ID
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.TCEcustomerSurveyData.length == 0 && (
                  <tr>
                    <td colSpan="49">No Data to Show</td>
                  </tr>
                )}
                {!this.state.TCEcustomerSurveyData.length == 0 &&
                  this.state.TCEcustomerSurveyData.map((value, index) => (
                    <>
                      <tr>
                        <td>{value.fy}</td>
                        <td>{value.q}</td>
                        <td>{value.wbs}</td>
                        <td>{value.sfdcid}</td>
                        <td>{value.accountStName}</td>
                        <td>{value.accountStId}</td>
                        <td>{value.ppmcRequestNo}</td>
                        <td>{value.status}</td>
                        <td>{value.statusDate}</td>
                        <td>{value.createdOn}</td>
                        <td>{value.projectName}</td>
                        <td>{value.projectDescription}</td>
                        <td>{value.serviceLine}</td>
                        <td>{value.geoFy19}</td>
                        <td>{value.geoFy20}</td>
                        <td>{value.country}</td>
                        <td>{value.leadPm}</td>
                        <td>{value.pmEmail}</td>
                        <td>{value.pmoLead}</td>
                        <td>{value.pmoEmail}</td>
                        <td>{value.customerName}</td>
                        <td>{value.reasonForNoSurvey}</td>
                        <td>{value.customerProjectName}</td>
                        <td>{value.customerContactNames}</td>
                        <td>{value.customerContactEmail}</td>
                        <td>{value.customerLanguage}</td>
                        <td>{value.mostRecentNote}</td>
                        <td>{value.q1OverallSatisfaction}</td>
                        <td>{value.q1aOverallSatisfactionComments}</td>
                        <td>
                          {value.q1aWhatDidYouAppreciateTheMostComments910}
                        </td>
                        <td>
                          {value.q1bWhatCouldHaveBeenDoneBetterComments08}
                        </td>
                        <td>{value.q2LikelihoodToRecommend}</td>
                        <td>{value.q2aRecommendComments}</td>
                        <td>{value.q3EaseOfUse}</td>
                        <td>{value.q3aEaseOfUseComments}</td>
                        <td>{value.q4ImplementationWithinTimelines}</td>
                        <td>{value.q5SolutionQuality}</td>
                        <td>{value.q6OverallCommunication}</td>
                        <td>{value.q7PmProfessionalism}</td>
                        <td>{value.q8TechnicalExpertise}</td>
                        <td>{value.commentsQ4Q8}</td>
                        <td>{value.csat}</td>
                        <td>{value.dsat}</td>
                        <td>{value.npsLabel}</td>
                        <td>{value.npsScore}</td>
                        <td>{value.ces}</td>
                        <td>{value.clcaStatus}</td>
                        <td>{value.clcaStatusDate}</td>
                        <td>{value.orcSurveyId}</td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>

        {/* NPSSurveyCount */}
        <Modal show={this.state.IsNPSSurveyCount} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() => this.setState({ IsNPSSurveyCount: false })}
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              value={this.state.searchNPS}
              placeholder="Filter"
              className="filterInput mb-2"
              onChange={this.updateNPSSearch.bind(this)}
            />
            <CSVLink
              data={this.state.NPScustomerSurveyData}
              filename="NPScustomerSurveyData.xls"
              key={Math.random()}
            >
              <i className="fa fa-download float-right" aria-hidden="true" />
            </CSVLink>
            <table
              className="table table-lg table-responsive table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.NPScustomerSurveyData}
                  onFilterUpdate={this._filterUpdatedNPSSurveyData}
                >
                  <th
                    className="cell servicetbheadersnoborderrad lgtable"
                    key="fy"
                    filterkey="fy"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    FY
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="q"
                    filterkey="q"
                  >
                    Quarter
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="wbs"
                    filterkey="wbs"
                    alignleft={"true"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="sfdcid"
                    filterkey="sfdcid"
                    alignleft={"true"}
                  >
                    SFDC ID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="accountStName"
                    filterkey="q8TechniaccountStNamecalExpertise"
                    alignleft={"true"}
                  >
                    Account ST Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="accountStId"
                    filterkey="accountStId"
                    alignleft={"true"}
                  >
                    Account ST ID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="ppmcRequestNo"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="status"
                    filterkey="status"
                    alignleft={"true"}
                  >
                    Status
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="statusDate"
                    filterkey="statusDate"
                    alignleft={"true"}
                  >
                    Status Date (UTC)
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="createdOn"
                    filterkey="createdOn"
                    alignleft={"true"}
                  >
                    Created On (UTC)
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="projectName"
                    filterkey="projectName"
                    alignleft={"true"}
                  >
                    Project Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="projectDescription"
                    filterkey="projectDescription"
                    alignleft={"true"}
                  >
                    Project Description
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="serviceLine"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="geoFy19"
                    filterkey="geoFy19"
                    alignleft={"true"}
                  >
                    Geo Fy19
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="geoFy20"
                    filterkey="geoFy20"
                    alignleft={"true"}
                  >
                    Geo Fy20
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="country"
                    filterkey="country"
                    alignleft={"true"}
                  >
                    Country
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="leadPm"
                    filterkey="leadPm"
                    alignleft={"true"}
                  >
                    Lead PM
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="pmEmail"
                    filterkey="pmEmail"
                    alignleft={"true"}
                  >
                    PM Email
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="pmoLead"
                    filterkey="pmoLead"
                    alignleft={"true"}
                  >
                    PMO Lead
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="pmoEmail"
                    filterkey="pmoEmail"
                    alignleft={"true"}
                  >
                    PMO Email
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="customerName"
                    filterkey="customerName"
                    alignleft={"true"}
                  >
                    Customer Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="reasonForNoSurvey"
                    filterkey="reasonForNoSurvey"
                    alignleft={"true"}
                  >
                    Reason For No Survey
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerProjectName"
                    filterkey="customerProjectName"
                    alignleft={"true"}
                  >
                    Customer Project Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerContactNames"
                    filterkey="customerContactNames"
                    alignleft={"true"}
                  >
                    Customer Contact Names
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerContactEmail"
                    filterkey="customerContactEmail"
                    alignleft={"true"}
                  >
                    Customer Contact Email
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerLanguage"
                    filterkey="customerLanguage"
                    alignleft={"true"}
                  >
                    Customer Language
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="mostRecentNote"
                    filterkey="mostRecentNote"
                    alignleft={"true"}
                  >
                    Most Recent Note
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="q1OverallSatisfaction"
                    filterkey="q1OverallSatisfaction"
                    alignleft={"true"}
                  >
                    Q1 - Overall Satisfaction
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q1aOverallSatisfactionComments"
                    filterkey="q1aOverallSatisfactionComments"
                    alignleft={"true"}
                  >
                    Q1a - Overall Satisfaction Comments
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw250"
                    key="q1aWhatDidYouAppreciateTheMostComments910"
                    filterkey="q1aWhatDidYouAppreciateTheMostComments910"
                    alignleft={"true"}
                  >
                    Q1a - What Did You Appreciate The Most Comments 910
                  </th>

                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw250 "
                    key="q1bWhatCouldHaveBeenDoneBetterComments08"
                    filterkey="q1bWhatCouldHaveBeenDoneBetterComments08"
                    alignleft={"true"}
                  >
                    Q1b - What Could Have Been Done Better Comments 08
                  </th>

                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q2LikelihoodToRecommend"
                    filterkey="q2LikelihoodToRecommend"
                    alignleft={"true"}
                  >
                    Q2 - Likelihood To Recommend
                  </th>

                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="q2aRecommendComments"
                    filterkey="q2aRecommendComments"
                    alignleft={"true"}
                  >
                    Q2a - Recommend Comments
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="q3EaseOfUse"
                    filterkey="q3EaseOfUse"
                    alignleft={"true"}
                  >
                    Q3 - Ease Of Use
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="q3aEaseOfUseComments"
                    filterkey="q3aEaseOfUseComments"
                    alignleft={"true"}
                  >
                    q3a - Ease Of Use Comments
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="q4ImplementationWithinTimelines"
                    filterkey="q4ImplementationWithinTimelines"
                    alignleft={"true"}
                  >
                    Q4 - Implementation Within Timelines
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q5SolutionQuality"
                    filterkey="q5SolutionQuality"
                    alignleft={"true"}
                  >
                    q5 - Solution Quality
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q6OverallCommunication"
                    filterkey="q6OverallCommunication"
                    alignleft={"true"}
                  >
                    Q6 - Overall Communication
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q7PmProfessionalism"
                    filterkey="q7PmProfessionalism"
                    alignleft={"true"}
                  >
                    Q7 - PM Professionalism
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="q8TechnicalExpertise"
                    filterkey="q8TechnicalExpertise"
                    alignleft={"true"}
                  >
                    Q8 - Technical Expertise
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="commentsQ4Q8"
                    filterkey="commentsQ4Q8"
                    alignleft={"true"}
                  >
                    comments Q4-Q8
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="csat"
                    filterkey="csat"
                    alignleft={"true"}
                  >
                    CSAT
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="dsat"
                    filterkey="dsat"
                    alignleft={"true"}
                  >
                    DSAT
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="npsLabel"
                    filterkey="npsLabel"
                    alignleft={"true"}
                  >
                    NPS Label
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="npsScore"
                    filterkey="npsScore"
                    alignleft={"true"}
                  >
                    NPS Score
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="ces"
                    filterkey="ces"
                    alignleft={"true"}
                  >
                    CES
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="clcaStatus"
                    filterkey="clcaStatus"
                    alignleft={"true"}
                  >
                    CLCA Status
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="clcaStatusDate"
                    filterkey="clcaStatusDate"
                    alignleft={"true"}
                  >
                    CLCA Status Date (UTC)
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="orcSurveyId"
                    filterkey="orcSurveyId"
                    alignleft={"true"}
                  >
                    ORC Survey ID
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.NPScustomerSurveyData.length == 0 && (
                  <tr>
                    <td colSpan="49">No Data to Show</td>
                  </tr>
                )}
                {!this.state.NPScustomerSurveyData.length == 0 &&
                  this.state.NPScustomerSurveyData.map((value, index) => (
                    <>
                      <tr>
                        <td>{value.fy}</td>
                        <td>{value.q}</td>
                        <td>{value.wbs}</td>
                        <td>{value.sfdcid}</td>
                        <td>{value.accountStName}</td>
                        <td>{value.accountStId}</td>
                        <td>{value.ppmcRequestNo}</td>
                        <td>{value.status}</td>
                        <td>{value.statusDate}</td>
                        <td>{value.createdOn}</td>
                        <td>{value.projectName}</td>
                        <td>{value.projectDescription}</td>
                        <td>{value.serviceLine}</td>
                        <td>{value.geoFy19}</td>
                        <td>{value.geoFy20}</td>
                        <td>{value.country}</td>
                        <td>{value.leadPm}</td>
                        <td>{value.pmEmail}</td>
                        <td>{value.pmoLead}</td>
                        <td>{value.pmoEmail}</td>
                        <td>{value.customerName}</td>
                        <td>{value.reasonForNoSurvey}</td>
                        <td>{value.customerProjectName}</td>
                        <td>{value.customerContactNames}</td>
                        <td>{value.customerContactEmail}</td>
                        <td>{value.customerLanguage}</td>
                        <td>{value.mostRecentNote}</td>
                        <td>{value.q1OverallSatisfaction}</td>
                        <td>{value.q1aOverallSatisfactionComments}</td>
                        <td>
                          {value.q1aWhatDidYouAppreciateTheMostComments910}
                        </td>
                        <td>
                          {value.q1bWhatCouldHaveBeenDoneBetterComments08}
                        </td>
                        <td>{value.q2LikelihoodToRecommend}</td>
                        <td>{value.q2aRecommendComments}</td>
                        <td>{value.q3EaseOfUse}</td>
                        <td>{value.q3aEaseOfUseComments}</td>
                        <td>{value.q4ImplementationWithinTimelines}</td>
                        <td>{value.q5SolutionQuality}</td>
                        <td>{value.q6OverallCommunication}</td>
                        <td>{value.q7PmProfessionalism}</td>
                        <td>{value.q8TechnicalExpertise}</td>
                        <td>{value.commentsQ4Q8}</td>
                        <td>{value.csat}</td>
                        <td>{value.dsat}</td>
                        <td>{value.npsLabel}</td>
                        <td>{value.npsScore}</td>
                        <td>{value.ces}</td>
                        <td>{value.clcaStatus}</td>
                        <td>{value.clcaStatusDate}</td>
                        <td>{value.orcSurveyId}</td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
        {/* TCE Top */}
        <Modal show={this.state.IsTCETop} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() => this.setState({ IsTCETop: false })}
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              value={this.state.searchTCETop}
              placeholder="Filter"
              className="filterInput mb-2"
              onChange={this.updateTCETopSearch.bind(this)}
            />
            <CSVLink
              data={this.state.tceoverallsatisfactionhappyarr}
              filename="TCETopSurveyData.xls"
              key={Math.random()}
            >
              <i className="fa fa-download float-right" aria-hidden="true" />
            </CSVLink>
            <table
              className="table table-lg table-responsive table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.tceoverallsatisfactionhappyarr}
                  onFilterUpdate={this._filterUpdatedoverallsatisfactionhappy}
                >
                  <th
                    className="cell servicetbheadersnoborderrad lgtable"
                    key="fy"
                    filterkey="fy"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    FY
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="q"
                    filterkey="q"
                  >
                    Quarter
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="wbs"
                    filterkey="wbs"
                    alignleft={"true"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="sfdcid"
                    filterkey="sfdcid"
                    alignleft={"true"}
                  >
                    SFDC ID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="accountStName"
                    filterkey="q8TechniaccountStNamecalExpertise"
                    alignleft={"true"}
                  >
                    Account ST Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="accountStId"
                    filterkey="accountStId"
                    alignleft={"true"}
                  >
                    Account ST ID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="ppmcRequestNo"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="status"
                    filterkey="status"
                    alignleft={"true"}
                  >
                    Status
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="statusDate"
                    filterkey="statusDate"
                    alignleft={"true"}
                  >
                    Status Date (UTC)
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="createdOn"
                    filterkey="createdOn"
                    alignleft={"true"}
                  >
                    Created On (UTC)
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="projectName"
                    filterkey="projectName"
                    alignleft={"true"}
                  >
                    Project Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="projectDescription"
                    filterkey="projectDescription"
                    alignleft={"true"}
                  >
                    Project Description
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="serviceLine"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="geoFy19"
                    filterkey="geoFy19"
                    alignleft={"true"}
                  >
                    Geo Fy19
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="geoFy20"
                    filterkey="geoFy20"
                    alignleft={"true"}
                  >
                    Geo Fy20
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="country"
                    filterkey="country"
                    alignleft={"true"}
                  >
                    Country
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="leadPm"
                    filterkey="leadPm"
                    alignleft={"true"}
                  >
                    Lead PM
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="pmEmail"
                    filterkey="pmEmail"
                    alignleft={"true"}
                  >
                    PM Email
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="pmoLead"
                    filterkey="pmoLead"
                    alignleft={"true"}
                  >
                    PMO Lead
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="pmoEmail"
                    filterkey="pmoEmail"
                    alignleft={"true"}
                  >
                    PMO Email
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="customerName"
                    filterkey="customerName"
                    alignleft={"true"}
                  >
                    Customer Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="reasonForNoSurvey"
                    filterkey="reasonForNoSurvey"
                    alignleft={"true"}
                  >
                    Reason For No Survey
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerProjectName"
                    filterkey="customerProjectName"
                    alignleft={"true"}
                  >
                    Customer Project Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerContactNames"
                    filterkey="customerContactNames"
                    alignleft={"true"}
                  >
                    Customer Contact Names
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerContactEmail"
                    filterkey="customerContactEmail"
                    alignleft={"true"}
                  >
                    Customer Contact Email
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerLanguage"
                    filterkey="customerLanguage"
                    alignleft={"true"}
                  >
                    Customer Language
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="mostRecentNote"
                    filterkey="mostRecentNote"
                    alignleft={"true"}
                  >
                    Most Recent Note
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="q1OverallSatisfaction"
                    filterkey="q1OverallSatisfaction"
                    alignleft={"true"}
                  >
                    Q1 - Overall Satisfaction
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q1aOverallSatisfactionComments"
                    filterkey="q1aOverallSatisfactionComments"
                    alignleft={"true"}
                  >
                    Q1a - Overall Satisfaction Comments
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw250"
                    key="q1aWhatDidYouAppreciateTheMostComments910"
                    filterkey="q1aWhatDidYouAppreciateTheMostComments910"
                    alignleft={"true"}
                  >
                    Q1a - What Did You Appreciate The Most Comments 910
                  </th>

                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw250 "
                    key="q1bWhatCouldHaveBeenDoneBetterComments08"
                    filterkey="q1bWhatCouldHaveBeenDoneBetterComments08"
                    alignleft={"true"}
                  >
                    Q1b - What Could Have Been Done Better Comments 08
                  </th>

                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q2LikelihoodToRecommend"
                    filterkey="q2LikelihoodToRecommend"
                    alignleft={"true"}
                  >
                    Q2 - Likelihood To Recommend
                  </th>

                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="q2aRecommendComments"
                    filterkey="q2aRecommendComments"
                    alignleft={"true"}
                  >
                    Q2a - Recommend Comments
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="q3EaseOfUse"
                    filterkey="q3EaseOfUse"
                    alignleft={"true"}
                  >
                    Q3 - Ease Of Use
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="q3aEaseOfUseComments"
                    filterkey="q3aEaseOfUseComments"
                    alignleft={"true"}
                  >
                    q3a - Ease Of Use Comments
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="q4ImplementationWithinTimelines"
                    filterkey="q4ImplementationWithinTimelines"
                    alignleft={"true"}
                  >
                    Q4 - Implementation Within Timelines
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q5SolutionQuality"
                    filterkey="q5SolutionQuality"
                    alignleft={"true"}
                  >
                    q5 - Solution Quality
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q6OverallCommunication"
                    filterkey="q6OverallCommunication"
                    alignleft={"true"}
                  >
                    Q6 - Overall Communication
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q7PmProfessionalism"
                    filterkey="q7PmProfessionalism"
                    alignleft={"true"}
                  >
                    Q7 - PM Professionalism
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="q8TechnicalExpertise"
                    filterkey="q8TechnicalExpertise"
                    alignleft={"true"}
                  >
                    Q8 - Technical Expertise
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="commentsQ4Q8"
                    filterkey="commentsQ4Q8"
                    alignleft={"true"}
                  >
                    comments Q4-Q8
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="csat"
                    filterkey="csat"
                    alignleft={"true"}
                  >
                    CSAT
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="dsat"
                    filterkey="dsat"
                    alignleft={"true"}
                  >
                    DSAT
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="npsLabel"
                    filterkey="npsLabel"
                    alignleft={"true"}
                  >
                    NPS Label
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="npsScore"
                    filterkey="npsScore"
                    alignleft={"true"}
                  >
                    NPS Score
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="ces"
                    filterkey="ces"
                    alignleft={"true"}
                  >
                    CES
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="clcaStatus"
                    filterkey="clcaStatus"
                    alignleft={"true"}
                  >
                    CLCA Status
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="clcaStatusDate"
                    filterkey="clcaStatusDate"
                    alignleft={"true"}
                  >
                    CLCA Status Date (UTC)
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="orcSurveyId"
                    filterkey="orcSurveyId"
                    alignleft={"true"}
                  >
                    ORC Survey ID
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.tceoverallsatisfactionhappyarr.length == 0 && (
                  <tr>
                    <td colSpan="49">No Data to Show</td>
                  </tr>
                )}
                {!this.state.tceoverallsatisfactionhappyarr.length == 0 &&
                  this.state.tceoverallsatisfactionhappyarr.map(
                    (value, index) => (
                      <>
                        <tr>
                          <td>{value.fy}</td>
                          <td>{value.q}</td>
                          <td>{value.wbs}</td>
                          <td>{value.sfdcid}</td>
                          <td>{value.accountStName}</td>
                          <td>{value.accountStId}</td>
                          <td>{value.ppmcRequestNo}</td>
                          <td>{value.status}</td>
                          <td>{value.statusDate}</td>
                          <td>{value.createdOn}</td>
                          <td>{value.projectName}</td>
                          <td>{value.projectDescription}</td>
                          <td>{value.serviceLine}</td>
                          <td>{value.geoFy19}</td>
                          <td>{value.geoFy20}</td>
                          <td>{value.country}</td>
                          <td>{value.leadPm}</td>
                          <td>{value.pmEmail}</td>
                          <td>{value.pmoLead}</td>
                          <td>{value.pmoEmail}</td>
                          <td>{value.customerName}</td>
                          <td>{value.reasonForNoSurvey}</td>
                          <td>{value.customerProjectName}</td>
                          <td>{value.customerContactNames}</td>
                          <td>{value.customerContactEmail}</td>
                          <td>{value.customerLanguage}</td>
                          <td>{value.mostRecentNote}</td>
                          <td>{value.q1OverallSatisfaction}</td>
                          <td>{value.q1aOverallSatisfactionComments}</td>
                          <td>
                            {value.q1aWhatDidYouAppreciateTheMostComments910}
                          </td>
                          <td>
                            {value.q1bWhatCouldHaveBeenDoneBetterComments08}
                          </td>
                          <td>{value.q2LikelihoodToRecommend}</td>
                          <td>{value.q2aRecommendComments}</td>
                          <td>{value.q3EaseOfUse}</td>
                          <td>{value.q3aEaseOfUseComments}</td>
                          <td>{value.q4ImplementationWithinTimelines}</td>
                          <td>{value.q5SolutionQuality}</td>
                          <td>{value.q6OverallCommunication}</td>
                          <td>{value.q7PmProfessionalism}</td>
                          <td>{value.q8TechnicalExpertise}</td>
                          <td>{value.commentsQ4Q8}</td>
                          <td>{value.csat}</td>
                          <td>{value.dsat}</td>
                          <td>{value.npsLabel}</td>
                          <td>{value.npsScore}</td>
                          <td>{value.ces}</td>
                          <td>{value.clcaStatus}</td>
                          <td>{value.clcaStatusDate}</td>
                          <td>{value.orcSurveyId}</td>
                        </tr>
                      </>
                    )
                  )}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>

        {/* TCE Mid */}
        <Modal show={this.state.IsTCEMid} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() => this.setState({ IsTCEMid: false })}
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              value={this.state.searchTCEMid}
              placeholder="Filter"
              className="filterInput mb-2"
              onChange={this.updateTCEMidSearch.bind(this)}
            />
            <CSVLink
              data={this.state.tceoverallsatisfactionflatarr}
              filename="TCEMidSurveyData.xls"
              key={Math.random()}
            >
              <i className="fa fa-download float-right" aria-hidden="true" />
            </CSVLink>
            <table
              className="table table-lg table-responsive table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.tceoverallsatisfactionflatarr}
                  onFilterUpdate={this._filterUpdatedoverallsatisfactionflat}
                >
                  <th
                    className="cell servicetbheadersnoborderrad lgtable"
                    key="fy"
                    filterkey="fy"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    FY
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="q"
                    filterkey="q"
                  >
                    Quarter
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="wbs"
                    filterkey="wbs"
                    alignleft={"true"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="sfdcid"
                    filterkey="sfdcid"
                    alignleft={"true"}
                  >
                    SFDC ID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="accountStName"
                    filterkey="q8TechniaccountStNamecalExpertise"
                    alignleft={"true"}
                  >
                    Account ST Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="accountStId"
                    filterkey="accountStId"
                    alignleft={"true"}
                  >
                    Account ST ID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="ppmcRequestNo"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="status"
                    filterkey="status"
                    alignleft={"true"}
                  >
                    Status
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="statusDate"
                    filterkey="statusDate"
                    alignleft={"true"}
                  >
                    Status Date (UTC)
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="createdOn"
                    filterkey="createdOn"
                    alignleft={"true"}
                  >
                    Created On (UTC)
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="projectName"
                    filterkey="projectName"
                    alignleft={"true"}
                  >
                    Project Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="projectDescription"
                    filterkey="projectDescription"
                    alignleft={"true"}
                  >
                    Project Description
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="serviceLine"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="geoFy19"
                    filterkey="geoFy19"
                    alignleft={"true"}
                  >
                    Geo Fy19
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="geoFy20"
                    filterkey="geoFy20"
                    alignleft={"true"}
                  >
                    Geo Fy20
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="country"
                    filterkey="country"
                    alignleft={"true"}
                  >
                    Country
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="leadPm"
                    filterkey="leadPm"
                    alignleft={"true"}
                  >
                    Lead PM
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="pmEmail"
                    filterkey="pmEmail"
                    alignleft={"true"}
                  >
                    PM Email
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="pmoLead"
                    filterkey="pmoLead"
                    alignleft={"true"}
                  >
                    PMO Lead
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="pmoEmail"
                    filterkey="pmoEmail"
                    alignleft={"true"}
                  >
                    PMO Email
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="customerName"
                    filterkey="customerName"
                    alignleft={"true"}
                  >
                    Customer Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="reasonForNoSurvey"
                    filterkey="reasonForNoSurvey"
                    alignleft={"true"}
                  >
                    Reason For No Survey
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerProjectName"
                    filterkey="customerProjectName"
                    alignleft={"true"}
                  >
                    Customer Project Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerContactNames"
                    filterkey="customerContactNames"
                    alignleft={"true"}
                  >
                    Customer Contact Names
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerContactEmail"
                    filterkey="customerContactEmail"
                    alignleft={"true"}
                  >
                    Customer Contact Email
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerLanguage"
                    filterkey="customerLanguage"
                    alignleft={"true"}
                  >
                    Customer Language
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="mostRecentNote"
                    filterkey="mostRecentNote"
                    alignleft={"true"}
                  >
                    Most Recent Note
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="q1OverallSatisfaction"
                    filterkey="q1OverallSatisfaction"
                    alignleft={"true"}
                  >
                    Q1 - Overall Satisfaction
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q1aOverallSatisfactionComments"
                    filterkey="q1aOverallSatisfactionComments"
                    alignleft={"true"}
                  >
                    Q1a - Overall Satisfaction Comments
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw250"
                    key="q1aWhatDidYouAppreciateTheMostComments910"
                    filterkey="q1aWhatDidYouAppreciateTheMostComments910"
                    alignleft={"true"}
                  >
                    Q1a - What Did You Appreciate The Most Comments 910
                  </th>

                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw250 "
                    key="q1bWhatCouldHaveBeenDoneBetterComments08"
                    filterkey="q1bWhatCouldHaveBeenDoneBetterComments08"
                    alignleft={"true"}
                  >
                    Q1b - What Could Have Been Done Better Comments 08
                  </th>

                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q2LikelihoodToRecommend"
                    filterkey="q2LikelihoodToRecommend"
                    alignleft={"true"}
                  >
                    Q2 - Likelihood To Recommend
                  </th>

                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="q2aRecommendComments"
                    filterkey="q2aRecommendComments"
                    alignleft={"true"}
                  >
                    Q2a - Recommend Comments
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="q3EaseOfUse"
                    filterkey="q3EaseOfUse"
                    alignleft={"true"}
                  >
                    Q3 - Ease Of Use
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="q3aEaseOfUseComments"
                    filterkey="q3aEaseOfUseComments"
                    alignleft={"true"}
                  >
                    q3a - Ease Of Use Comments
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="q4ImplementationWithinTimelines"
                    filterkey="q4ImplementationWithinTimelines"
                    alignleft={"true"}
                  >
                    Q4 - Implementation Within Timelines
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q5SolutionQuality"
                    filterkey="q5SolutionQuality"
                    alignleft={"true"}
                  >
                    q5 - Solution Quality
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q6OverallCommunication"
                    filterkey="q6OverallCommunication"
                    alignleft={"true"}
                  >
                    Q6 - Overall Communication
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q7PmProfessionalism"
                    filterkey="q7PmProfessionalism"
                    alignleft={"true"}
                  >
                    Q7 - PM Professionalism
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="q8TechnicalExpertise"
                    filterkey="q8TechnicalExpertise"
                    alignleft={"true"}
                  >
                    Q8 - Technical Expertise
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="commentsQ4Q8"
                    filterkey="commentsQ4Q8"
                    alignleft={"true"}
                  >
                    comments Q4-Q8
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="csat"
                    filterkey="csat"
                    alignleft={"true"}
                  >
                    CSAT
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="dsat"
                    filterkey="dsat"
                    alignleft={"true"}
                  >
                    DSAT
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="npsLabel"
                    filterkey="npsLabel"
                    alignleft={"true"}
                  >
                    NPS Label
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="npsScore"
                    filterkey="npsScore"
                    alignleft={"true"}
                  >
                    NPS Score
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="ces"
                    filterkey="ces"
                    alignleft={"true"}
                  >
                    CES
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="clcaStatus"
                    filterkey="clcaStatus"
                    alignleft={"true"}
                  >
                    CLCA Status
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="clcaStatusDate"
                    filterkey="clcaStatusDate"
                    alignleft={"true"}
                  >
                    CLCA Status Date (UTC)
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="orcSurveyId"
                    filterkey="orcSurveyId"
                    alignleft={"true"}
                  >
                    ORC Survey ID
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.tceoverallsatisfactionflatarr.length == 0 && (
                  <tr>
                    <td colSpan="49">No Data to Show</td>
                  </tr>
                )}
                {!this.state.tceoverallsatisfactionflatarr.length == 0 &&
                  this.state.tceoverallsatisfactionflatarr.map(
                    (value, index) => (
                      <>
                        <tr>
                          <td>{value.fy}</td>
                          <td>{value.q}</td>
                          <td>{value.wbs}</td>
                          <td>{value.sfdcid}</td>
                          <td>{value.accountStName}</td>
                          <td>{value.accountStId}</td>
                          <td>{value.ppmcRequestNo}</td>
                          <td>{value.status}</td>
                          <td>{value.statusDate}</td>
                          <td>{value.createdOn}</td>
                          <td>{value.projectName}</td>
                          <td>{value.projectDescription}</td>
                          <td>{value.serviceLine}</td>
                          <td>{value.geoFy19}</td>
                          <td>{value.geoFy20}</td>
                          <td>{value.country}</td>
                          <td>{value.leadPm}</td>
                          <td>{value.pmEmail}</td>
                          <td>{value.pmoLead}</td>
                          <td>{value.pmoEmail}</td>
                          <td>{value.customerName}</td>
                          <td>{value.reasonForNoSurvey}</td>
                          <td>{value.customerProjectName}</td>
                          <td>{value.customerContactNames}</td>
                          <td>{value.customerContactEmail}</td>
                          <td>{value.customerLanguage}</td>
                          <td>{value.mostRecentNote}</td>
                          <td>{value.q1OverallSatisfaction}</td>
                          <td>{value.q1aOverallSatisfactionComments}</td>
                          <td>
                            {value.q1aWhatDidYouAppreciateTheMostComments910}
                          </td>
                          <td>
                            {value.q1bWhatCouldHaveBeenDoneBetterComments08}
                          </td>
                          <td>{value.q2LikelihoodToRecommend}</td>
                          <td>{value.q2aRecommendComments}</td>
                          <td>{value.q3EaseOfUse}</td>
                          <td>{value.q3aEaseOfUseComments}</td>
                          <td>{value.q4ImplementationWithinTimelines}</td>
                          <td>{value.q5SolutionQuality}</td>
                          <td>{value.q6OverallCommunication}</td>
                          <td>{value.q7PmProfessionalism}</td>
                          <td>{value.q8TechnicalExpertise}</td>
                          <td>{value.commentsQ4Q8}</td>
                          <td>{value.csat}</td>
                          <td>{value.dsat}</td>
                          <td>{value.npsLabel}</td>
                          <td>{value.npsScore}</td>
                          <td>{value.ces}</td>
                          <td>{value.clcaStatus}</td>
                          <td>{value.clcaStatusDate}</td>
                          <td>{value.orcSurveyId}</td>
                        </tr>
                      </>
                    )
                  )}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
        {/* TCE Bottom */}
        <Modal show={this.state.IsTCEBottom} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() => this.setState({ IsTCEBottom: false })}
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              value={this.state.searchTCEBottom}
              placeholder="Filter"
              className="filterInput mb-2"
              onChange={this.updateTCEBottomSearch.bind(this)}
            />
            <CSVLink
              data={this.state.tceoverallsatisfactionsadarr}
              filename="TCEBottomSurveyData.xls"
              key={Math.random()}
            >
              <i className="fa fa-download float-right" aria-hidden="true" />
            </CSVLink>
            <table
              className="table table-lg table-responsive table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.tceoverallsatisfactionsadarr}
                  onFilterUpdate={this._filterUpdatedoverallsatisfactionsad}
                >
                  <th
                    className="cell servicetbheadersnoborderrad lgtable"
                    key="fy"
                    filterkey="fy"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    FY
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="q"
                    filterkey="q"
                  >
                    Quarter
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="wbs"
                    filterkey="wbs"
                    alignleft={"true"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="sfdcid"
                    filterkey="sfdcid"
                    alignleft={"true"}
                  >
                    SFDC ID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="accountStName"
                    filterkey="q8TechniaccountStNamecalExpertise"
                    alignleft={"true"}
                  >
                    Account ST Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="accountStId"
                    filterkey="accountStId"
                    alignleft={"true"}
                  >
                    Account ST ID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="ppmcRequestNo"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="status"
                    filterkey="status"
                    alignleft={"true"}
                  >
                    Status
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="statusDate"
                    filterkey="statusDate"
                    alignleft={"true"}
                  >
                    Status Date (UTC)
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="createdOn"
                    filterkey="createdOn"
                    alignleft={"true"}
                  >
                    Created On (UTC)
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="projectName"
                    filterkey="projectName"
                    alignleft={"true"}
                  >
                    Project Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="projectDescription"
                    filterkey="projectDescription"
                    alignleft={"true"}
                  >
                    Project Description
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="serviceLine"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="geoFy19"
                    filterkey="geoFy19"
                    alignleft={"true"}
                  >
                    Geo Fy19
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="geoFy20"
                    filterkey="geoFy20"
                    alignleft={"true"}
                  >
                    Geo Fy20
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="country"
                    filterkey="country"
                    alignleft={"true"}
                  >
                    Country
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="leadPm"
                    filterkey="leadPm"
                    alignleft={"true"}
                  >
                    Lead PM
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="pmEmail"
                    filterkey="pmEmail"
                    alignleft={"true"}
                  >
                    PM Email
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="pmoLead"
                    filterkey="pmoLead"
                    alignleft={"true"}
                  >
                    PMO Lead
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="pmoEmail"
                    filterkey="pmoEmail"
                    alignleft={"true"}
                  >
                    PMO Email
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="customerName"
                    filterkey="customerName"
                    alignleft={"true"}
                  >
                    Customer Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="reasonForNoSurvey"
                    filterkey="reasonForNoSurvey"
                    alignleft={"true"}
                  >
                    Reason For No Survey
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerProjectName"
                    filterkey="customerProjectName"
                    alignleft={"true"}
                  >
                    Customer Project Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerContactNames"
                    filterkey="customerContactNames"
                    alignleft={"true"}
                  >
                    Customer Contact Names
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerContactEmail"
                    filterkey="customerContactEmail"
                    alignleft={"true"}
                  >
                    Customer Contact Email
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerLanguage"
                    filterkey="customerLanguage"
                    alignleft={"true"}
                  >
                    Customer Language
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="mostRecentNote"
                    filterkey="mostRecentNote"
                    alignleft={"true"}
                  >
                    Most Recent Note
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="q1OverallSatisfaction"
                    filterkey="q1OverallSatisfaction"
                    alignleft={"true"}
                  >
                    Q1 - Overall Satisfaction
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q1aOverallSatisfactionComments"
                    filterkey="q1aOverallSatisfactionComments"
                    alignleft={"true"}
                  >
                    Q1a - Overall Satisfaction Comments
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw250"
                    key="q1aWhatDidYouAppreciateTheMostComments910"
                    filterkey="q1aWhatDidYouAppreciateTheMostComments910"
                    alignleft={"true"}
                  >
                    Q1a - What Did You Appreciate The Most Comments 910
                  </th>

                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw250 "
                    key="q1bWhatCouldHaveBeenDoneBetterComments08"
                    filterkey="q1bWhatCouldHaveBeenDoneBetterComments08"
                    alignleft={"true"}
                  >
                    Q1b - What Could Have Been Done Better Comments 08
                  </th>

                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q2LikelihoodToRecommend"
                    filterkey="q2LikelihoodToRecommend"
                    alignleft={"true"}
                  >
                    Q2 - Likelihood To Recommend
                  </th>

                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="q2aRecommendComments"
                    filterkey="q2aRecommendComments"
                    alignleft={"true"}
                  >
                    Q2a - Recommend Comments
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="q3EaseOfUse"
                    filterkey="q3EaseOfUse"
                    alignleft={"true"}
                  >
                    Q3 - Ease Of Use
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="q3aEaseOfUseComments"
                    filterkey="q3aEaseOfUseComments"
                    alignleft={"true"}
                  >
                    q3a - Ease Of Use Comments
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="q4ImplementationWithinTimelines"
                    filterkey="q4ImplementationWithinTimelines"
                    alignleft={"true"}
                  >
                    Q4 - Implementation Within Timelines
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q5SolutionQuality"
                    filterkey="q5SolutionQuality"
                    alignleft={"true"}
                  >
                    q5 - Solution Quality
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q6OverallCommunication"
                    filterkey="q6OverallCommunication"
                    alignleft={"true"}
                  >
                    Q6 - Overall Communication
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q7PmProfessionalism"
                    filterkey="q7PmProfessionalism"
                    alignleft={"true"}
                  >
                    Q7 - PM Professionalism
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="q8TechnicalExpertise"
                    filterkey="q8TechnicalExpertise"
                    alignleft={"true"}
                  >
                    Q8 - Technical Expertise
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="commentsQ4Q8"
                    filterkey="commentsQ4Q8"
                    alignleft={"true"}
                  >
                    comments Q4-Q8
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="csat"
                    filterkey="csat"
                    alignleft={"true"}
                  >
                    CSAT
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="dsat"
                    filterkey="dsat"
                    alignleft={"true"}
                  >
                    DSAT
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="npsLabel"
                    filterkey="npsLabel"
                    alignleft={"true"}
                  >
                    NPS Label
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="npsScore"
                    filterkey="npsScore"
                    alignleft={"true"}
                  >
                    NPS Score
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="ces"
                    filterkey="ces"
                    alignleft={"true"}
                  >
                    CES
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="clcaStatus"
                    filterkey="clcaStatus"
                    alignleft={"true"}
                  >
                    CLCA Status
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="clcaStatusDate"
                    filterkey="clcaStatusDate"
                    alignleft={"true"}
                  >
                    CLCA Status Date (UTC)
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="orcSurveyId"
                    filterkey="orcSurveyId"
                    alignleft={"true"}
                  >
                    ORC Survey ID
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.tceoverallsatisfactionsadarr.length == 0 && (
                  <tr>
                    <td colSpan="49">No Data to Show</td>
                  </tr>
                )}
                {!this.state.tceoverallsatisfactionsadarr.length == 0 &&
                  this.state.tceoverallsatisfactionsadarr.map(
                    (value, index) => (
                      <>
                        <tr>
                          <td>{value.fy}</td>
                          <td>{value.q}</td>
                          <td>{value.wbs}</td>
                          <td>{value.sfdcid}</td>
                          <td>{value.accountStName}</td>
                          <td>{value.accountStId}</td>
                          <td>{value.ppmcRequestNo}</td>
                          <td>{value.status}</td>
                          <td>{value.statusDate}</td>
                          <td>{value.createdOn}</td>
                          <td>{value.projectName}</td>
                          <td>{value.projectDescription}</td>
                          <td>{value.serviceLine}</td>
                          <td>{value.geoFy19}</td>
                          <td>{value.geoFy20}</td>
                          <td>{value.country}</td>
                          <td>{value.leadPm}</td>
                          <td>{value.pmEmail}</td>
                          <td>{value.pmoLead}</td>
                          <td>{value.pmoEmail}</td>
                          <td>{value.customerName}</td>
                          <td>{value.reasonForNoSurvey}</td>
                          <td>{value.customerProjectName}</td>
                          <td>{value.customerContactNames}</td>
                          <td>{value.customerContactEmail}</td>
                          <td>{value.customerLanguage}</td>
                          <td>{value.mostRecentNote}</td>
                          <td>{value.q1OverallSatisfaction}</td>
                          <td>{value.q1aOverallSatisfactionComments}</td>
                          <td>
                            {value.q1aWhatDidYouAppreciateTheMostComments910}
                          </td>
                          <td>
                            {value.q1bWhatCouldHaveBeenDoneBetterComments08}
                          </td>
                          <td>{value.q2LikelihoodToRecommend}</td>
                          <td>{value.q2aRecommendComments}</td>
                          <td>{value.q3EaseOfUse}</td>
                          <td>{value.q3aEaseOfUseComments}</td>
                          <td>{value.q4ImplementationWithinTimelines}</td>
                          <td>{value.q5SolutionQuality}</td>
                          <td>{value.q6OverallCommunication}</td>
                          <td>{value.q7PmProfessionalism}</td>
                          <td>{value.q8TechnicalExpertise}</td>
                          <td>{value.commentsQ4Q8}</td>
                          <td>{value.csat}</td>
                          <td>{value.dsat}</td>
                          <td>{value.npsLabel}</td>
                          <td>{value.npsScore}</td>
                          <td>{value.ces}</td>
                          <td>{value.clcaStatus}</td>
                          <td>{value.clcaStatusDate}</td>
                          <td>{value.orcSurveyId}</td>
                        </tr>
                      </>
                    )
                  )}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
        {/* NPS Promoter */}
        <Modal show={this.state.IsNPSpromoter} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() => this.setState({ IsNPSpromoter: false })}
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              value={this.state.searchNPSPromoter}
              placeholder="Filter"
              className="filterInput mb-2"
              onChange={this.updateNPSPromoterSearch.bind(this)}
            />
            <CSVLink
              data={this.state.npslikelihoodtorecommendhappyarr}
              filename="NPSPromoterSurveyData.xls"
              key={Math.random()}
            >
              <i className="fa fa-download float-right" aria-hidden="true" />
            </CSVLink>
            <table
              className="table table-lg table-responsive table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.npslikelihoodtorecommendhappyarr}
                  onFilterUpdate={this._filterUpdatedlikelihoodtorecommendhappy}
                >
                  <th
                    className="cell servicetbheadersnoborderrad lgtable"
                    key="fy"
                    filterkey="fy"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    FY
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="q"
                    filterkey="q"
                  >
                    Quarter
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="wbs"
                    filterkey="wbs"
                    alignleft={"true"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="sfdcid"
                    filterkey="sfdcid"
                    alignleft={"true"}
                  >
                    SFDC ID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="accountStName"
                    filterkey="q8TechniaccountStNamecalExpertise"
                    alignleft={"true"}
                  >
                    Account ST Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="accountStId"
                    filterkey="accountStId"
                    alignleft={"true"}
                  >
                    Account ST ID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="ppmcRequestNo"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="status"
                    filterkey="status"
                    alignleft={"true"}
                  >
                    Status
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="statusDate"
                    filterkey="statusDate"
                    alignleft={"true"}
                  >
                    Status Date (UTC)
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="createdOn"
                    filterkey="createdOn"
                    alignleft={"true"}
                  >
                    Created On (UTC)
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="projectName"
                    filterkey="projectName"
                    alignleft={"true"}
                  >
                    Project Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="projectDescription"
                    filterkey="projectDescription"
                    alignleft={"true"}
                  >
                    Project Description
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="serviceLine"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="geoFy19"
                    filterkey="geoFy19"
                    alignleft={"true"}
                  >
                    Geo Fy19
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="geoFy20"
                    filterkey="geoFy20"
                    alignleft={"true"}
                  >
                    Geo Fy20
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="country"
                    filterkey="country"
                    alignleft={"true"}
                  >
                    Country
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="leadPm"
                    filterkey="leadPm"
                    alignleft={"true"}
                  >
                    Lead PM
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="pmEmail"
                    filterkey="pmEmail"
                    alignleft={"true"}
                  >
                    PM Email
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="pmoLead"
                    filterkey="pmoLead"
                    alignleft={"true"}
                  >
                    PMO Lead
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="pmoEmail"
                    filterkey="pmoEmail"
                    alignleft={"true"}
                  >
                    PMO Email
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="customerName"
                    filterkey="customerName"
                    alignleft={"true"}
                  >
                    Customer Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="reasonForNoSurvey"
                    filterkey="reasonForNoSurvey"
                    alignleft={"true"}
                  >
                    Reason For No Survey
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerProjectName"
                    filterkey="customerProjectName"
                    alignleft={"true"}
                  >
                    Customer Project Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerContactNames"
                    filterkey="customerContactNames"
                    alignleft={"true"}
                  >
                    Customer Contact Names
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerContactEmail"
                    filterkey="customerContactEmail"
                    alignleft={"true"}
                  >
                    Customer Contact Email
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerLanguage"
                    filterkey="customerLanguage"
                    alignleft={"true"}
                  >
                    Customer Language
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="mostRecentNote"
                    filterkey="mostRecentNote"
                    alignleft={"true"}
                  >
                    Most Recent Note
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="q1OverallSatisfaction"
                    filterkey="q1OverallSatisfaction"
                    alignleft={"true"}
                  >
                    Q1 - Overall Satisfaction
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q1aOverallSatisfactionComments"
                    filterkey="q1aOverallSatisfactionComments"
                    alignleft={"true"}
                  >
                    Q1a - Overall Satisfaction Comments
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw250"
                    key="q1aWhatDidYouAppreciateTheMostComments910"
                    filterkey="q1aWhatDidYouAppreciateTheMostComments910"
                    alignleft={"true"}
                  >
                    Q1a - What Did You Appreciate The Most Comments 910
                  </th>

                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw250 "
                    key="q1bWhatCouldHaveBeenDoneBetterComments08"
                    filterkey="q1bWhatCouldHaveBeenDoneBetterComments08"
                    alignleft={"true"}
                  >
                    Q1b - What Could Have Been Done Better Comments 08
                  </th>

                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q2LikelihoodToRecommend"
                    filterkey="q2LikelihoodToRecommend"
                    alignleft={"true"}
                  >
                    Q2 - Likelihood To Recommend
                  </th>

                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="q2aRecommendComments"
                    filterkey="q2aRecommendComments"
                    alignleft={"true"}
                  >
                    Q2a - Recommend Comments
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="q3EaseOfUse"
                    filterkey="q3EaseOfUse"
                    alignleft={"true"}
                  >
                    Q3 - Ease Of Use
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="q3aEaseOfUseComments"
                    filterkey="q3aEaseOfUseComments"
                    alignleft={"true"}
                  >
                    q3a - Ease Of Use Comments
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="q4ImplementationWithinTimelines"
                    filterkey="q4ImplementationWithinTimelines"
                    alignleft={"true"}
                  >
                    Q4 - Implementation Within Timelines
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q5SolutionQuality"
                    filterkey="q5SolutionQuality"
                    alignleft={"true"}
                  >
                    q5 - Solution Quality
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q6OverallCommunication"
                    filterkey="q6OverallCommunication"
                    alignleft={"true"}
                  >
                    Q6 - Overall Communication
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q7PmProfessionalism"
                    filterkey="q7PmProfessionalism"
                    alignleft={"true"}
                  >
                    Q7 - PM Professionalism
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="q8TechnicalExpertise"
                    filterkey="q8TechnicalExpertise"
                    alignleft={"true"}
                  >
                    Q8 - Technical Expertise
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="commentsQ4Q8"
                    filterkey="commentsQ4Q8"
                    alignleft={"true"}
                  >
                    comments Q4-Q8
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="csat"
                    filterkey="csat"
                    alignleft={"true"}
                  >
                    CSAT
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="dsat"
                    filterkey="dsat"
                    alignleft={"true"}
                  >
                    DSAT
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="npsLabel"
                    filterkey="npsLabel"
                    alignleft={"true"}
                  >
                    NPS Label
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="npsScore"
                    filterkey="npsScore"
                    alignleft={"true"}
                  >
                    NPS Score
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="ces"
                    filterkey="ces"
                    alignleft={"true"}
                  >
                    CES
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="clcaStatus"
                    filterkey="clcaStatus"
                    alignleft={"true"}
                  >
                    CLCA Status
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="clcaStatusDate"
                    filterkey="clcaStatusDate"
                    alignleft={"true"}
                  >
                    CLCA Status Date (UTC)
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="orcSurveyId"
                    filterkey="orcSurveyId"
                    alignleft={"true"}
                  >
                    ORC Survey ID
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.npslikelihoodtorecommendhappyarr.length == 0 && (
                  <tr>
                    <td colSpan="49">No Data to Show</td>
                  </tr>
                )}
                {!this.state.npslikelihoodtorecommendhappyarr.length == 0 &&
                  this.state.npslikelihoodtorecommendhappyarr.map(
                    (value, index) => (
                      <>
                        <tr>
                          <td>{value.fy}</td>
                          <td>{value.q}</td>
                          <td>{value.wbs}</td>
                          <td>{value.sfdcid}</td>
                          <td>{value.accountStName}</td>
                          <td>{value.accountStId}</td>
                          <td>{value.ppmcRequestNo}</td>
                          <td>{value.status}</td>
                          <td>{value.statusDate}</td>
                          <td>{value.createdOn}</td>
                          <td>{value.projectName}</td>
                          <td>{value.projectDescription}</td>
                          <td>{value.serviceLine}</td>
                          <td>{value.geoFy19}</td>
                          <td>{value.geoFy20}</td>
                          <td>{value.country}</td>
                          <td>{value.leadPm}</td>
                          <td>{value.pmEmail}</td>
                          <td>{value.pmoLead}</td>
                          <td>{value.pmoEmail}</td>
                          <td>{value.customerName}</td>
                          <td>{value.reasonForNoSurvey}</td>
                          <td>{value.customerProjectName}</td>
                          <td>{value.customerContactNames}</td>
                          <td>{value.customerContactEmail}</td>
                          <td>{value.customerLanguage}</td>
                          <td>{value.mostRecentNote}</td>
                          <td>{value.q1OverallSatisfaction}</td>
                          <td>{value.q1aOverallSatisfactionComments}</td>
                          <td>
                            {value.q1aWhatDidYouAppreciateTheMostComments910}
                          </td>
                          <td>
                            {value.q1bWhatCouldHaveBeenDoneBetterComments08}
                          </td>
                          <td>{value.q2LikelihoodToRecommend}</td>
                          <td>{value.q2aRecommendComments}</td>
                          <td>{value.q3EaseOfUse}</td>
                          <td>{value.q3aEaseOfUseComments}</td>
                          <td>{value.q4ImplementationWithinTimelines}</td>
                          <td>{value.q5SolutionQuality}</td>
                          <td>{value.q6OverallCommunication}</td>
                          <td>{value.q7PmProfessionalism}</td>
                          <td>{value.q8TechnicalExpertise}</td>
                          <td>{value.commentsQ4Q8}</td>
                          <td>{value.csat}</td>
                          <td>{value.dsat}</td>
                          <td>{value.npsLabel}</td>
                          <td>{value.npsScore}</td>
                          <td>{value.ces}</td>
                          <td>{value.clcaStatus}</td>
                          <td>{value.clcaStatusDate}</td>
                          <td>{value.orcSurveyId}</td>
                        </tr>
                      </>
                    )
                  )}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
        {/* NPS Neutral */}
        <Modal show={this.state.IsNPSNeutral} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() => this.setState({ IsNPSNeutral: false })}
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              value={this.state.searchNPSNeutral}
              placeholder="Filter"
              className="filterInput mb-2"
              onChange={this.updateNPSNeutralSearch.bind(this)}
            />
            <CSVLink
              data={this.state.npslikelihoodtorecommendflatarr}
              filename="NPSNeutralSurveyData.xls"
              key={Math.random()}
            >
              <i className="fa fa-download float-right" aria-hidden="true" />
            </CSVLink>
            <table
              className="table table-lg table-responsive table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.npslikelihoodtorecommendflatarr}
                  onFilterUpdate={this._filterUpdatedlikelihoodtorecommendflat}
                >
                  <th
                    className="cell servicetbheadersnoborderrad lgtable"
                    key="fy"
                    filterkey="fy"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    FY
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="q"
                    filterkey="q"
                  >
                    Quarter
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="wbs"
                    filterkey="wbs"
                    alignleft={"true"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="sfdcid"
                    filterkey="sfdcid"
                    alignleft={"true"}
                  >
                    SFDC ID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="accountStName"
                    filterkey="q8TechniaccountStNamecalExpertise"
                    alignleft={"true"}
                  >
                    Account ST Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="accountStId"
                    filterkey="accountStId"
                    alignleft={"true"}
                  >
                    Account ST ID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="ppmcRequestNo"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="status"
                    filterkey="status"
                    alignleft={"true"}
                  >
                    Status
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="statusDate"
                    filterkey="statusDate"
                    alignleft={"true"}
                  >
                    Status Date (UTC)
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="createdOn"
                    filterkey="createdOn"
                    alignleft={"true"}
                  >
                    Created On (UTC)
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="projectName"
                    filterkey="projectName"
                    alignleft={"true"}
                  >
                    Project Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="projectDescription"
                    filterkey="projectDescription"
                    alignleft={"true"}
                  >
                    Project Description
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="serviceLine"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="geoFy19"
                    filterkey="geoFy19"
                    alignleft={"true"}
                  >
                    Geo Fy19
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="geoFy20"
                    filterkey="geoFy20"
                    alignleft={"true"}
                  >
                    Geo Fy20
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="country"
                    filterkey="country"
                    alignleft={"true"}
                  >
                    Country
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="leadPm"
                    filterkey="leadPm"
                    alignleft={"true"}
                  >
                    Lead PM
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="pmEmail"
                    filterkey="pmEmail"
                    alignleft={"true"}
                  >
                    PM Email
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="pmoLead"
                    filterkey="pmoLead"
                    alignleft={"true"}
                  >
                    PMO Lead
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="pmoEmail"
                    filterkey="pmoEmail"
                    alignleft={"true"}
                  >
                    PMO Email
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="customerName"
                    filterkey="customerName"
                    alignleft={"true"}
                  >
                    Customer Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="reasonForNoSurvey"
                    filterkey="reasonForNoSurvey"
                    alignleft={"true"}
                  >
                    Reason For No Survey
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerProjectName"
                    filterkey="customerProjectName"
                    alignleft={"true"}
                  >
                    Customer Project Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerContactNames"
                    filterkey="customerContactNames"
                    alignleft={"true"}
                  >
                    Customer Contact Names
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerContactEmail"
                    filterkey="customerContactEmail"
                    alignleft={"true"}
                  >
                    Customer Contact Email
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerLanguage"
                    filterkey="customerLanguage"
                    alignleft={"true"}
                  >
                    Customer Language
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="mostRecentNote"
                    filterkey="mostRecentNote"
                    alignleft={"true"}
                  >
                    Most Recent Note
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="q1OverallSatisfaction"
                    filterkey="q1OverallSatisfaction"
                    alignleft={"true"}
                  >
                    Q1 - Overall Satisfaction
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q1aOverallSatisfactionComments"
                    filterkey="q1aOverallSatisfactionComments"
                    alignleft={"true"}
                  >
                    Q1a - Overall Satisfaction Comments
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw250"
                    key="q1aWhatDidYouAppreciateTheMostComments910"
                    filterkey="q1aWhatDidYouAppreciateTheMostComments910"
                    alignleft={"true"}
                  >
                    Q1a - What Did You Appreciate The Most Comments 910
                  </th>

                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw250 "
                    key="q1bWhatCouldHaveBeenDoneBetterComments08"
                    filterkey="q1bWhatCouldHaveBeenDoneBetterComments08"
                    alignleft={"true"}
                  >
                    Q1b - What Could Have Been Done Better Comments 08
                  </th>

                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q2LikelihoodToRecommend"
                    filterkey="q2LikelihoodToRecommend"
                    alignleft={"true"}
                  >
                    Q2 - Likelihood To Recommend
                  </th>

                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="q2aRecommendComments"
                    filterkey="q2aRecommendComments"
                    alignleft={"true"}
                  >
                    Q2a - Recommend Comments
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="q3EaseOfUse"
                    filterkey="q3EaseOfUse"
                    alignleft={"true"}
                  >
                    Q3 - Ease Of Use
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="q3aEaseOfUseComments"
                    filterkey="q3aEaseOfUseComments"
                    alignleft={"true"}
                  >
                    q3a - Ease Of Use Comments
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="q4ImplementationWithinTimelines"
                    filterkey="q4ImplementationWithinTimelines"
                    alignleft={"true"}
                  >
                    Q4 - Implementation Within Timelines
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q5SolutionQuality"
                    filterkey="q5SolutionQuality"
                    alignleft={"true"}
                  >
                    q5 - Solution Quality
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q6OverallCommunication"
                    filterkey="q6OverallCommunication"
                    alignleft={"true"}
                  >
                    Q6 - Overall Communication
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q7PmProfessionalism"
                    filterkey="q7PmProfessionalism"
                    alignleft={"true"}
                  >
                    Q7 - PM Professionalism
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="q8TechnicalExpertise"
                    filterkey="q8TechnicalExpertise"
                    alignleft={"true"}
                  >
                    Q8 - Technical Expertise
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="commentsQ4Q8"
                    filterkey="commentsQ4Q8"
                    alignleft={"true"}
                  >
                    comments Q4-Q8
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="csat"
                    filterkey="csat"
                    alignleft={"true"}
                  >
                    CSAT
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="dsat"
                    filterkey="dsat"
                    alignleft={"true"}
                  >
                    DSAT
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="npsLabel"
                    filterkey="npsLabel"
                    alignleft={"true"}
                  >
                    NPS Label
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="npsScore"
                    filterkey="npsScore"
                    alignleft={"true"}
                  >
                    NPS Score
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="ces"
                    filterkey="ces"
                    alignleft={"true"}
                  >
                    CES
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="clcaStatus"
                    filterkey="clcaStatus"
                    alignleft={"true"}
                  >
                    CLCA Status
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="clcaStatusDate"
                    filterkey="clcaStatusDate"
                    alignleft={"true"}
                  >
                    CLCA Status Date (UTC)
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="orcSurveyId"
                    filterkey="orcSurveyId"
                    alignleft={"true"}
                  >
                    ORC Survey ID
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.npslikelihoodtorecommendflatarr.length == 0 && (
                  <tr>
                    <td colSpan="49">No Data to Show</td>
                  </tr>
                )}
                {!this.state.npslikelihoodtorecommendflatarr.length == 0 &&
                  this.state.npslikelihoodtorecommendflatarr.map(
                    (value, index) => (
                      <>
                        <tr>
                          <td>{value.fy}</td>
                          <td>{value.q}</td>
                          <td>{value.wbs}</td>
                          <td>{value.sfdcid}</td>
                          <td>{value.accountStName}</td>
                          <td>{value.accountStId}</td>
                          <td>{value.ppmcRequestNo}</td>
                          <td>{value.status}</td>
                          <td>{value.statusDate}</td>
                          <td>{value.createdOn}</td>
                          <td>{value.projectName}</td>
                          <td>{value.projectDescription}</td>
                          <td>{value.serviceLine}</td>
                          <td>{value.geoFy19}</td>
                          <td>{value.geoFy20}</td>
                          <td>{value.country}</td>
                          <td>{value.leadPm}</td>
                          <td>{value.pmEmail}</td>
                          <td>{value.pmoLead}</td>
                          <td>{value.pmoEmail}</td>
                          <td>{value.customerName}</td>
                          <td>{value.reasonForNoSurvey}</td>
                          <td>{value.customerProjectName}</td>
                          <td>{value.customerContactNames}</td>
                          <td>{value.customerContactEmail}</td>
                          <td>{value.customerLanguage}</td>
                          <td>{value.mostRecentNote}</td>
                          <td>{value.q1OverallSatisfaction}</td>
                          <td>{value.q1aOverallSatisfactionComments}</td>
                          <td>
                            {value.q1aWhatDidYouAppreciateTheMostComments910}
                          </td>
                          <td>
                            {value.q1bWhatCouldHaveBeenDoneBetterComments08}
                          </td>
                          <td>{value.q2LikelihoodToRecommend}</td>
                          <td>{value.q2aRecommendComments}</td>
                          <td>{value.q3EaseOfUse}</td>
                          <td>{value.q3aEaseOfUseComments}</td>
                          <td>{value.q4ImplementationWithinTimelines}</td>
                          <td>{value.q5SolutionQuality}</td>
                          <td>{value.q6OverallCommunication}</td>
                          <td>{value.q7PmProfessionalism}</td>
                          <td>{value.q8TechnicalExpertise}</td>
                          <td>{value.commentsQ4Q8}</td>
                          <td>{value.csat}</td>
                          <td>{value.dsat}</td>
                          <td>{value.npsLabel}</td>
                          <td>{value.npsScore}</td>
                          <td>{value.ces}</td>
                          <td>{value.clcaStatus}</td>
                          <td>{value.clcaStatusDate}</td>
                          <td>{value.orcSurveyId}</td>
                        </tr>
                      </>
                    )
                  )}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
        {/* NPS Detractor */}
        <Modal show={this.state.IsNPSDetractor} size="lg">
          <Modal.Header as="section">
            <Modal.Title className="ibheadertext col-12" as="div">
              <a
                className="float-right pointer"
                onClick={() => this.setState({ IsNPSDetractor: false })}
                translate="no"
              >
                X
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              value={this.state.searchNPSDetractor}
              placeholder="Filter"
              className="filterInput mb-2"
              onChange={this.updateNPSDetractorSearch.bind(this)}
            />
            <CSVLink
              data={this.state.npslikelihoodtorecommendsadarr}
              filename="NPSDetractorSurveyData.xls"
              key={Math.random()}
            >
              <i className="fa fa-download float-right" aria-hidden="true" />
            </CSVLink>
            <table
              className="table table-lg table-responsive table-bordered table-font-size"
              width="100%"
              cellSpacing="0"
              cellPadding="0"
              border="0"
              align="center"
            >
              <thead>
                <TableFilter
                  rows={this.state.npslikelihoodtorecommendsadarr}
                  onFilterUpdate={this._filterUpdatedlikelihoodtorecommendsad}
                >
                  <th
                    className="cell servicetbheadersnoborderrad lgtable"
                    key="fy"
                    filterkey="fy"
                    casesensitive={"false"}
                    showsearch={"false"}
                  >
                    FY
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="q"
                    filterkey="q"
                  >
                    Quarter
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="wbs"
                    filterkey="wbs"
                    alignleft={"true"}
                  >
                    WBS
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="sfdcid"
                    filterkey="sfdcid"
                    alignleft={"true"}
                  >
                    SFDC ID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="accountStName"
                    filterkey="q8TechniaccountStNamecalExpertise"
                    alignleft={"true"}
                  >
                    Account ST Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="accountStId"
                    filterkey="accountStId"
                    alignleft={"true"}
                  >
                    Account ST ID
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="ppmcRequestNo"
                    filterkey="ppmcRequestNo"
                    alignleft={"true"}
                  >
                    PPMC Request No
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="status"
                    filterkey="status"
                    alignleft={"true"}
                  >
                    Status
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="statusDate"
                    filterkey="statusDate"
                    alignleft={"true"}
                  >
                    Status Date (UTC)
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="createdOn"
                    filterkey="createdOn"
                    alignleft={"true"}
                  >
                    Created On (UTC)
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="projectName"
                    filterkey="projectName"
                    alignleft={"true"}
                  >
                    Project Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="projectDescription"
                    filterkey="projectDescription"
                    alignleft={"true"}
                  >
                    Project Description
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="serviceLine"
                    filterkey="serviceLine"
                    alignleft={"true"}
                  >
                    Service Line
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="geoFy19"
                    filterkey="geoFy19"
                    alignleft={"true"}
                  >
                    Geo Fy19
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="geoFy20"
                    filterkey="geoFy20"
                    alignleft={"true"}
                  >
                    Geo Fy20
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="country"
                    filterkey="country"
                    alignleft={"true"}
                  >
                    Country
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="leadPm"
                    filterkey="leadPm"
                    alignleft={"true"}
                  >
                    Lead PM
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="pmEmail"
                    filterkey="pmEmail"
                    alignleft={"true"}
                  >
                    PM Email
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="pmoLead"
                    filterkey="pmoLead"
                    alignleft={"true"}
                  >
                    PMO Lead
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="pmoEmail"
                    filterkey="pmoEmail"
                    alignleft={"true"}
                  >
                    PMO Email
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="customerName"
                    filterkey="customerName"
                    alignleft={"true"}
                  >
                    Customer Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="reasonForNoSurvey"
                    filterkey="reasonForNoSurvey"
                    alignleft={"true"}
                  >
                    Reason For No Survey
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerProjectName"
                    filterkey="customerProjectName"
                    alignleft={"true"}
                  >
                    Customer Project Name
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerContactNames"
                    filterkey="customerContactNames"
                    alignleft={"true"}
                  >
                    Customer Contact Names
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerContactEmail"
                    filterkey="customerContactEmail"
                    alignleft={"true"}
                  >
                    Customer Contact Email
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="customerLanguage"
                    filterkey="customerLanguage"
                    alignleft={"true"}
                  >
                    Customer Language
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="mostRecentNote"
                    filterkey="mostRecentNote"
                    alignleft={"true"}
                  >
                    Most Recent Note
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="q1OverallSatisfaction"
                    filterkey="q1OverallSatisfaction"
                    alignleft={"true"}
                  >
                    Q1 - Overall Satisfaction
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q1aOverallSatisfactionComments"
                    filterkey="q1aOverallSatisfactionComments"
                    alignleft={"true"}
                  >
                    Q1a - Overall Satisfaction Comments
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw250"
                    key="q1aWhatDidYouAppreciateTheMostComments910"
                    filterkey="q1aWhatDidYouAppreciateTheMostComments910"
                    alignleft={"true"}
                  >
                    Q1a - What Did You Appreciate The Most Comments 910
                  </th>

                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw250 "
                    key="q1bWhatCouldHaveBeenDoneBetterComments08"
                    filterkey="q1bWhatCouldHaveBeenDoneBetterComments08"
                    alignleft={"true"}
                  >
                    Q1b - What Could Have Been Done Better Comments 08
                  </th>

                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q2LikelihoodToRecommend"
                    filterkey="q2LikelihoodToRecommend"
                    alignleft={"true"}
                  >
                    Q2 - Likelihood To Recommend
                  </th>

                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="q2aRecommendComments"
                    filterkey="q2aRecommendComments"
                    alignleft={"true"}
                  >
                    Q2a - Recommend Comments
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="q3EaseOfUse"
                    filterkey="q3EaseOfUse"
                    alignleft={"true"}
                  >
                    Q3 - Ease Of Use
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="q3aEaseOfUseComments"
                    filterkey="q3aEaseOfUseComments"
                    alignleft={"true"}
                  >
                    q3a - Ease Of Use Comments
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="q4ImplementationWithinTimelines"
                    filterkey="q4ImplementationWithinTimelines"
                    alignleft={"true"}
                  >
                    Q4 - Implementation Within Timelines
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q5SolutionQuality"
                    filterkey="q5SolutionQuality"
                    alignleft={"true"}
                  >
                    q5 - Solution Quality
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q6OverallCommunication"
                    filterkey="q6OverallCommunication"
                    alignleft={"true"}
                  >
                    Q6 - Overall Communication
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="q7PmProfessionalism"
                    filterkey="q7PmProfessionalism"
                    alignleft={"true"}
                  >
                    Q7 - PM Professionalism
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw100"
                    key="q8TechnicalExpertise"
                    filterkey="q8TechnicalExpertise"
                    alignleft={"true"}
                  >
                    Q8 - Technical Expertise
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw200"
                    key="commentsQ4Q8"
                    filterkey="commentsQ4Q8"
                    alignleft={"true"}
                  >
                    comments Q4-Q8
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="csat"
                    filterkey="csat"
                    alignleft={"true"}
                  >
                    CSAT
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="dsat"
                    filterkey="dsat"
                    alignleft={"true"}
                  >
                    DSAT
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="npsLabel"
                    filterkey="npsLabel"
                    alignleft={"true"}
                  >
                    NPS Label
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="npsScore"
                    filterkey="npsScore"
                    alignleft={"true"}
                  >
                    NPS Score
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="ces"
                    filterkey="ces"
                    alignleft={"true"}
                  >
                    CES
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw90"
                    key="clcaStatus"
                    filterkey="clcaStatus"
                    alignleft={"true"}
                  >
                    CLCA Status
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="clcaStatusDate"
                    filterkey="clcaStatusDate"
                    alignleft={"true"}
                  >
                    CLCA Status Date (UTC)
                  </th>
                  <th
                    className="cell servicetbheadersnoborderrad lgtable mw150"
                    key="orcSurveyId"
                    filterkey="orcSurveyId"
                    alignleft={"true"}
                  >
                    ORC Survey ID
                  </th>
                </TableFilter>
              </thead>
              <tbody>
                {this.state.npslikelihoodtorecommendsadarr.length == 0 && (
                  <tr>
                    <td colSpan="49">No Data to Show</td>
                  </tr>
                )}
                {!this.state.npslikelihoodtorecommendsadarr.length == 0 &&
                  this.state.npslikelihoodtorecommendsadarr.map(
                    (value, index) => (
                      <>
                        <tr>
                          <td>{value.fy}</td>
                          <td>{value.q}</td>
                          <td>{value.wbs}</td>
                          <td>{value.sfdcid}</td>
                          <td>{value.accountStName}</td>
                          <td>{value.accountStId}</td>
                          <td>{value.ppmcRequestNo}</td>
                          <td>{value.status}</td>
                          <td>{value.statusDate}</td>
                          <td>{value.createdOn}</td>
                          <td>{value.projectName}</td>
                          <td>{value.projectDescription}</td>
                          <td>{value.serviceLine}</td>
                          <td>{value.geoFy19}</td>
                          <td>{value.geoFy20}</td>
                          <td>{value.country}</td>
                          <td>{value.leadPm}</td>
                          <td>{value.pmEmail}</td>
                          <td>{value.pmoLead}</td>
                          <td>{value.pmoEmail}</td>
                          <td>{value.customerName}</td>
                          <td>{value.reasonForNoSurvey}</td>
                          <td>{value.customerProjectName}</td>
                          <td>{value.customerContactNames}</td>
                          <td>{value.customerContactEmail}</td>
                          <td>{value.customerLanguage}</td>
                          <td>{value.mostRecentNote}</td>
                          <td>{value.q1OverallSatisfaction}</td>
                          <td>{value.q1aOverallSatisfactionComments}</td>
                          <td>
                            {value.q1aWhatDidYouAppreciateTheMostComments910}
                          </td>
                          <td>
                            {value.q1bWhatCouldHaveBeenDoneBetterComments08}
                          </td>
                          <td>{value.q2LikelihoodToRecommend}</td>
                          <td>{value.q2aRecommendComments}</td>
                          <td>{value.q3EaseOfUse}</td>
                          <td>{value.q3aEaseOfUseComments}</td>
                          <td>{value.q4ImplementationWithinTimelines}</td>
                          <td>{value.q5SolutionQuality}</td>
                          <td>{value.q6OverallCommunication}</td>
                          <td>{value.q7PmProfessionalism}</td>
                          <td>{value.q8TechnicalExpertise}</td>
                          <td>{value.commentsQ4Q8}</td>
                          <td>{value.csat}</td>
                          <td>{value.dsat}</td>
                          <td>{value.npsLabel}</td>
                          <td>{value.npsScore}</td>
                          <td>{value.ces}</td>
                          <td>{value.clcaStatus}</td>
                          <td>{value.clcaStatusDate}</td>
                          <td>{value.orcSurveyId}</td>
                        </tr>
                      </>
                    )
                  )}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
      </Fragment>
    );
  }
}
export default CXSurvey;

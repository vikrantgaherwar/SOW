import { useSelector, shallowEqual } from "react-redux";
import CryptoJS from "crypto-js";
import URLConfig from "../../../URLConfig";

const GeneratePreviewComponent = () => {
  const templatePath = useSelector(
    (state) => state.generatePreview.res.templateOutputPath,
    shallowEqual
  );
  const getDocumentUrl = () => {
    let filepath = CryptoJS.enc.Utf8.parse(templatePath);
    filepath = CryptoJS.enc.Base64.stringify(filepath);
    const URL = URLConfig.getURL_SOWDocViewer();
    console.log({ url: URL + filepath });
    return URL + filepath;
  };
  return (
    <div className="sow-preview-cp">
      <iframe
        frameBorder="0"
        allowFullScreen
        src={getDocumentUrl()}
        onLoad={() => {
          //   setLoader(false);
        }}
      />
    </div>
  );
};

export default GeneratePreviewComponent;

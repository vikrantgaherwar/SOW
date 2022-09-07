
const ModuleSelectionSlider = (props) => {


  const handleSliderClick = () => {
    props.toggleSlider();
  }

  const show = props.visible ?? false;
  return (
    <>
      {show && (
        <div
          onClick={handleSliderClick}
          className="slider_text mt-1 mb-1 pt-2 pb-2 slider-pop"
        >
          Modules
        </div>
      )}
    </>
  );
}

export default ModuleSelectionSlider;
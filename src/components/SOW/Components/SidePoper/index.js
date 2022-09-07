const SidePopper = ({ title, toggle, show, pos = "left" }) => {
  const handleSliderClick = () => {
    toggle();
  };

  const visible = show ?? false;
  return (
    <>
      {visible && (
        <div
          onClick={handleSliderClick}
          className={`slider_text mt-1 mb-1 pt-2 pb-2 slider-pop-${pos}`}
        >
          {title}
        </div>
      )}
    </>
  );
};

export default SidePopper;

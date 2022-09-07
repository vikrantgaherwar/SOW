const MyCol = ({ size, children }) => {
  return (
    <div style={{ display: "flex", flex: size, alignItems: "center" }}>
      {children}
    </div>
  );
};

export default MyCol;

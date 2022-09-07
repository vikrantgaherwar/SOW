const RolesDropdown = ({ selectedRoleValues, Roles, onChange }) => {
  return (
    <div className="dropdown">
      <i
        id="dropdownMenuButton"
        style={{ fontSize: "17px", color: "green" }}
        className="fa fa-caret-down"
        aria-hidden="true"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      />
      &nbsp;
      {selectedRoleValues.length > 0
        ? selectedRoleValues.join(", ")
        : "Select roles"}
      <div
        className="dropdown-menu role-drp-dwn"
        aria-labelledby="dropdownMenuButton"
      >
        <p style={{ fontSize: "12px" }}>
          <input
            onChange={onChange}
            value={0}
            type="checkbox"
            name="selectAll"
          />
          &nbsp; Select All
        </p>
        {Roles.map((r, i) => (
          <p style={{ fontSize: "12px" }} key={`${r}_${i}`}>
            <input
              onChange={onChange}
              value={r.label}
              type="checkbox"
              name={r.value}
              checked={selectedRoleValues.indexOf(r.label) > -1}
            />
            &nbsp;
            {r.label}
          </p>
        ))}
      </div>
    </div>
  );
};

export default RolesDropdown;

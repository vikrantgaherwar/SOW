import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { Form } from "react-bootstrap";
const SearchDropDown = ({ value, list, onChange, name, fuse, idx }) => {
  const [search, setSearch] = useState(value);
  const [searchList, setSearchList] = useState(list.map((e) => e));
  const [isSelected, setIsSelected] = useState(false);
  const [width, setWidth] = useState(0);
  const ddRef = useRef(null);
  const searchRef = useRef();

  const handleClickOutside = (e) => {
    if (ddRef.current && !ddRef.current.contains(e.target)) {
      setIsSelected(false);
    }
  };

  const doSearch = () => {
    // console.log("Searching");
    setSearchList(
      list.filter((ele) =>
        search.trim().length === 0
          ? true
          : ele.resourceType.toLowerCase().indexOf(search.toLowerCase()) > -1
      )
    );
  };

  const handleResize = (e) => {
    if (ddRef.current) {
      // console.log(ddRef.current);
      setWidth(ddRef.current.clientWidth);
    }
  };
  useEffect(() => {
    setSearch(value);
  }, [value]);

  useEffect(() => {
    if (searchRef.current) {
      clearTimeout(searchRef.current);
    }
    setTimeout(doSearch, fuse ?? 300);
  }, [search]);

  useEffect(() => {
    setSearchList(list);
  }, [list]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    window.addEventListener("resize", handleResize, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
      window.removeEventListener("resize", handleResize, true);
    };
  }, []);
  return (
    <div className="dd-wrapper" ref={ddRef}>
      <Form.Control
        size="sm"
        autoComplete="off"
        data-testid={`${name}_${idx}`}
        onBlur={(e) => setSearch(value)}
        onSelect={(e) => {
          handleResize();
          setIsSelected(true);
        }}
        name={`noOfResources`}
        type="text"
        value={search}
        className="dd-searchbar"
        onChange={(e) => {
          const value = e.target.value;
          setSearch(value);
          if (list.find((ele) => ele.resourceType === value)) {
            const ob = {
              target: {
                value: value,
              },
            };
            onChange(ob);
            console.log("match");
          }
        }}
        placeholder="Resource Type"
      />
      {isSelected && (
        <div className="my-custom-dropdown" style={{ width: `${width}px` }}>
          {searchList.map((e, index) => (
            <div
              className="dd-element"
              onClick={(ev) => {
                setSearch(e.resourceType);
                const ob = {
                  target: {
                    value: e.resourceType,
                  },
                };
                onChange(ob);
                setIsSelected(false);
              }}
              key={`${e.resourceType}_${index}`}
              value={e.resourceType}
            >
              {e.resourceType}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchDropDown;

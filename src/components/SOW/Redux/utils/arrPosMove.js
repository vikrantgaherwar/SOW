export const arrPosMove = (arr, initial, final) => {
  let newArr = [...arr];
  let i;
  let tmp;
  if (
    initial !== final &&
    0 <= initial &&
    initial <= newArr.length &&
    0 <= final &&
    final <= newArr.length
  ) {
    // save element from position 1
    tmp = newArr[initial];
    // move element down and shift other elements up
    if (initial < final) {
      for (i = initial; i < final; i++) {
        newArr[i] = newArr[i + 1];
      }
    }
    // move element up and shift other elements down
    else {
      for (i = initial; i > final; i--) {
        newArr[i] = newArr[i - 1];
      }
    }
    // put element from position 1 to destination
    newArr[final] = tmp;
  }

  return newArr;
};

export const findWorkPackageId = (id, data) => {
  return data.findIndex((e) =>
    e.sectionName ? e.workPackageId : e[0].workPackageId === id
  );
};

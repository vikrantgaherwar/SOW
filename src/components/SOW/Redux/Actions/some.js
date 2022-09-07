const fs = require("fs");

fs.readdir("./", (err, folders) => {
  if (err) {
    return;
  }

  folders.forEach((folder) => {
    fs.readdir(`./${folder}`, (err, files) => {
      //   console.log();
      if (err) {
        return;
      }

      files.forEach((file) => {
        if (
          file.endsWith("Type.js") ||
          file.endsWith("Data.js") ||
          file.endsWith("Types.js")
        ) {
          fs.readFile(`./${folder}/${file}`, (err, data) => {
            if (err) {
              return;
            }
            const str = data.toString();
            const nameEnd = str.indexOf("=") - 1;
            const name = str.substring(
              str.indexOf("export const ") + "export const ".length,
              str.indexOf("=") - 1
            );
            // console.log({ name });
            const rest = str
              .substring(nameEnd + 2)
              .split("\r\n")
              .map((e) => {
                const k = e.trim();
                if (k.startsWith("{") || k.startsWith("}") || k.length === 0) {
                  return k;
                } else {
                  const [fieldName, _] = k.split(":");
                  return `${fieldName} : "${name}.${fieldName}",`;
                }
              })
              .join("\n");

            const newFileData = `export const ${name} = ${rest}`;

            fs.writeFile(`./${folder}/${file}`, newFileData, {}, (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log(`Wrote ${file}`);
              }
            });

            // const json = str.substring(str.indexOf("{"), str.indexOf("}"));
            // console.log({ rest });

            // const json = JSON.parse(rest);
            // console.log({ json });
            // console.log(str);
          });
          //   console.log({ file });
        }
      });
      //   console.log({ files });
    });
  });
  //   console.log({ folders });
});

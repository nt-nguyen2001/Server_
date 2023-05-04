const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "ntnguyen710",
  api_key: "993986255736253",
  api_secret: "PlezvXXuVPeLZTW_QJtXXfMY31E",
});

export async function DeleteImage(image: string, folder?: string) {
  const regex = /.*(?=(.jpg)$|(.png)$|(.jpeg)$)/g;
  const urlImage = image.match(regex)?.[0];
  const urlSplit = urlImage?.split("/");
  const url = `${urlSplit?.[urlSplit.length - 2]}/${
    urlSplit?.[urlSplit.length - 1]
  }`;
  if (folder) {
    cloudinary.api.delete_resources_by_prefix(
      folder,
      function (result: any, err: any) {
        console.log("resources", err);
        cloudinary.api.delete_folder(folder, (result: any, err: any) => {
          console.log(err);
        });
      }
    );
    return;
  }
  cloudinary.uploader.destroy(url, (result: any, err: any) => {
    console.log(err);
  });
}
